import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# 1️⃣ Load dataset  
df = pd.read_csv("creditcard.csv")  # Change the file path if needed  

# 2️⃣ Data Preprocessing  
X = df.drop("Class", axis=1)
y = df["Class"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3️⃣ Train Model  
model = LogisticRegression()
model.fit(X_train, y_train)

# 4️⃣ Save Model  
joblib.dump(model, 'model.pkl')

print("✅ Model trained and saved as 'model.pkl'")