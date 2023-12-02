from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.linalg import Vectors
from pyspark.sql.functions import udf
from pyspark.ml.linalg import VectorUDT, DenseVector

from pyspark.sql.types import StructType, StructField, FloatType, IntegerType, StringType, ArrayType, DoubleType

from tensorflow import keras

import os
import sys
os.environ['PYSPARK_PYTHON'] = sys.executable
os.environ['PYSPARK_DRIVER_PYTHON'] = sys.executable

spark = SparkSession.builder.appName("XGBoost").getOrCreate()

class Inference():
    
    def parser(x):
        if x is None:
            return None
        elements = x.strip('[]').split(' ')
        result = [float(i) for i in elements if i.strip() != '']
        return (result) if result else None
    
    def convert_embed(df):
        df["parsed_embeddings"] = Inference.parser(df["embeddings_distilbert"])
        return df
        
    def make_it_vector(data):
        vector_udf = udf(lambda a: Vectors.dense(a), VectorUDT())
        data = data.withColumn("parsed_embeddings_vector", vector_udf(data["parsed_embeddings"]))   
        return data
    
    def final_parse(df):
        temp = Inference.convert_embed(df)

        schema = StructType([
            StructField("label", IntegerType(), True),
            StructField("word count", IntegerType(), True),
            StructField("count_word", IntegerType(), True),
            StructField("count_unique_word", IntegerType(), True),
            StructField("count_letters", IntegerType(), True),
            StructField("count_punctuations", IntegerType(), True),
            StructField("count_words_upper", IntegerType(), True),
            StructField("count_words_title", IntegerType(), True),
            StructField("count_stopwords", IntegerType(), True),
            StructField("mean_word_len", DoubleType(), True),
            StructField("word_unique_percent", DoubleType(), True),
            StructField("punct_percent", DoubleType(), True),
            StructField("reviews_pre", StringType(), True),
            StructField("embeddings_distilbert", StringType(), True),
            StructField("parsed_embeddings", ArrayType(FloatType(), containsNull=True), True)
        ])
        
        data = spark.createDataFrame([temp], schema=schema)
        data = Inference.make_it_vector(data)
        return data
        
    def infer(df):
        data = Inference.final_parse(df)
        
        feature_cols = data.columns[1:-4] + data.columns[-1:]
        assembler = VectorAssembler(inputCols=feature_cols, outputCol="features")
        data = assembler.transform(data)
        
        pred = []
        
        model = model.load("../models/CNN.keras")
        pred.append(model.predict(data["reviews_pre"]))
        
        model = model.load("../models/LSTM.keras")
        pred.append(model.predict(data["reviews_pre"]))
        
        model = model.load("../models/NN.keras")
        pred.append(model.predict(data["reviews_pre"]))
        
        from xgboost.spark import SparkXGBClassifierModel
        model_path = "models/pyspark_distilbert_XGB_model"
        model = SparkXGBClassifierModel.load(model_path)
        predictions = model.transform(data)
        pred.append(predictions.select("prediction").collect()[0][0])
        
        from pyspark.ml.classification import NaiveBayesModel
        model_path = "models/pyspark_distilbert_NB_model"
        nb_model = NaiveBayesModel.load(model_path)
        predictions_nb = nb_model.transform(data)
        pred.append(predictions_nb.select("prediction").collect()[0][0])
        
        from pyspark.ml.classification import LinearSVCModel
        model_path = "models/pyspark_distilbert_SVM_model"
        model = LinearSVCModel.load(model_path)
        predictions = model.transform(data)
        pred.append(predictions.select("prediction").collect()[0][0])
        
        from pyspark.ml.classification import RandomForestClassifier
        model_path = "models/pyspark_distilbert_RF_model"
        model = RandomForestClassifier.load(model_path)
        predictions = model.transform(data)
        pred.append(predictions.select("prediction").collect()[0][0])

        from pyspark.ml.classification import LogisticRegressionModel
        model_path = "models/pyspark_distilbert_LR_model"
        lr_model = LogisticRegressionModel.load(model_path)
        predictions_lr = lr_model.transform(data)
        pred.append(predictions_lr.select("prediction").collect()[0][0])
        
        avg_pred = sum(pred)/8
        final_pred = 1.0 if avg_pred >= 0.5 else 0.0
        print("final_pred", final_pred)
        
        return final_pred
