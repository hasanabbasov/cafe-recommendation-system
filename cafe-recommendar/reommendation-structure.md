Kullanılan Python Kütüphaneleri ve Amaçları


✅ 1. Content-Based Filtering (services/recommendar.py)
* Kütüphane: Yok (pure Python)

* Kullanım: Kullanıcının preferred_coffee, time_preferences, mood_activity, favorite_tags gibi alanlarıyla kafelerin tags’leri eşleştiriliyor.

* Açıklama: Manuel feature-engineering yapılmış. Yani dış bir ML kütüphanesi gerekmeden intersection skoru hesaplayarak öneri üretiyorsun.

* İyileştirme Fikri: TF-IDF, CountVectorizer gibi yöntemlerle tags’ler arasında daha sofistike benzerlikler çıkarılabilir (scikit-learn).


✅ 2. User-Based Collaborative Filtering (services/user_based_collaborative_filtering.py)
* Kütüphane: pandas, scipy.spatial.distance.cosine

* Yapılan İş:

    * Kullanıcı x Kafe pivot matrisi oluşturuluyor (pivot_table)

    * Cosine similarity hesaplanıyor (1 - cosine(...))

* Açıklama: Bu, memory-based user-user similarity yaklaşımıdır.

* Alternatif/Upgrade: Surprise kütüphanesi ile otomatik benzerlik, SVD, KNN algoritmaları kolayca test edilebilir.



✅ 3. Item-Based Collaborative Filtering (get_item_based_collaborative_filtering)
* Kütüphane: pandas, sklearn.metrics.pairwise.cosine_similarity

* Yapılan İş:

    * Cafe-user favori matrisi oluşturuluyor.

    * Cafe’ler arası cosine similarity hesaplanıyor (item-item similarity).

* Açıklama: Favori verilerini 1 olarak işleyip, cosine similarity ile benzer kafeleri buluyorsun.

* Geliştirme: Bu metot Implicit kütüphanesi ile daha güçlü hale getirilebilir çünkü ALS gibi faktörizasyon algoritmaları implicit feedback veriler (favori, tıklama) için çok uygundur.



✅ 4. Hybrid Filtering (services/hybrid_recommender_service.py)
* Kütüphane: Yok (manuel skor birleştirme)

* Yapılan İş: normalize edilmiş CB ve CF skorlarının ağırlıklı ortalaması alınarak final skor hesaplanıyor.

* Geliştirme: Daha gelişmiş bir skor birleştirme yöntemi (learned weights, Bayesian averaging) ile geliştirilebilir.


🎯 Sonuç: Şu anda kodlarda aktif olarak kullanılan Python kütüphaneleri:

| Kütüphane | Kullanım Amacı                                                            |
| --------- | ------------------------------------------------------------------------- |
| `pandas`  | Rating/favorite verisini DataFrame'e dönüştürmek ve pivot tablolar kurmak |
| `scipy`   | Cosine similarity hesaplamak (user-based için)                            |
| `sklearn` | Cosine similarity (item-based için)                                       |


✨ Geliştirme İmkanlarım

| Senaryo                                     | Kütüphane                                |
| ------------------------------------------- | ---------------------------------------- |
| İçerik bazlı eşleşmeleri vektörlerle yapmak | `scikit-learn` (TF-IDF, CountVectorizer) |
| Matrix factorization (SVD, ALS)             | `Surprise`, `Implicit`, `LightFM`        |
| Derin öğrenme (gelişmiş öneri motorları)    | `TensorFlow`, `PyTorch`                  |
| Graph-based öneriler                        | `NetworkX`                               |
