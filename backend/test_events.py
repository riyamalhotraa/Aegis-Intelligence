from database import get_db_connection


connection = get_db_connection()
cursor = connection.cursor()

cursor.execute("""
    SELECT
        id,
        event_type,
        request_id,
        result,
        details,
        sensitive_data,
        created_at
    FROM security_events
    ORDER BY id DESC
""")

rows = cursor.fetchall()

for row in rows:
    print(dict(row))

connection.close()