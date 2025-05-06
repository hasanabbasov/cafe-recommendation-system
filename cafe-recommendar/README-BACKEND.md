Backend Yapısı
•	Flask API ile yapılandırıldı.
•	PostgreSQL veritabanı kullanıldı.
•	Tablolar: users, cafes, user_ratings, user_favorites, cafe_features

⸻

API Endpoint’leri
•	User API: Kullanıcı ekleme ve listeleme
•	Cafe API: Kafe ekleme ve listeleme
•	Favorites: Kullanıcı favori kafeleri ekleyip listeleyebiliyor
•	Ratings: Kullanıcı yorum ve puan verebiliyor
•	Recommendation Routes:
•	/recommendations/<user_id> → Content-Based
•	/recommendations/<user_id>/cf → Collaborative Filtering
•	/recommendations/<user_id>/hybrid → Hybrid Filtering

⸻

Öneri Sistemleri
•	Content-Based Filtering: Kullanıcının tercih ettiği özellikler (kahve, zaman, ruh hali) ve yorum kelimelerine göre skorlandı.
•	Collaborative Filtering: Kullanıcıların favori ve puanladığı kafeler üzerinden benzerlik analizi yapıldı.
•	Hybrid System: Normalize edilmiş skorlar birleştirilerek α ağırlığı ile hibrit skor üretildi.

⸻

Test ve Veri Seti
•	Gerçek kullanıcılar ve kafelerle dummy veriler oluşturuldu.
•	User ID’ler üzerinden ilişkili olarak:
•	Yorumlar
•	Favoriler
•	Cafe bilgilerinin hepsi işlendi.
•	Tüm sistem test edildi, valid JSON çıktı alındı.

⸻

Kod Yapısı
•	Modüler services/, utils/, routes/ klasörleri ile temiz yapı kuruldu.
•	Normalization gibi işlemler ayrı servislerde toplandı.
•	Kodlar comment’lerle belgelenerek kolay anlaşılır hale getirildi.