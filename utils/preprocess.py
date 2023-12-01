import pandas as pd
import numpy as np

import os
import sys

import re
import string
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

from sentence_transformers import SentenceTransformer

mapping = {"ain't": "is not", "aren't": "are not","can't": "cannot", "'cause": "because", "could've": "could have", "couldn't": "could not", "didn't": "did not",  "doesn't": "does not", "don't": "do not", "hadn't": "had not", "hasn't": "has not", "haven't": "have not", "he'd": "he would","he'll": "he will", "he's": "he is", "how'd": "how did", "how'd'y": "how do you", "how'll": "how will", "how's": "how is",  "I'd": "I would", "I'd've": "I would have", "I'll": "I will", "I'll've": "I will have","I'm": "I am", "I've": "I have", "i'd": "i would", "i'd've": "i would have", "i'll": "i will",  "i'll've": "i will have","i'm": "i am", "i've": "i have", "isn't": "is not", "it'd": "it would", "it'd've": "it would have", "it'll": "it will", "it'll've": "it will have","it's": "it is", "let's": "let us", "ma'am": "madam", "mayn't": "may not", "might've": "might have","mightn't": "might not","mightn't've": "might not have", "must've": "must have", "mustn't": "must not", "mustn't've": "must not have", "needn't": "need not", "needn't've": "need not have","o'clock": "of the clock", "oughtn't": "ought not", "oughtn't've": "ought not have", "shan't": "shall not", "sha'n't": "shall not", "shan't've": "shall not have", "she'd": "she would", "she'd've": "she would have", "she'll": "she will", "she'll've": "she will have", "she's": "she is", "should've": "should have", "shouldn't": "should not", "shouldn't've": "should not have", "so've": "so have","so's": "so as", "this's": "this is","that'd": "that would", "that'd've": "that would have", "that's": "that is", "there'd": "there would", "there'd've": "there would have", "there's": "there is", "here's": "here is","they'd": "they would", "they'd've": "they would have", "they'll": "they will", "they'll've": "they will have", "they're": "they are", "they've": "they have", "to've": "to have", "wasn't": "was not", "we'd": "we would", "we'd've": "we would have", "we'll": "we will", "we'll've": "we will have", "we're": "we are", "we've": "we have", "weren't": "were not", "what'll": "what will", "what'll've": "what will have", "what're": "what are",  "what's": "what is", "what've": "what have", "when's": "when is", "when've": "when have", "where'd": "where did", "where's": "where is", "where've": "where have", "who'll": "who will", "who'll've": "who will have", "who's": "who is", "who've": "who have", "why's": "why is", "why've": "why have", "will've": "will have", "won't": "will not", "won't've": "will not have", "would've": "would have", "wouldn't": "would not", "wouldn't've": "would not have", "y'all": "you all", "y'all'd": "you all would","y'all'd've": "you all would have","y'all're": "you all are","y'all've": "you all have","you'd": "you would", "you'd've": "you would have", "you'll": "you will", "you'll've": "you will have", "you're": "you are", "you've": "you have" }
PUNCT_TO_REMOVE = string.punctuation
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
STOPWORDS = set(stopwords.words('english'))

glove_file = 'data/embeddings/glove.6B.50d.txt'

