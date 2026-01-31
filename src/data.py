
import sqlite3
import pandas as pd
import os
from pathlib import Path

DB_PATH = Path('yakyuu.db')

def get_db_connection(db_path=DB_PATH):
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found at: {db_path}")
    return sqlite3.connect(db_path)

def load_events(conn):
    """
    Load raw event data needed for grand slam identification.
    Filters: hr=1, rbi=4 (pre-filter, exact logic in logic.py)
    """
    query = """
    SELECT 
        game_id,
        inning,
        team,
        on_base,
        hr,
        rbi,
        batter_player_id
    FROM event
    WHERE hr = 1 AND rbi = 4
    """
    return pd.read_sql_query(query, conn)

def load_games(conn):
    """
    Load game score data.
    """
    query = """
    SELECT * FROM games
    """
    # Reading all might be heavy if db is huge, but usually manageable for this scope.
    # If optimization needed, select specific columns.
    return pd.read_sql_query(query, conn)

def load_all_innings_scores(conn):
    """
    Load innings scores for 4+ runs analysis.
    We need efficient loading here.
    """
    # Simply reusing load_games as it contains all inning scores
    return load_games(conn)

def load_teams(conn):
    """
    Load team names mapping.
    """
    query = "SELECT team_id, team_name FROM teams"
    return pd.read_sql_query(query, conn)
