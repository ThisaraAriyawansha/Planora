from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load saved objects
model = joblib.load('best_category_model.pkl')
scaler = joblib.load('scaler.pkl')
le_gender = joblib.load('le_gender.pkl')
le_category = joblib.load('le_category.pkl')

# Define feature columns
feature_columns = ['age', 'gender', 'tech_spend', 'music_freq', 'sports_hours', 
                   'business_interest', 'edu_freq', 'food_interest', 'health_priority']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get form data
        data = request.form
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
        input_data['gender'] = le_gender.transform(input_data['gender'])
        numerical_cols = ['age', 'tech_spend', 'music_freq', 'sports_hours', 
                         'business_interest', 'edu_freq', 'food_interest', 'health_priority']
        input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])

        # Predict
        prediction = model.predict(input_data)
        predicted_category = le_category.inverse_transform(prediction)[0]

        return jsonify({'prediction': predicted_category})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)