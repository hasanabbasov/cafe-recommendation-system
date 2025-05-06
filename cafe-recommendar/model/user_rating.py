from app import db

class UserRating(db.Model):
    __tablename__ = 'user_ratings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'), nullable=False)
    cafe_id = db.Column(db.String, db.ForeignKey('cafes.cafe_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1–5 arası
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())