class Transform():
    
    def gen_features(sentence):
        eng_stopwords = set(stopwords.words("english"))

        df = {}
        df["label"] = -1
        #Word count in each comment:
        df['count_word'] = len(sentence.split())
        df["word count"] = df["count_word"]
        #Unique word count
        df['count_unique_word'] = len(set(str(sentence).split()))
        #Letter count
        df['count_letters'] = len(str(sentence))
        #punctuation count
        df["count_punctuations"] = len([c for c in str(sentence) if c in string.punctuation])
        #upper case words count
        df["count_words_upper"] = len([w for w in str(sentence).split() if w.isupper()])
        #title case words count
        df["count_words_title"] = len([w for w in str(sentence).split() if w.istitle()])
        #Number of stopwords
        df["count_stopwords"] = len([w for w in str(sentence).lower().split() if w in eng_stopwords])
        #Average length of the words
        df["mean_word_len"] = float(np.mean([len(w) for w in str(sentence).split()]))
        #Word count percent in each comment:
        df['word_unique_percent']=df['count_unique_word']*100/df['count_word']
        #Punct percent in each comment:
        df['punct_percent']=df['count_punctuations']*100/df['count_word']
        #derived features
        #Word count percent in each comment:
        df['word_unique_percent']=df['count_unique_word']*100/df['count_word']
        #derived features
        #Punct percent in each comment:
        df['punct_percent']=df['count_punctuations']*100/df['count_word']
        
        return df
    
    def remove_punctuation(text):
        return text.translate(str.maketrans('', '', PUNCT_TO_REMOVE))

    def clean_contractions(text, mapping):
        specials = ["’", "‘", "´", "`"]
        for s in specials:
            text = text.replace(s, "'")
        text = ' '.join([mapping[t] if t in mapping else t for t in text.split(" ")])
        return text

    def remove_stopwords(text):
        return " ".join([word for word in str(text).split() if word not in STOPWORDS])

    def word_replace(text):
        return text.replace('<br />','')
    
    def stem_words(text):
        return " ".join([stemmer.stem(word) for word in text.split()])

    def lemmatize_words(text):
        return " ".join([lemmatizer.lemmatize(word) for word in text.split()])

    def remove_urls(text):
        url_pattern = re.compile(r'https?://\S+|www\.\S+')
        return url_pattern.sub(r'', text)

    def remove_html(text):
        html_pattern = re.compile('<.*?>')
        return html_pattern.sub(r'', text)

    def preprocess(text):
        text=Transform.clean_contractions(text,mapping)
        text=text.lower()
        text=Transform.word_replace(text)
        text=Transform.remove_urls(text)
        text=Transform.remove_html(text)
        text=Transform.remove_stopwords(text)
        text=Transform.remove_punctuation(text)
    #     text=stem_words(text) ## Takes too much of time
        text=Transform.lemmatize_words(text)
        
        return text
    
    def load_glove_embeddings(embedding_file):
        embeddings_index = {}
        with open(embedding_file, 'r', encoding='utf-8') as f:
            for line in f:
                values = line.split()
                word = values[0]
                vector = np.array(values[1:], dtype='float32')
                embeddings_index[word] = vector
        return embeddings_index
    
    def sentence_to_embedding(sentence):
        glove_embeddings = Transform.load_glove_embeddings(glove_file)
        words = sentence.split()
        embeddings = []
        for word in words:
            if word in glove_embeddings:
                embeddings.append(glove_embeddings[word])
        if not embeddings:
            # Handle the case where all words are missing from GloVe embeddings
            return np.zeros(50)  # Use the dimensionality of GloVe embeddings
        return np.mean(embeddings, axis=0)
    
    def distilbert_embeddings(sentence):
        model = SentenceTransformer('sentence-transformers/stsb-distilbert-base')
        embeddings = model.encode(sentence)
        return embeddings
    
    def parse(x):
        otpt = np.array2string(x, separator=' ')
        otpt = otpt.replace('\n', '')
        return otpt
    

    def final_func(sentence):
        
        df = Transform.gen_features(sentence)
        df["reviews"] = sentence
        df["reviews_pre"] = Transform.preprocess(df["reviews"])
        # df["embeddings"] = Transform.sentence_to_embedding(df["reviews_pre"])
        # df["embeddings"] = Transform.parse(df["embeddings"])
        df["embeddings_distilbert"] = Transform.distilbert_embeddings(df["reviews_pre"])
        df["embeddings_distilbert"] = Transform.parse(df["embeddings_distilbert"])
        
        # print(df)
        
        return df
        
        