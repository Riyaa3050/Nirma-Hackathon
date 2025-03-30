import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# ✅ Load the dataset
file_path = "synthetic_transactions_30percent_fraud.csv"
df = pd.read_csv(file_path)

# ✅ Encode categorical variables
label_encoders = {}
for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# ✅ Convert Timestamp to datetime and extract features
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df['Hour'] = df['Timestamp'].dt.hour
df['DayOfWeek'] = df['Timestamp'].dt.dayofweek

# ✅ Drop unnecessary columns
df.drop(columns=['TransactionID', 'Timestamp'], inplace=True)

# ✅ Define features and target variable
X = df.drop(columns=['IsFraud'])
y = df['IsFraud']

# ✅ Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# ✅ Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Make predictions
y_pred = model.predict(X_test)

# ✅ Evaluate performance
print("Model Evaluation:\n", classification_report(y_test, y_pred))

# ✅ Save the model and encoders
joblib.dump(model, "fraud_detection_model.pkl")  # Save model
joblib.dump(label_encoders, "label_encoders.pkl")  # Save label encoders

print("✅ Model saved as 'fraud_detection_model.pkl'")
print("✅ Label encoders saved as 'label_encoders.pkl'")
