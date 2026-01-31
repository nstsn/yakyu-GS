
import sqlite3

def check_db_schema():
    try:
        conn = sqlite3.connect('yakyuu.db')
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables:", [t[0] for t in tables])
        
        # Get schema for 'event' and 'games' as mentioned in DESIGN.md
        for table_name in ['event', 'games']:
            print(f"\nSchema for {table_name}:")
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            for col in columns:
                print(col)
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db_schema()
