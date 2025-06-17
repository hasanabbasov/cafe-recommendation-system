import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
from sqlalchemy import create_engine, text
from config import SQLALCHEMY_DATABASE_URI
import os
import uuid
import re

# Get the current script's directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Get the project root directory (two levels up from script)
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
# Construct the path to the Excel file
EXCEL_PATH = os.path.join(PROJECT_ROOT, 'data', 'kucukpark_cafes_all_list.xlsx')

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
    
    # Ensure at least one tag is assigned
    if not matched_tags:
        matched_tags.append('Casual')  # Default tag
    
    return matched_tags

def convert_reviews_to_dict(reviews):
    """Convert reviews string to a list of strings"""
    if isinstance(reviews, str):
        try:
            # Try to parse as JSON first
            reviews_list = json.loads(reviews)
            if isinstance(reviews_list, list):
                return reviews_list
        except json.JSONDecodeError:
            # If not JSON, split by newlines or other delimiters
            return [r.strip() for r in reviews.split('\n') if r.strip()]
    elif isinstance(reviews, list):
        return reviews
    return []

def generate_cafe_id(name):
    """Generate a unique ID for a cafe based on its name"""
    # Remove special characters and spaces, convert to lowercase
    base = re.sub(r'[^a-zA-Z0-9]', '', name.lower())
    # Take first 8 characters of the base name
    base = base[:8]
    # Add a UUID to ensure uniqueness
    unique_id = f"{base}-{str(uuid.uuid4())[:8]}"
    return unique_id

def import_cafes():
    # Check if Excel file exists
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: Excel file not found at {EXCEL_PATH}")
        print("Please make sure the file exists in the correct location.")
        return

    try:
        # Read Excel file
        print(f"Reading Excel file from: {EXCEL_PATH}")
        df = pd.read_excel(EXCEL_PATH)
        print(f"Successfully read {len(df)} rows from Excel file")
        
        # Create database connection
        engine = create_engine(SQLALCHEMY_DATABASE_URI)
        
        # Process each row
        for _, row in df.iterrows():
            # Skip rows with NaN rating
            if pd.isna(row['rating']):
                print(f"Skipping cafe {row['name']} due to missing rating")
                continue
                
            # Generate tags from comments
            tags = generate_tags(row['reviews'])
            
            # Convert reviews to list of strings
            comments = convert_reviews_to_dict(row['reviews'])
            
            # Generate unique cafe ID
            cafe_id = generate_cafe_id(row['name'])
            
            # Prepare cafe data
            cafe_data = {
                'cafe_id': cafe_id,
                'name': row['name'],
                'rating': float(row['rating']),
                'comments': comments,
                'tags': tags
            }
            
            # Insert into database using SQLAlchemy text()
            try:
                with engine.connect() as connection:
                    query = text("""
                        INSERT INTO cafes (cafe_id, name, rating, comments, tags)
                        VALUES (:cafe_id, :name, :rating, :comments, :tags)
                    """)
                    connection.execute(query, cafe_data)
                    connection.commit()
                    print(f"Successfully imported cafe: {row['name']}")
            except Exception as e:
                print(f"Error importing cafe {row['name']}: {str(e)}")
    
    except Exception as e:
        print(f"Error reading Excel file: {str(e)}")

if __name__ == "__main__":
    import_cafes() 