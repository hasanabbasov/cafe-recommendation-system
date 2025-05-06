from flask import Blueprint, jsonify
from services.recommendar import get_recommendations
from services.user_based_collaborative_filtering import user_based_collaborative_filtering

from services.item_based_collaborative_filtering import get_item_based_collaborative_filtering
from services.hybrid_recommender_service import get_hybrid_recommendations
from model.cafe import Cafe


recommendation_bp = Blueprint('recommendation_bp', __name__)

@recommendation_bp.route('/recommendations/<user_id>', methods=['GET'])
def recommend(user_id):
    results = get_recommendations(user_id)
    return jsonify(results), 200



@recommendation_bp.route('/recommendations/<string:user_id>/cf', methods=['GET'])
def collaborative_recommendation(user_id):
    results = user_based_collaborative_filtering(user_id)
    return jsonify(results)




@recommendation_bp.route('/recommendations/<user_id>/item-cf', methods=['GET'])
def item_based_recommendation(user_id):
    results = get_item_based_collaborative_filtering(user_id)
    return jsonify(results)



@recommendation_bp.route('/recommendations/<user_id>/hybrid', methods=['GET'])
def hybrid_recommendations(user_id):
    results = get_hybrid_recommendations(user_id)
    return jsonify(results)



@recommendation_bp.route('/top-cafes', methods=['GET'])
def top_cafes():
    cafes = Cafe.query.all()

    # Eksik data varsa sıfırla
    cafes_with_reviews = [{
        "cafe_id": c.cafe_id,
        "name": c.name,
        "rating": c.rating or 0,
        "reviews": len(c.comments or []),
        "priceLevel": "Orta"  # isteğe göre fiyat etiketi eklenecek
    } for c in cafes]

    # Sıralamaları yap
    top_rated = sorted(cafes_with_reviews, key=lambda x: x['rating'], reverse=True)[:6]
    most_reviewed = sorted(cafes_with_reviews, key=lambda x: x['reviews'], reverse=True)[:6]

    return jsonify({
        "topRated": top_rated,
        "mostReviewed": most_reviewed
    }), 200