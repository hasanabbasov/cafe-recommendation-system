import csv
import os
from datetime import datetime
from app import create_app, db
from model import user, cafe, user_rating, user_favorite, review
from model.user import User
from model.cafe import Cafe
from model.review import Review
import json


app = create_app()  # make sure you have this factory function
app.app_context().push()  # push context to access DB

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def parse_array_field(value):
    """
    Parse array fields stored as strings like '["wifi", "quiet", "outdoor"]' into Python lists.
    Assumes input is valid JSON-like string.
    """
    import ast
    try:
        return ast.literal_eval(value)
    except Exception:
        return []

def import_users():
    path = os.path.join(BASE_DIR, 'users.csv')
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';', quotechar='"', skipinitialspace=True)

        for i, row in enumerate(reader, 1):
            print(f"Row {i}: {row}")
            user = User(
                user_id=row['user_id'],
                name=row['name'],
                age=int(row['age']) if row.get('age') else None,
                gender=row.get('gender'),
                job_category=row.get('job_category'),
                job_title=row.get('job_title'),
                preferred_coffee_type=parse_array_field(row.get('preferred_coffee_type')),
                visit_frequency=int(row['visit_frequency']) if row.get('visit_frequency') else None,
                average_spend=float(row['average_spend']) if row.get('average_spend') else None,
                average_rating=float(row['average_rating']) if row.get('average_rating') else None,
                cafes_visited=int(row['cafes_visited']) if row.get('cafes_visited') else None,
                   time_preferences=parse_array_field(row.get('time_preferences')),
                   mood_activity=row.get('mood_activity'),
                   is_international=row.get('is_international', '').lower() in ['true', '1', 'yes']
                )
            db.session.add(user)
    db.session.commit()
    print("Users imported!")

def import_cafesxt():
    path = os.path.join(BASE_DIR, 'cafes.csv')
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for i, row in enumerate(reader, 1):
           print(f"Row {i}: {row}")
           # Skip if already imported
           if Cafe.query.filter_by(cafe_id=row['id']).first():
               print(f"Skipping existing cafe: {row['name']}")
               continue
           rating = None
           if row.get('rating'):
               rating = float(row['rating'].replace(',', '.'))

           cafe = Cafe(
            cafe_id=row['id'],
            name=row['name'],
            rating = rating,
            reviews=parse_array_field(row.get('reviews', '[]'))
           )
           db.session.add(cafe)
    db.session.commit()
    print("Cafes imported!")


def import_reviews():
    path = os.path.join(BASE_DIR, 'reviews.csv')
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            if Review.query.filter_by(review_id=row['review_id']).first():
                continue

            # Parse date safely
            try:
                date_val = datetime.strptime(row['date'], '%Y-%m-%d %H:%M:%S')
            except Exception:
                date_val = None  # or datetime.utcnow()

            review = Review(
                review_id=row['review_id'],
                user_id=row['user_id'],
                user_name=row['user_name'],
                cafe_name=row.get('cafe_name'),
                cafe_id=row['cafe_id'],
                rating=float(row['rating']) if row['rating'] else None,
                date=date_val
            )
            db.session.add(review)
    db.session.commit()
    print("Reviews imported!")




## IMPORT CAFESSS

# Tag mapping dictionary
TAG_KEYWORDS = {
    'Relaxed': ['relax', 'comfortable', 'peaceful', 'calm', 'quiet', 'chill', 'cozy'],
    'Focused': ['focus', 'concentration', 'work', 'study', 'productive', 'silent'],
    'Social': ['social', 'friends', 'group', 'meeting', 'gathering', 'chat'],
    'Creative': ['creative', 'art', 'design', 'inspiration', 'unique', 'artistic'],
    'Productive': ['productive', 'work', 'business', 'meeting', 'laptop', 'wifi'],
    'Casual': ['casual', 'informal', 'relaxed', 'comfortable', 'easy'],
    'Business': ['business', 'meeting', 'professional', 'formal', 'work'],
    'Study': ['study', 'student', 'library', 'quiet', 'concentration', 'homework'],
    'Meeting': ['meeting', 'group', 'team', 'discussion', 'business'],
    'Date': ['date', 'romantic', 'couple', 'intimate', 'cozy']
}

path = os.path.join(BASE_DIR, 'cafes.csv')

def preprocess_comments(comments):
    """Convert list of comments to a single string and clean it"""
    if isinstance(comments, list):
        return ' '.join(str(comment).lower() for comment in comments)
    return str(comments).lower()

def generate_tags(comments):
    """Generate tags based on comment content using keyword matching"""
    if not comments:
        return []
    comment_text = preprocess_comments(comments)
    matched_tags = []
    for tag, keywords in TAG_KEYWORDS.items():
        if any(keyword in comment_text for keyword in keywords):
            matched_tags.append(tag)
    if not matched_tags:
        matched_tags.append('Casual')
    return matched_tags

def convert_reviews_to_list(reviews):
    """Convert reviews string to list"""
    if isinstance(reviews, str):
        try:
            reviews_list = json.loads(reviews)
            if isinstance(reviews_list, list):
                return reviews_list
        except json.JSONDecodeError:
            return [r.strip() for r in reviews.split('\n') if r.strip()]
    elif isinstance(reviews, list):
        return reviews
    return []


def import_cafes():
    if not os.path.exists(path):
        print(f"Error: CSV file not found at {path}")
        return

    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for i, row in enumerate(reader, 1):
            print(f"Row {i}: {row}")

            # Skip if already imported
            if Cafe.query.filter_by(cafe_id=row['id']).first():
                print(f"Skipping existing cafe: {row['name']}")
                continue

            rating = None
            if row.get('rating'):
                rating = float(row['rating'].replace(',', '.'))

            reviews_list = convert_reviews_to_list(row.get('reviews', ''))
            tags = generate_tags(reviews_list)

            cafe = Cafe(
                cafe_id=row['id'],
                name=row['name'],
                rating=rating,
                reviews=parse_array_field(row.get('reviews', '[]')),
                tags=tags
            )
            db.session.add(cafe)

        db.session.commit()
        print("Cafes imported!")


if __name__ == '__main__':
    with app.app_context():
        import_users()
        import_cafes()
        import_reviews()