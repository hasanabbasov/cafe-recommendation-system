# ☕ Kafe Öneri Sistemi – Recommender Class Açıklamaları

Bu sistem, kullanıcıların kafe tercihlerini analiz ederek **4 farklı algoritma** ile öneriler sunar:

- Content-Based Filtering
- User-Based Collaborative Filtering
- Item-Based Collaborative Filtering
- Hybrid Filtering

Her biri farklı veri kaynaklarına ve mantıklara dayanır. Aşağıda her bir sınıfın **veri akışı**, **kullanılan kaynaklar**, **hesaplama mantığı** ve **çıktı yapısı** detaylıca anlatılmıştır.

---

## ✅ 1. Content-Based Filtering (`get_recommendations`)

### 📌 Veri Kaynağı
**`users`** tablosu:
- `preferred_coffee`
- `time_preferences`
- `mood_activity`

**`cafes`** tablosu:
- `tags`

### ⚙️ Çalışma Mantığı
- Kullanıcının `preferred_coffee`, `time_preferences`, `mood_activity` bilgileri alınır.
- Tüm kafelerin `tags` alanı ile karşılaştırma yapılır.
- Ortak etiketler sayılır ve eşleşme yüzdesi hesaplanır.
- Elde edilen eşleşme puanı `score` olarak atanır.

### 🧾 Çıktı
Her kafe için aşağıdaki bilgiler döner:
- `cafe_id`
- `name`
- `rating`
- `tags`
- `score` (0–5 ölçeğinde)

### 🎯 Amaç
Kullanıcının profil tercihlerine göre ona **uyumlu tematik kafeleri önermek**.

---

## ✅ 2. User-Based Collaborative Filtering (`user_based_collaborative_filtering`)

### 📌 Veri Kaynağı
**`user_ratings`** tablosu:
- `user_id`
- `cafe_id`
- `rating`

### ⚙️ Çalışma Mantığı
- Kullanıcı-Kafe matrisi (`user x cafe`) oluşturulur.
- Cosine similarity ile her kullanıcı diğer kullanıcılarla kıyaslanır.
- Hedef kullanıcıya en çok benzeyen kullanıcılar belirlenir.
- Bu benzer kullanıcıların **beğendiği fakat hedef kullanıcının henüz puanlamadığı** kafeler tespit edilir.
- Her kafe için: `benzerlik * rating` formülü ile skor üretilir.

### 🧾 Çıktı
- `cafe_id`
- `name`
- `rating`
- `score`
- `tags`

### 🎯 Amaç
**Kullanıcıların ortak beğenilerine dayanarak** öneri üretmek.

---

## ✅ 3. Item-Based Collaborative Filtering (`item_based_cf_using_favorites`)

### 📌 Veri Kaynağı
**`user_favorites`** tablosu:
- `user_id`
- `cafe_id`

### ⚙️ Çalışma Mantığı
- Her favori seçim için `rating = 1` kabul edilir.
- Cafe-User matrisi (`cafe x user`) oluşturulur.
- Cosine similarity ile kafeler arası benzerlik hesaplanır.
- Hedef kullanıcının favorilerine **benzer olan ama favorilerde olmayan** kafeler bulunur.
- Toplam benzerlik skoru hesaplanır.

### 🧾 Çıktı
- `cafe_id`
- `name`
- `rating`
- `score`
- `tags`

### 🎯 Amaç
Kullanıcının favori kafelerine **benzer nitelikteki kafeleri bulmak**.

---

## ✅ 4. Hybrid Filtering (`get_hybrid_recommendations`)

### 📌 Veri Kaynağı
- `get_recommendations` (Content-Based)
- `user_based_collaborative_filtering` (User-Based CF)

### ⚙️ Çalışma Mantığı
- CB ve CF skorları normalize edilir (0–1 arası).
- Final skor hesaplanır:  
  `final_score = α * content_score + (1 - α) * collaborative_score`  
  (α = 0.5, default olarak eşit ağırlıklı)
- İki algoritmadan gelen öneriler birleştirilir ve `final_score` ile sıralanır.

### 🧾 Çıktı
- `cafe_id`
- `name`
- `rating`
- `score`
- `tags`

### 🎯 Amaç
**Profil verileri ve kullanıcı benzerliklerini birleştirerek daha dengeli öneriler sunmak**.

---

## 🔄 Özet Tablo

| Algoritma                     | Veri Kaynağı           | Kullanım Mantığı                                | Kullanıcı Puanı Gerekli mi? |
|------------------------------|------------------------|--------------------------------------------------|-----------------------------|
| Content-Based                | `users`, `cafes`       | Kullanıcı tercihi – Kafe etiket eşleşmesi        | ❌ Hayır                    |
| User-Based Collaborative     | `user_ratings`         | Benzer kullanıcıların beğenileri                 | ✅ Evet                     |
| Item-Based Collaborative     | `user_favorites`       | Favori kafelere benzer kafeler                   | ❌ Hayır                    |
| Hybrid                       | CB + CF                | İki algoritmanın skorunun birleşimi              | ✅ Evet                     |

---

## 🔧 Teknik Detaylar

- Her algoritma, `services/` klasöründe **modüler** bir yapıdadır.
- Skor hesaplama ve normalize işlemleri `utils/` klasöründe gerçekleştirilir.
- Tüm RESTful API endpointleri `routes/recommendation_routes.py` altında tanımlıdır.




---

## 🔧 Geliştirici Notu

- Kullanıcının **hiç puan verisi yoksa**, sistem yalnızca:
    - `Content-Based`
    - `Item-Based`  
      algoritmalarını çalıştırır.

- Sistemin doğru çalışabilmesi için aşağıdaki tablolarda **yeterli veri** bulunmalıdır:
    - `cafes`
    - `user_ratings`
    - `user_favorites`

- `Hybrid Filtering` algoritması yalnızca **hem Content-Based hem de User-Based algoritmalarından skor dönen kafeler** üzerinde çalışır.
