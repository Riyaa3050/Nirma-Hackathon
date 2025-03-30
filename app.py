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
        print("Received Data:", data)

        if not data:
            return jsonify({"error": "No data received"}), 400

        # Convert data to DataFrame
        df = pd.DataFrame([data])

        # Rename columns to match trained model
        df.rename(columns={'scaled_amount': 'Amount', 'scaled_time': 'Time'}, inplace=True)

        # Ensure correct feature order
        expected_features = model.feature_names_in_
        for feature in expected_features:
            if feature not in df.columns:
                df[feature] = 0  # Fill missing features with 0

        df = df[expected_features]  # Reorder columns

        print("Final DataFrame for Prediction:", df.columns.tolist())  

        # Make prediction
        prediction = model.predict(df)

        return jsonify({"prediction": int(prediction[0])})  

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
