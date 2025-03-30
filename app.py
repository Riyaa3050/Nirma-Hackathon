from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)

# Load the trained model and label encoders
model = joblib.load("fraud_detection_model_XGBoost.pkl")  # Change as needed
label_encoders = joblib.load("label_encoders.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        # Convert input data into a DataFrame
        df = pd.DataFrame([data])
        
        # Encode categorical variables
        for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
            if col in label_encoders:
                if data[col] in label_encoders[col].classes_:
                    df[col] = label_encoders[col].transform([data[col]])[0]
                else:
                    # Handle unseen labels by adding to the encoder dynamically
                    label_encoders[col].classes_ = np.append(label_encoders[col].classes_, data[col])
                    df[col] = label_encoders[col].transform([data[col]])[0]
        
        # Convert Timestamp to datetime and extract features
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        df['Hour'] = df['Timestamp'].dt.hour
        df['DayOfWeek'] = df['Timestamp'].dt.dayofweek
        df.drop(columns=['Timestamp'], inplace=True)

        # Ensure feature order matches training
        feature_order = ['SenderID', 'ReceiverID', 'Amount', 'Currency', 'TransactionType', 'Hour', 'DayOfWeek']
        df = df[feature_order]
        
        # Make prediction
        fraud_prob = model.predict_proba(df)[0][1]  # Probability of fraud
        fraud_prediction = 1 if fraud_prob > 0.5 else 0  # Adjusted threshold to 0.5
        
        return jsonify({
            "fraud_prediction": int(fraud_prediction),
            "fraud_probability": float(fraud_prob)  # Ensure JSON serialization
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Fraud Detection API is Running!"})

if __name__ == "__main__":
    app.run(debug=True)
