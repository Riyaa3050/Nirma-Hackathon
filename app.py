# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# import numpy as np
# from datetime import datetime

# app = Flask(__name__)

# # Load the trained model and label encoders
# model = joblib.load("fraud_detection_model_XGBoost.pkl")  # Change as needed
# label_encoders = joblib.load("label_encoders.pkl")

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()
        
#         # Convert input data into a DataFrame
#         df = pd.DataFrame([data])
        
#         # Encode categorical variables
#         for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
#             if col in label_encoders:
#                 if data[col] in label_encoders[col].classes_:
#                     df[col] = label_encoders[col].transform([data[col]])[0]
#                 else:
#                     # Handle unseen labels by adding to the encoder dynamically
#                     label_encoders[col].classes_ = np.append(label_encoders[col].classes_, data[col])
#                     df[col] = label_encoders[col].transform([data[col]])[0]
        
#         # Convert Timestamp to datetime and extract features
#         df['Timestamp'] = pd.to_datetime(df['Timestamp'])
#         df['Hour'] = df['Timestamp'].dt.hour
#         df['DayOfWeek'] = df['Timestamp'].dt.dayofweek
#         df.drop(columns=['Timestamp'], inplace=True)

#         # Ensure feature order matches training
#         feature_order = ['SenderID', 'ReceiverID', 'Amount', 'Currency', 'TransactionType', 'Hour', 'DayOfWeek']
#         df = df[feature_order]
        
#         # Make prediction
#         fraud_prob = model.predict_proba(df)[0][1]  # Probability of fraud
#         fraud_prediction = 1 if fraud_prob > 0.2 else 0  # Adjusted threshold to 0.2
        
#         return jsonify({
#             "fraud_prediction": int(fraud_prediction),
#             "fraud_probability": float(fraud_prob)  # Ensure JSON serialization
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Fraud Detection API is Running!"})

# if __name__ == "__main__":
#     app.run(debug=True)
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

        # Required fields
        required_fields = ["SenderID", "ReceiverID", "Amount", "Currency", "TransactionType", "Timestamp"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Validate input
        if data["Amount"] <= 0:
            return jsonify({"error": "Amount must be greater than zero"}), 400

        # Convert input data into a DataFrame
        df = pd.DataFrame([data])

        # Encode categorical variables
        for col in ["SenderID", "ReceiverID", "Currency", "TransactionType"]:
            if col in label_encoders:
                if data[col] in label_encoders[col].classes_:
                    df[col] = label_encoders[col].transform([data[col]])[0]
                else:
                    df[col] = -1  # Assign high risk for unseen values

        # Convert Timestamp to datetime and extract features
        df["Timestamp"] = pd.to_datetime(df["Timestamp"])
        df["Hour"] = df["Timestamp"].dt.hour
        df["DayOfWeek"] = df["Timestamp"].dt.dayofweek
        df.drop(columns=["Timestamp"], inplace=True)

        # Add LargeAmountFlag before reordering
        df["LargeAmountFlag"] = (df["Amount"] > 100000).astype(int)

        # Ensure feature order matches training
        feature_order = ["SenderID", "ReceiverID", "Amount", "Currency", "TransactionType", "Hour", "DayOfWeek", "LargeAmountFlag"]
        df = df[feature_order]

        # Make prediction
        fraud_prob = float(model.predict_proba(df)[0][1])  # Ensure scalar conversion

        # Apply manual risk adjustments
        if data["SenderID"] == data["ReceiverID"]:
            fraud_prob = max(fraud_prob, 0.85)  # Self-transactions are very risky

        if data["Amount"] > 100000:
            fraud_prob = min(fraud_prob + 0.10, 1.0)  # Large transactions get a boost

        if df["Hour"].iloc[0] in [0, 1, 2, 3]:  # Transactions between 12AM - 4AM
            fraud_prob = min(fraud_prob + 0.05, 1.0)

        fraud_prediction = 1 if fraud_prob > 0.15 else 0  # Adjusted threshold

        return jsonify({
            "fraud_prediction": int(fraud_prediction),
            "fraud_probability": round(fraud_prob * 100, 2)  # Convert to percentage
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
