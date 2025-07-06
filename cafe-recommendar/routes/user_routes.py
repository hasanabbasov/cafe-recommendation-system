from flask import Blueprint, request, jsonify
from app import db
from model.user import User
import uuid

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    new_user = User(
        user_id=str(uuid.uuid4()),
        name=data['name'],
        age=data['age'],
        gender=data['gender'],
        job_category=data.get('job_category'),
        job_title=data.get('job_title'),
        preferred_coffee_type=data.get('preferred_coffee_type', []),
        visit_frequency=data.get('visit_frequency'),
        average_spend=data.get('average_spend'),
        average_rating=data.get('average_rating'),
        cafes_visited=data.get('cafes_visited'),
        time_preferences=data.get('time_preferences', []),
        mood_activity=data.get('mood_activity'),
        is_international=data.get('is_international', False)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'Kullanıcı başarıyla oluşturuldu',
        'user_id': new_user.user_id
    }), 201

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = []

    for user in users:
        result.append({
            'user_id': user.user_id,
            'name': user.name,
            'age': user.age,
            'gender': user.gender,
            'job_category': user.job_category,
            'job_title': user.job_title,
            'preferred_coffee_type': user.preferred_coffee_type,
            'visit_frequency': user.visit_frequency,
            'average_spend': user.average_spend,
            'average_rating': user.average_rating,
            'cafes_visited': user.cafes_visited,
            'time_preferences': user.time_preferences,
            'mood_activity': user.mood_activity,
            'is_international': user.is_international
        })
    return jsonify(result), 200