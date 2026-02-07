"""
Rebuild the ML model with current scikit-learn version
This script trains a fresh RandomForestClassifier on the insurance data
"""

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Load data
df = pd.read_csv('insurance.csv')
print(f"Data shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# Create features
df_feat = df.copy()

# Feature 1: BMI
df_feat["bmi"] = df_feat["weight"] / (df_feat["height"] ** 2)

# Feature 2: Age Group
def age_group(age):
    if age < 25:
        return "young"
    elif age < 45:
        return "adult"
    elif age < 60:
        return "middle_aged"
    return "senior"

df_feat["age_group"] = df_feat["age"].apply(age_group)

# Feature 3: Lifestyle Risk
def lifestyle_risk(row):
    if row["smoker"] and row["bmi"] > 30:
        return "high"
    elif row["smoker"] or row["bmi"] > 27:
        return "medium"
    else:
        return "low"

df_feat["lifestyle_risk"] = df_feat.apply(lifestyle_risk, axis=1)

# Feature 4: City Tier
tier_1_cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
tier_2_cities = [
    "Jaipur", "Chandigarh", "Indore", "Lucknow", "Patna", "Ranchi", "Visakhapatnam", "Coimbatore",
    "Bhopal", "Nagpur", "Vadodara", "Surat", "Rajkot", "Jodhpur", "Raipur", "Amritsar", "Varanasi",
    "Agra", "Dehradun", "Mysore", "Jabalpur", "Guwahati", "Thiruvananthapuram", "Ludhiana", "Nashik",
    "Allahabad", "Udaipur", "Aurangabad", "Hubli", "Belgaum", "Salem", "Vijayawada", "Tiruchirappalli",
    "Bhavnagar", "Gwalior", "Dhanbad", "Bareilly", "Aligarh", "Gaya", "Kozhikode", "Warangal",
    "Kolhapur", "Bilaspur", "Jalandhar", "Noida", "Guntur", "Asansol", "Siliguri"
]

def city_tier(city):
    if city in tier_1_cities:
        return 1
    elif city in tier_2_cities:
        return 2
    else:
        return 3

df_feat["city_tier"] = df_feat["city"].apply(city_tier)

# Select features and target
X = df_feat[["bmi", "age_group", "lifestyle_risk", "city_tier", "income_lpa", "occupation"]]
y = df_feat["insurance_premium_category"]

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Target classes: {y.unique()}")

# Define categorical and numeric features
categorical_features = ["age_group", "lifestyle_risk", "occupation"]
numeric_features = ["bmi", "income_lpa", "city_tier"]

# Create column transformer with proper handling
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ],
    remainder="drop"
)

# Create pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(random_state=42, n_estimators=100, n_jobs=-1))
])

# Train model
print("\nTraining model...")
pipeline.fit(X, y)

print("Model trained successfully!")

# Save model using joblib
save_path = "model/model.pkl"
joblib.dump(pipeline, save_path)
print(f"Model saved to {save_path}")

# Test prediction
print("\nTesting prediction...")
test_data = pd.DataFrame([{
    'bmi': 25.0,
    'age_group': 'adult',
    'lifestyle_risk': 'low',
    'city_tier': 1,
    'income_lpa': 10.0,
    'occupation': 'private_job'
}])

pred = pipeline.predict(test_data)
prob = pipeline.predict_proba(test_data)
print(f"Test prediction: {pred[0]}")
print(f"Probabilities: {prob[0]}")
print("\n✅ Model rebuilt successfully!")
