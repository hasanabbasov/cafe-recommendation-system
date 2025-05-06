from app import db
import uuid

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String)
    job_category = db.Column(db.String)
    job_title = db.Column(db.String)
    preferred_coffee = db.Column(db.ARRAY(db.String))
    visit_frequency = db.Column(db.Integer)
    average_spend = db.Column(db.Float)
    average_rating = db.Column(db.Float)
    cafes_visited = db.Column(db.Integer)
    time_preferences = db.Column(db.ARRAY(db.String))
    mood_activity = db.Column(db.String)
    is_international = db.Column(db.Boolean)