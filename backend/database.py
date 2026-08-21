import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "aegis.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            request_id TEXT,
            result TEXT NOT NULL,
            details TEXT,
            sensitive_data TEXT,
            created_at TEXT NOT NULL
        )
    """)

    # ---------------------------------------------------------
    # Add sensitive_data to existing databases
    # ---------------------------------------------------------

    cursor.execute("""
        PRAGMA table_info(security_events)
    """)

    columns = [
        row["name"]
        for row in cursor.fetchall()
    ]

    if "sensitive_data" not in columns:
        cursor.execute("""
            ALTER TABLE security_events
            ADD COLUMN sensitive_data TEXT
        """)

    connection.commit()
    connection.close()