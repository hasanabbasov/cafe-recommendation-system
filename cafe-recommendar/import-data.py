import csv
import os
from datetime import datetime
from app import create_app, db
from model import user, cafe, user_rating, user_favorite, review
from model.user import User
from model.cafe import Cafe
from model.review import Review


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

def import_cafes():
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
                cafe_id=row['cafe_id'],
                user_name=parse_array_field(row.get('user_name', '[]')),
                cafe_name=parse_array_field(row.get('cafe_name', '[]')),
                rating=float(row['rating']) if row['rating'] else None,
                date=date_val
            )
            db.session.add(review)
    db.session.commit()
    print("Reviews imported!")

if __name__ == '__main__':
    with app.app_context():
        import_users()
        import_cafes()
        import_reviews()