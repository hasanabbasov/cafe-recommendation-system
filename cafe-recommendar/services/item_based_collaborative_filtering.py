import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from model.user_favorite import UserFavorite
from model.cafe import Cafe
from app import db

def get_item_based_collaborative_filtering(user_id, top_n=5):
    # 1. Tüm favori verilerini al
    favorites = UserFavorite.query.all()
    if not favorites:
        return []

    # 2. DataFrame'e dönüştür
    data = [{
        'user_id': f.user_id,
        'cafe_id': f.cafe_id
    } for f in favorites]
    df = pd.DataFrame(data)

    # 3. Cafe-user matrisini oluştur
    df['rating'] = 1  # Favoriler üzerinden rating = 1 veriyoruz
    pivot = df.pivot_table(index='cafe_id', columns='user_id', values='rating').fillna(0)

    # 4. Cosine similarity hesapla (item-item similarity)
    similarity_matrix = cosine_similarity(pivot)
    similarity_df = pd.DataFrame(similarity_matrix, index=pivot.index, columns=pivot.index)

    # 5. Hedef kullanıcının favori kafelerini al
    user_favs = df[df['user_id'] == user_id]['cafe_id'].tolist()
    if not user_favs:
        return []

    # 6. Benzer kafelere puan ver
    scores = {}
    for cafe_id in user_favs:
        similar_items = similarity_df[cafe_id].drop(index=cafe_id)
        for similar_cafe_id, sim_score in similar_items.items():
            if similar_cafe_id not in user_favs:
                if similar_cafe_id not in scores:
                    scores[similar_cafe_id] = 0
                scores[similar_cafe_id] += sim_score

    # 7. En yüksek skorlu kafeleri sırala
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]

    # 8. Cafe bilgileriyle birlikte döndür
    result = []
    for cafe_id, score in sorted_scores:
        cafe = Cafe.query.get(cafe_id)
        if cafe:
            result.append({
                'cafe_id': cafe.cafe_id,
                'name': cafe.name,
                'rating': cafe.rating,
                'score': round(score, 2),
                'tags': cafe.tags
            })

    return result
