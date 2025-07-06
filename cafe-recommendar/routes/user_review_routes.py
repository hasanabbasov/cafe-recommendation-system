from flask import Blueprint, request, jsonify
from app import db
from model.review import Review

user_review_bp = Blueprint('user_review_bp', __name__)

@user_review_bp.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json()

    new_review = Review(
        review_id=data['review_id'],
        user_id=data['user_id'],
        cafe_id=data['cafe_id'],
        user_name=data['user_name'],
        cafe_name=data['cafe_name'],
        rating=data['rating'],
        date=data['date']

    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({'message': 'Puanlama eklendi!'}), 201

@user_review_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    result = []

    for r in reviews:
        result.append({
            'review_id': r.review_id,
            'user_id': r.user_id,
            'cafe_id': r.cafe_id,
            'user_name': r.user_name,
            'cafe_name': r.cafe_name,
            'rating': r.rating,
            'date': r.date
        })

    return jsonify(result), 200