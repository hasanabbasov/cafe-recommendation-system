from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # 🔥 CORS'u tüm route'lara açıyoruz
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    with app.app_context():
        from model import user, cafe, user_rating, user_favorite
        db.create_all()
    from routes.user_routes import user_bp
    from routes.cafe_routes import cafe_bp
    from routes.user_rating_routes import user_rating_bp
    from routes.user_favorite_routes import user_favorite_bp
    from routes.recommendation_routes import recommendation_bp
    app.register_blueprint(user_bp)
    app.register_blueprint(cafe_bp)
    app.register_blueprint(user_rating_bp)
    app.register_blueprint(user_favorite_bp)
    app.register_blueprint(recommendation_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)