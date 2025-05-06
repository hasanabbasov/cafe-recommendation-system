from flask import Blueprint, request, jsonify
from app import db
from model.user_rating import UserRating

user_rating_bp = Blueprint('user_rating_bp', __name__)

@user_rating_bp.route('/ratings', methods=['POST'])
def add_rating():
    data = request.get_json()

    new_rating = UserRating(
        user_id=data['user_id'],
        cafe_id=data['cafe_id'],
        rating=data['rating'],
        comment=data.get('comment', "")
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({'message': 'Puanlama eklendi!'}), 201

@user_rating_bp.route('/ratings', methods=['GET'])
def get_ratings():
    ratings = UserRating.query.all()
    result = []

    for r in ratings:
        result.append({
            'id': r.id,
            'user_id': r.user_id,
            'cafe_id': r.cafe_id,
            'rating': r.rating,
            'comment': r.comment,
            'timestamp': r.timestamp.isoformat()
        })

    return jsonify(result), 200