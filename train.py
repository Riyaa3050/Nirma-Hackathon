import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE

# Load the dataset
file_path = "synthetic_transactions_30percent_fraud.csv"
df = pd.read_csv(file_path)

# Encode categorical variables
label_encoders = {}
for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Convert Timestamp to datetime and extract features
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df['Hour'] = df['Timestamp'].dt.hour
df['DayOfWeek'] = df['Timestamp'].dt.dayofweek

# Drop unnecessary columns
df.drop(columns=['TransactionID', 'Timestamp'], inplace=True)

# Define features and target variable
X = df.drop(columns=['IsFraud'])
y = df['IsFraud']

# Handle class imbalance using SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled)

# Train and evaluate multiple models
models = {
    "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "XGBoost": XGBClassifier(n_estimators=200, learning_rate=0.1, random_state=42)
}

for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"\n{name} Classification Report:\n")
    print(classification_report(y_test, y_pred))
    joblib.dump(model, f"fraud_detection_model_{name}.pkl")

# Save label encoders
joblib.dump(label_encoders, "label_encoders.pkl")
print("✅ Models and Label Encoders Saved!")
