from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
import pandas as pd
import os
print("Current working directory:", os.getcwd())

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    with app.app_context():
        # Drop and recreate all tables

        db.drop_all()

        from model import user, cafe, user_rating, user_favorite, review
        from model.user import User  # Needed for CSV import
        from model.cafe import Cafe
        from model.review import Review


        db.create_all()

        # Register Blueprints
        from routes.user_routes import user_bp
        from routes.cafe_routes import cafe_bp
        from routes.user_rating_routes import user_rating_bp
        from routes.user_favorite_routes import user_favorite_bp
        from routes.recommendation_routes import recommendation_bp
        from routes.user_review_routes import user_review_bp

        app.register_blueprint(user_bp)
        app.register_blueprint(cafe_bp)
        app.register_blueprint(user_rating_bp)
        app.register_blueprint(user_favorite_bp)
        app.register_blueprint(recommendation_bp)
        app.register_blueprint(user_review_bp)

#         # Load users from CSV and insert into DB
#         try:
#             df = pd.read_csv('./users.csv')
#             users = [User(**row) for row in df.to_dict(orient='records')]
#             db.session.bulk_save_objects(users)
#             db.session.commit()
#         except Exception as e:
#             print(f"Error importing users.csv: {e}")
#             db.session.rollback()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
