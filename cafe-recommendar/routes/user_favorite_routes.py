from flask import Blueprint, request, jsonify
from app import db
from model.user_favorite import UserFavorite

user_favorite_bp = Blueprint('user_favorite_bp', __name__)

@user_favorite_bp.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()

    favorite = UserFavorite(
        user_id=data['user_id'],
        cafe_id=data['cafe_id']
    )

    db.session.add(favorite)
    db.session.commit()

    return jsonify({'message': 'Favori kafe eklendi!'}), 201

@user_favorite_bp.route('/favorites', methods=['GET'])
def get_favorites():
    favorites = UserFavorite.query.all()
    result = []

    for fav in favorites:
        result.append({
            'id': fav.id,
            'user_id': fav.user_id,
            'cafe_id': fav.cafe_id,
            'added_at': fav.added_at.isoformat()
        })

    return jsonify(result), 200