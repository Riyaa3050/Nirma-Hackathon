from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)

# Load the trained model and encoders
model = joblib.load("fraud_detection_model_XGBoost.pkl")
label_encoders = joblib.load("label_encoders.pkl")
feature_order = joblib.load("feature_order.pkl")

# Fraud reason dictionary
FRAUD_REASON_DICT = {
    1: "Large transaction",
    2: "Unseen currency or transaction type",
    3: "Self-transaction (Sender = Receiver)",
    4: "Late-night transaction",
    5: "High-risk transaction type"
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate input
        required_fields = ["SenderID", "ReceiverID", "Amount", "Currency", "TransactionType", "Timestamp"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if data["Amount"] <= 0:
            return jsonify({"error": "Amount must be greater than zero"}), 400

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # Track fraud reasons
        fraud_reasons = []

        # Encode categorical variables properly
        for col in ["SenderID", "ReceiverID", "Currency", "TransactionType"]:
            if col in label_encoders:
                le = label_encoders[col]

                if data[col] in le.classes_:
                    df[col] = le.transform([data[col]])[0]
                else:
                    print(f"⚠️ Warning: Unseen value detected for {col}: {data[col]}")
                    df[col] = le.transform(["UNKNOWN"])[0]
                    fraud_reasons.append(2)

        # Convert Timestamp to datetime and extract features
        df["Timestamp"] = pd.to_datetime(df["Timestamp"])
        df["Hour"] = df["Timestamp"].dt.hour
        df["DayOfWeek"] = df["Timestamp"].dt.dayofweek
        df.drop(columns=["Timestamp"], inplace=True)

        # Large Transaction Flag
        df["LargeAmountFlag"] = (df["Amount"] > 100000).astype(int)
        if df["LargeAmountFlag"].iloc[0] == 1:
            fraud_reasons.append(1)

        # Ensure feature order matches training
        df = df[feature_order]

        # Make prediction
        fraud_prob = float(model.predict_proba(df)[0][1])

        # Manual fraud risk adjustments
        if data["SenderID"] == data["ReceiverID"]:
            fraud_prob = max(fraud_prob, 0.85)
            fraud_reasons.append(3)

        if df["Hour"].iloc[0] in [0, 1, 2, 3]:  # Late-night transactions
            fraud_prob = min(fraud_prob + 0.05, 1.0)
            fraud_reasons.append(4)

        # Improved Large Transaction Adjustment
        if data["Amount"] > 100000:
            fraud_prob = min(fraud_prob + 0.30, 1.0)  # Increase probability more aggressively

        # Define fraud threshold
        fraud_threshold = 0.17
        fraud_prediction = 1 if fraud_prob > fraud_threshold else 0

        # If fraud detected but no specific reason, mark as high-risk
        if fraud_prediction == 1 and not fraud_reasons:
            fraud_reasons.append(5)

        # Get descriptions for fraud reasons
        fraud_reason_descriptions = [FRAUD_REASON_DICT[code] for code in fraud_reasons]

        return jsonify({
            "fraud_prediction": fraud_prediction,
            "fraud_probability": round(fraud_prob * 100, 2),
            "fraud_reason_descriptions": fraud_reason_descriptions
        })

    except KeyError as ke:
        return jsonify({"error": f"Missing key in request data: {str(ke)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Fraud Detection API is Running!"})

if __name__ == "__main__":
    app.run(debug=True)
