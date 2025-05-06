from utils.normalization import normalize_scores
from services.recommendar import get_recommendations  # Content-based filtering
from services.user_based_collaborative_filtering import user_based_collaborative_filtering  # Collaborative filtering

def get_hybrid_recommendations(user_id, alpha=0.5):
    """
    Content-based ve collaborative filtering sonuçlarını birleştirerek hybrid öneriler üretir.

    :param user_id: Öneri üretilecek kullanıcı ID'si
    :param alpha: Content-based filtering ağırlığı (0 ile 1 arası). Varsayılan: 0.5
    :return: Skorlanmış ve sıralanmış kafe öneri listesi (JSON formatında)
    """

    # 1. Her iki algoritmadan skorları al
    cb_results = get_recommendations(user_id)  # Content-based öneri sonuçları
    cf_results = user_based_collaborative_filtering(user_id)  # Collaborative filtering sonuçları

    # 2. Skorları normalize et (0–1 aralığına çeker)
    cb_scores = normalize_scores(cb_results)  # Örn: {"cafe_a": 0.8, "cafe_b": 0.3}
    cf_scores = normalize_scores(cf_results)

    # 3. Her iki setin birleşimini al (bazı kafeler sadece birinde olabilir)
    all_cafe_ids = set(cb_scores.keys()).union(cf_scores.keys())

    hybrid_results = []

    # 4. Tüm kafeler için hybrid skoru hesapla
    for cafe_id in all_cafe_ids:
        cb = cb_scores.get(cafe_id, 0)  # CB skor varsa al, yoksa 0
        cf = cf_scores.get(cafe_id, 0)  # CF skor varsa al, yoksa 0

        # Hybrid skor hesaplama formülü
        final_score = alpha * cb + (1 - alpha) * cf

        # 5. Cafe detaylarını bul (adı, puanı, etiketleri vs.)
        cafe = next((c for c in cb_results + cf_results if c["cafe_id"] == cafe_id), None)

        if cafe:
            # 6. Skor 5 üzerinden ölçeklenir ve sonuç listesine eklenir
            hybrid_results.append({
                "cafe_id": cafe_id,
                "name": cafe["name"],
                "rating": cafe["rating"],
                "tags": cafe.get("tags", []),
                "score": round(final_score * 5, 2)  # normalize edilmiş skoru 5 üzerinden yaz
            })

    # 7. En yüksekten düşüğe doğru sıralayıp return et
    return sorted(hybrid_results, key=lambda x: x["score"], reverse=True)