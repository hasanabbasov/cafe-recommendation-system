from app import db

class Review(db.Model):
    __tablename__ = 'reviews    '

    review_id = db.Column(db.String, primary_key=True)  # Google Maps ID veya özel ID
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'), nullable=False)
    cafe_id = db.Column(db.String, db.ForeignKey('cafes.cafe_id'), nullable=False)
    user_name = db.Column(db.ARRAY(db.String))
    cafe_name = db.Column(db.ARRAY(db.String))
    rating = db.Column(db.Float) # örn:q ["wifi", "sessiz", "dış mekan"]
    date = db.Column(db.DateTime, server_default=db.func.now())