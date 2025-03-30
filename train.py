
# import pandas as pd
# import joblib
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.linear_model import LogisticRegression
# from xgboost import XGBClassifier
# from sklearn.metrics import classification_report
# from imblearn.over_sampling import SMOTE

# # Load the dataset
# file_path = "synthetic_transactions_30percent_fraud.csv"
# df = pd.read_csv(file_path)

# # Encode categorical variables
# label_encoders = {}
# for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
#     le = LabelEncoder()
#     df[col] = le.fit_transform(df[col])
#     label_encoders[col] = le

# # Convert Timestamp to datetime and extract features
# df['Timestamp'] = pd.to_datetime(df['Timestamp'])
# df['Hour'] = df['Timestamp'].dt.hour
# df['DayOfWeek'] = df['Timestamp'].dt.dayofweek

# # Add LargeAmountFlag BEFORE defining X
# df['LargeAmountFlag'] = (df['Amount'] > 100000).astype(int)

# # Drop unnecessary columns
# df.drop(columns=['TransactionID', 'Timestamp'], inplace=True)

# # Define features and target variable
# X = df.drop(columns=['IsFraud'])  # Now includes LargeAmountFlag
# y = df['IsFraud']

# # Save feature order
# feature_order = list(X.columns)
# joblib.dump(feature_order, "feature_order.pkl")

# # Handle class imbalance using SMOTE
# smote = SMOTE(random_state=42)
# X_resampled, y_resampled = smote.fit_resample(X, y)

# # Split dataset
# X_train, X_test, y_train, y_test = train_test_split(
#     X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled
# )

# # Train and evaluate multiple models
# models = {
#     "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
#     "LogisticRegression": LogisticRegression(max_iter=1000),
#     "XGBoost": XGBClassifier(n_estimators=200, learning_rate=0.1, random_state=42)
# }

# for name, model in models.items():
#     print(f"Training {name}...")
#     model.fit(X_train, y_train)
#     y_pred = model.predict(X_test)
#     print(f"\n{name} Classification Report:\n")
#     print(classification_report(y_test, y_pred))
#     joblib.dump(model, f"fraud_detection_model_{name}.pkl")

# # Save label encoders
# joblib.dump(label_encoders, "label_encoders.pkl")
# print("✅ Models, Label Encoders, and Feature Order Saved!")
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
import numpy as np

# Load dataset
file_path = "synthetic_transactions_30percent_fraud.csv"
df = pd.read_csv(file_path)

# Dictionary to store label encoders
label_encoders = {}

# Encode categorical variables
for col in ['SenderID', 'ReceiverID', 'Currency', 'TransactionType']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])

    # Add an "UNKNOWN" category for unseen values
    le.classes_ = np.append(le.classes_, "UNKNOWN")

    label_encoders[col] = le

# Convert Timestamp to datetime and extract features
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df['Hour'] = df['Timestamp'].dt.hour
df['DayOfWeek'] = df['Timestamp'].dt.dayofweek

# Add fraud-related features
df['LargeAmountFlag'] = (df['Amount'] > 100000).astype(int)

# Drop unnecessary columns
df.drop(columns=['TransactionID', 'Timestamp'], inplace=True)

# Define features and target variable
X = df.drop(columns=['IsFraud'])
y = df['IsFraud']

# Save feature order
feature_order = list(X.columns)
joblib.dump(feature_order, "feature_order.pkl")

# Handle class imbalance using SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled
)

# Train XGBoost model
model = XGBClassifier(n_estimators=200, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print("XGBoost Classification Report:\n")
print(classification_report(y_test, y_pred))

# Save the model and encoders
joblib.dump(model, "fraud_detection_model_XGBoost.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

print("✅ Model, Label Encoders, and Feature Order Saved Successfully!")
