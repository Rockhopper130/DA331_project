from flask import Flask, render_template, request
from utils.preprocess import Transform
from utils.inference import Inference

app = Flask(__name__, template_folder="website/public/")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/inference', methods=['POST'])
def perform_inference():
    
    sentence = request.form['sentence']
    print(sentence)
    pre_sentence = Transform.final_func(sentence)
    inference_result = Inference.infer(pre_sentence)

    return render_template("result.html", result=inference_result)