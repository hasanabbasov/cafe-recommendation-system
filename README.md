# ☕ Kafe Öneri Sistemi – Cafe Recommendation System

Bu proje, kullanıcıların kişisel tercihleri ve topluluk davranışlarına göre kafe önerileri almasını sağlayan bir **tam yığın (full-stack)** web uygulamasıdır.  
Sistem; **Flask (Python)** ile geliştirilmiş bir backend, **React** ile geliştirilmiş bir frontend ve **PostgreSQL** veritabanı üzerine kuruludur.

---

## 🔧 Kullanılan Teknolojiler

- **Frontend:** React 18, Material UI, React Router
- **Backend:** Flask, SQLAlchemy, Blueprint mimarisi
- **Veritabanı:** PostgreSQL

### 📌 Öneri Sistemleri

- Content-Based Filtering
- Collaborative Filtering (User-Based)
- Hybrid Recommendation (Ağırlıklı skorlama)

---

## 🚀 Proje Akışı

### 1. Landing Page

Kullanıcı uygulamaya giriş yapar ve “Kafe Bulmaya Başla” butonuyla kayıt sürecine yönlendirilir.

---

### 2. Kullanıcı Kaydı (`/register`)

Kullanıcıdan aşağıdaki bilgiler toplanır:

- Demografik veriler (isim, yaş, cinsiyet, meslek)
- Kafe tercihleri (kahve türü, zaman aralığı, ruh hali)
- Ortalama harcama ve ziyaret sıklığı

🗃️ Bu veriler `users` tablosuna kaydedilir.

---

### 3. Favori Kafeler Seçimi (`/favorites`)

- Kafeler veritabanından çekilir.
- Kullanıcı arayüzünde arama + pagination ile sunulur.
- Kullanıcı favori kafelerini seçer → `user_favorites` tablosuna kaydedilir.

---

### 4. Puan Verme (`/ratings`)

- Kullanıcı favori kafelerine yıldız puan ve yorum ekler.
- Veriler `user_ratings` tablosuna işlenir.

---

### 5. Ana Sayfa (`/home`)

3 alt bölümden oluşur:

- `/home`: En popüler ve en yüksek puanlı kafeler
- `/home/for-you`: Kullanıcıya özel 3 modelden öneri:
    - Content-Based
    - Collaborative Filtering
    - Hybrid (α * CB + (1 - α) * CF)
- `/home/search`: Etiket ve isim bazlı filtreleme (örn. sessiz, wifi’li)

---

## 🧠 Öneri Sistemi Detayları

### ✅ Content-Based Filtering
Kullanıcının özelliklerine ve tercih geçmişine göre, kafe profilleriyle benzerlik karşılaştırması yapılır.

### ✅ Collaborative Filtering
Benzer kullanıcıların tercihlerine dayanarak öneriler sunar.  
**Cosine Similarity** metriği kullanılır.

### ✅ Hybrid Filtering
İki algoritmanın normalize edilmiş skorları birleştirilerek daha dengeli öneriler sunulur:

```python
final_score = α * content_score + (1 - α) * collaborative_score
````


### 🗃️ Veritabanı Şeması (PostgreSQL)
```
users(
user_id, name, age, gender, job_category, ...
)

cafes(
cafe_id, name, rating, comments, tags
)

user_favorites(
id, user_id, cafe_id
)

user_ratings(
id, user_id, cafe_id, rating, comment
)
```