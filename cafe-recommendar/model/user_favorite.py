from app import db

class UserFavorite(db.Model):
    __tablename__ = 'user_favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.user_id'), nullable=False)
    cafe_id = db.Column(db.String, db.ForeignKey('cafes.cafe_id'), nullable=False)
    added_at = db.Column(db.DateTime, server_default=db.func.now())