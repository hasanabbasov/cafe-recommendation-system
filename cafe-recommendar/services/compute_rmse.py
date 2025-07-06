import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from app import app,db
from model.user_rating import UserRating

def compute_rmse(test_size=0.2):
    # 1. Load all ratings
    ratings = Review.query.all()
    if not ratings:
        print("No ratings found.")
        return

    data = [{
        'user_id': r.user_id,
        'cafe_id': r.cafe_id,
        'rating': r.rating
    } for r in ratings]

    df = pd.DataFrame(data)

    # 2. Train-test split
    df = df.sample(frac=1).reset_index(drop=True)  # shuffle
    test_count = int(len(df) * test_size)
    test_df = df.iloc[:test_count]
    train_df = df.iloc[test_count:]

    # 3. Build pivot matrix from training only
    pivot = train_df.pivot_table(index='user_id', columns='cafe_id', values='rating').fillna(0)

    predictions = []
    actuals = []

    for idx, row in test_df.iterrows():
        target_user_id = row['user_id']
        target_cafe_id = row['cafe_id']
        actual_rating = row['rating']

        # Skip if user or cafe missing in training data
        if target_user_id not in pivot.index:
            continue
        if target_cafe_id not in pivot.columns:
            continue

        target_vector = pivot.loc[target_user_id]

        # Compute similarities
        similarities = {}
        for other_user_id in pivot.index:
            if other_user_id == target_user_id:
                continue
            sim = 1 - cosine(target_vector, pivot.loc[other_user_id])
            similarities[other_user_id] = sim

        # Weighted prediction for this user–cafe pair
        numerator = 0
        denominator = 0
        for other_user_id, sim in similarities.items():
            other_rating = pivot.loc[other_user_id, target_cafe_id]
            if other_rating > 0 and sim > 0:
                numerator += sim * other_rating
                denominator += sim

        if denominator == 0:
            continue  # No prediction possible

        predicted_rating = numerator / denominator

        predictions.append(predicted_rating)
        actuals.append(actual_rating)

    if not predictions:
        print("No predictions could be made — check your data.")
        return

    # 4. Compute RMSE
    predictions = np.array(predictions)
    actuals = np.array(actuals)
    rmse = np.sqrt(np.mean((actuals - predictions) ** 2))

    print(f"RMSE: {rmse:.4f}")

if __name__ == "__main__":
    with app.app_context():
        compute_rmse()