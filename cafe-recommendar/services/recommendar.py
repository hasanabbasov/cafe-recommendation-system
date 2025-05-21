from model.user import User
from model.cafe import Cafe
from model.user_rating import UserRating
from model.user_favorite import UserFavorite
from app import db


# content-base
def get_recommendations(user_id, top_n=5):
    user = User.query.get(user_id)
    if not user:
        return []

    cafes = Cafe.query.all()
    results = []

    # Kullanıcının favori kafe ID'leri
    favorite_cafe_ids = [
        fav.cafe_id for fav in UserFavorite.query.filter_by(user_id=user_id).all()
    ]

    # Bu favori kafelerin tag'larını toplayalım
    favorite_tags = set()
    for cafe_id in favorite_cafe_ids:
        cafe = Cafe.query.get(cafe_id)
        if cafe and cafe.tags:
            favorite_tags.update(cafe.tags)

    for cafe in cafes:
        score = 0
        tags = set(cafe.tags or [])

        # preferred_coffee ile tag eşleşmesi
        if user.preferred_coffee:
            score += len(set(user.preferred_coffee) & tags)

        # time_preferences ile eşleşme
        if user.time_preferences:
            score += len(set(user.time_preferences) & tags)

        # mood_activity eşleşmesi
        if user.mood_activity and user.mood_activity in tags:
            score += 1

        # favorite kafe tag'leri ile eşleşme
        if favorite_tags:
            score += len(favorite_tags & tags)

        # Sonuçlara skor > 0 olanları ekle
        if score > 0:
            results.append({
                "cafe_id": cafe.cafe_id,
                "name": cafe.name,
                "rating": cafe.rating,
                "tags": list(tags),
                "score": round(score, 2)
            })

    # Skora göre sırala ve en iyi N tanesini döndür
    return sorted(results, key=lambda x: x["score"], reverse=True)[:top_n]
