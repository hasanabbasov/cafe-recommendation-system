DB_USER = "postgres"
DB_PASSWORD = "startcse"
DB_NAME = "recommendation"
DB_HOST = "localhost"
DB_PORT = "5432"

SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False