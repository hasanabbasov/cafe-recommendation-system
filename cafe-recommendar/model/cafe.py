from app import db

class Cafe(db.Model):
    __tablename__ = 'cafes'

    cafe_id = db.Column(db.String, primary_key=True)  # Google Maps ID veya özel ID
    name = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float)
    comments = db.Column(db.ARRAY(db.String))
    reviews = db.Column(db.ARRAY(db.String))  # örn:q ["wifi", "sessiz", "dış mekan"]