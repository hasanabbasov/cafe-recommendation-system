import pandas as pd
from scipy.spatial.distance import cosine
from app import db
from model.user_rating import UserRating
from model.cafe import Cafe

def get_collaborative_recommendations(target_user_id, top_n=5):
    # 1. Tüm puanları çek
    ratings = UserRating.query.all()

    if not ratings:
        return []

    # 2. DataFrame'e çevir
    data = [{
        'user_id': r.user_id,
        'cafe_id': r.cafe_id,
        'rating': r.rating
    } for r in ratings]
    df = pd.DataFrame(data)

    # 3. Pivot: kullanıcı x kafe matrisi
    pivot = df.pivot_table(index='user_id', columns='cafe_id', values='rating').fillna(0)

    if target_user_id not in pivot.index:
        return []

    # 4. Hedef kullanıcı vektörü
    target_vector = pivot.loc[target_user_id]

    # 5. Diğer kullanıcılarla benzerlik (cosine similarity)
    similarities = {}
    for other_user_id in pivot.index:
        if other_user_id == target_user_id:
            continue
        sim = 1 - cosine(target_vector, pivot.loc[other_user_id])
        similarities[other_user_id] = sim

    # 6. Benzerliği yüksek kullanıcıların beğendiği ama bizim puanlamadığımız kafeleri bul
    similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)

    # Ağırlıklı skor hesaplama
    scores = {}
    for other_user_id, sim in similar_users:
        for cafe_id, rating in pivot.loc[other_user_id].items():
            if target_vector[cafe_id] == 0 and rating > 0:
                if cafe_id not in scores:
                    scores[cafe_id] = 0
                scores[cafe_id] += sim * rating

    # En yüksek skorlu kafeleri sırala
    recommended = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]

    # Cafe bilgilerini getir
    cafe_objects = {c.cafe_id: c for c in Cafe.query.all()}
    result = []
    for cafe_id, score in recommended:
        cafe = cafe_objects.get(cafe_id)
        if cafe:
            result.append({
                "cafe_id": cafe.cafe_id,
                "name": cafe.name,
                "rating": cafe.rating,
                "score": round(score, 2),
                "tags": cafe.tags
            })

    return result



# Sonuç
#
# Bu yapı:
# 	•	Kullanıcının hiç puan vermediği ama benzer kullanıcıların sevdiği kafeleri önerir.
# 	•	Cosine similarity ile benzerlik hesaplar.
# 	•	Flask içinde modüler servis mantığı ile ilerler (iyi yapı!).