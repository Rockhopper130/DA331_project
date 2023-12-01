from flask import Flask, render_template, request, jsonify
import requests
from flask_cors import CORS, cross_origin

from utils.preprocess import Transform
from utils.inference import Inference


app = Flask(__name__, template_folder="movie-analysis/src/")
# CORS(app) 
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/receive_data', methods=['POST'])
@cross_origin()
def receive_data():
    data = request.get_json()
    if data and isinstance(data, list) and len(data) > 0:
        
        otpt = []
        
        sentence = data[0]["comment"]
        pre_sentence = Transform.final_func(sentence)
        inference_result = Inference.infer(pre_sentence)
        otpt.append(inference_result)
        
        sentence = data[1]["comment"]
        pre_sentence = Transform.final_func(sentence)
        inference_result = Inference.infer(pre_sentence)
        otpt.append(inference_result)
        # otpt.append(0.0);
        # otpt.append(1.0);

        # Process the data as needed
        response = jsonify({'inference_result': otpt})
        # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return response

    otpt = []
    response = jsonify({"error" : otpt})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

if __name__ == '__main__':
    app.run(debug=True)
    