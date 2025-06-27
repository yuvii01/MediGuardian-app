from flask import Flask, request, jsonify
import numpy as np
import joblib  # or use pickle
import tensorflow as tf

app = Flask(__name__)

# Load your ML model (Replace 'model.pkl' with your actual model file)
model = joblib.load("diabites.pkl")  # For Scikit-Learn
# model = tf.keras.models.load_model("diabetes_model.h5")  # For TensorFlow

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)  # Adjust based on your model input
    prediction = model.predict(features)
    
    return jsonify({"prediction": prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=4000)  # Run Flask on port 4000
