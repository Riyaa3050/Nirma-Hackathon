from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("model.pkl")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        print("\n🔹 Received Data:", data)  # Debugging

        if not data:
            return jsonify({"error": "No data received"}), 400

        # Convert data to DataFrame
        df = pd.DataFrame([data])

        # Rename columns to match trained model
        df.rename(columns={'scaled_amount': 'Amount', 'scaled_time': 'Time'}, inplace=True)

        # Get expected feature order from the model
        expected_features = model.feature_names_in_
        print("🔹 Expected Features Order:", expected_features)  # Debugging

        # Ensure all expected features are present
        for feature in expected_features:
            if feature not in df.columns:
                df[feature] = df[feature].mean()  # Fill missing values with mean instead of 0

        # Reorder DataFrame to match training data
        df = df[expected_features]

        print("✅ Final DataFrame Before Prediction:\n", df.head())  # Debugging

        # Make prediction
        prediction = model.predict(df)
        prediction_proba = model.predict_proba(df)  # Get probability score

        print("🔹 Model Prediction:", prediction[0])  
        print("🔹 Prediction Probability:", prediction_proba.tolist())  # Debugging

        # Adjust fraud detection threshold
        threshold = 0.0001  # Lowered from 0.4 to 0.01
        is_fraud = 1 if prediction_proba[0][1] > threshold else 0

        return jsonify({
            "prediction": is_fraud, 
            "probability": prediction_proba.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)