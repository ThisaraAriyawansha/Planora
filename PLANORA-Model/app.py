from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],  # Explicitly allow only POST and OPTIONS
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    },
    r"/": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Load saved objects
try:
    model = joblib.load('best_category_model.pkl')
    scaler = joblib.load('scaler.pkl')
    le_gender = joblib.load('le_gender.pkl')
    le_category = joblib.load('le_category.pkl')
except Exception as e:
    print(f"Error loading model files: {e}")
    exit(1)

# Define feature columns
feature_columns = ['age', 'gender', 'tech_spend', 'music_freq', 'sports_hours',
                   'business_interest', 'edu_freq', 'food_interest', 'health_priority']

# Logging for debugging
@app.before_request
def log_request():
    print(f"[{request.method}] {request.url} from {request.headers.get('Origin')}")
    print(f"Headers: {request.headers}")

@app.route('/')
def home():
    return jsonify({'message': 'Flask Prediction API'})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        print("Handling OPTIONS request for /predict")
        return '', 204

    try:
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        input_data = pd.DataFrame({
            'age': [float(data['age'])],
            'gender': [data['gender']],
            'tech_spend': [float(data['tech_spend'])],
            'music_freq': [float(data['music_freq'])],
            'sports_hours': [float(data['sports_hours'])],
            'business_interest': [float(data['business_interest'])],
            'edu_freq': [float(data['edu_freq'])],
            'food_interest': [float(data['food_interest'])],
            'health_priority': [float(data['health_priority'])]
        })

        # Preprocess input
        if data['gender'] not in le_gender.classes_:
            return jsonify({'error': f"Invalid gender value: {data['gender']}"}), 400
        input_data['gender'] = le_gender.transform(input_data['gender'])
        numerical_cols = ['age', 'tech_spend', 'music_freq', 'sports_hours',
                         'business_interest', 'edu_freq', 'food_interest', 'health_priority']
        input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])

        # Predict
        prediction = model.predict(input_data)
        predicted_category = le_category.inverse_transform(prediction)[0]

        return jsonify({'prediction': predicted_category})
    except KeyError as e:
        return jsonify({'error': f'Missing field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)