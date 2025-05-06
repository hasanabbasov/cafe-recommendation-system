from flask import Blueprint, request, jsonify
from app import db
from model.cafe import Cafe

cafe_bp = Blueprint('cafe_bp', __name__)

@cafe_bp.route('/cafes', methods=['POST'])
def create_cafe():
    data = request.get_json()

    new_cafe = Cafe(
        cafe_id=data['cafe_id'],
        name=data['name'],
        rating=data.get('rating'),
        comments=data.get('comments', []),
        tags=data.get('tags', [])
    )

    db.session.add(new_cafe)
    db.session.commit()

    return jsonify({'message': 'Kafe başarıyla eklendi!'}), 201

@cafe_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafes = Cafe.query.all()
    result = []

    for cafe in cafes:
        result.append({
            'cafe_id': cafe.cafe_id,
            'name': cafe.name,
            'rating': cafe.rating,
            'comments': cafe.comments,
            'tags': cafe.tags
        })

    return jsonify(result), 200