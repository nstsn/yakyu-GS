
import pandas as pd
import numpy as np

def parse_inning(inning_str):
    """
    Parses inning string like '7T', '1B'.
    Returns (inning_no, half) or (None, None) if format invalid.
    """
    try:
        if not inning_str or len(inning_str) < 2:
            return None, None
        
        # usually number + T/B
        number_part = inning_str[:-1]
        half_part = inning_str[-1]
        
        return int(number_part), half_part
    except ValueError:
        return None, None

def is_grandslam_onbase(on_base_str):
    """
    Checks if on_base string contains identifiers for 1st, 2nd, and 3rd base.
    Assuming identifiers are '1', '2', '3'.
    """
    if not isinstance(on_base_str, str):
        return False
    return ('1' in on_base_str) and ('2' in on_base_str) and ('3' in on_base_str)

def process_grandslams(events_df, games_df):
    """
    Enriches event data with game context and calculates post-inning run rates.
    """
    # 1. Strict Grand Slam Filters
    # Already filtered by hr=1, rbi=4 in data loading, but check on_base here.
    gs_df = events_df[events_df['on_base'].apply(is_grandslam_onbase)].copy()
    
    # 2. Parse Inning
    inning_parsed = gs_df['inning'].apply(parse_inning)
    gs_df['inning_no'] = [x[0] for x in inning_parsed]
    gs_df['half'] = [x[1] for x in inning_parsed]
    
    # Filter 9th inning or earlier (ignore extras for now as per PRD)
    gs_df = gs_df[gs_df['inning_no'] <= 9].copy()
    
    # 3. Join with Games
    # We need home_team_id and away_team_id to determine side
    merged = pd.merge(gs_df, games_df, on='game_id', how='left')
    
    # 4. Determine Side (Home/Visitor)
    def determine_side(row):
        if row['team'] == row['home_team_id']:
            return 'home'
        elif row['team'] == row['away_team_id']:
            return 'visitor'
        else:
            return None # Data mismatch

    merged['side'] = merged.apply(determine_side, axis=1)
    merged = merged.dropna(subset=['side']) # Drop mismatches
    
    # 5. Calculate Post-Inning Runs and Remaining Innings
    def calc_post_stats(row):
        inning_no = row['inning_no']
        side = row['side']
        
        runs_total = 0
        innings_count = 0
        
        runs_total = 0
        innings_count = 0
        
        # Sum runs from (current inning + 1) to 9
        for i in range(inning_no + 1, 10):
            col_name = f"{side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                runs_total += row[col_name]
                innings_count += 1
        
        # Team Total 1-9
        team_total = 0
        for i in range(1, 10):
            col_name = f"{side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                team_total += row[col_name]
                
        opponent_side = 'visitor' if side == 'home' else 'home'
        opponent_total = 0
        for i in range(1, 10):
            col_name = f"{opponent_side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                opponent_total += row[col_name]

        return pd.Series([runs_total, innings_count, team_total, opponent_total], 
                         index=['post_inning_runs_1to9', 'remaining_off_innings_1to9', 'team_total_runs_1to9', 'opponent_total_runs_1to9'])

    stats = merged.apply(calc_post_stats, axis=1)
    merged = pd.concat([merged, stats], axis=1)
    
    # Calculate Rate
    merged['post_run_rate'] = merged['post_inning_runs_1to9'] / merged['remaining_off_innings_1to9']
    
    # Flag for visualization/comparison
    merged['is_grandslam'] = True
    
    # Select relevant columns for clean output
    cols = [
        'game_id', 'date', 'team', 'side', 'inning', 'inning_no', 'batter_player_id',
        'home_team_id', 'away_team_id',
        'post_inning_runs_1to9', 'remaining_off_innings_1to9', 'team_total_runs_1to9', 'opponent_total_runs_1to9', 'post_run_rate', 'is_grandslam'
    ]
    # Add ballpark if available in games_df
    if 'ballpark' in merged.columns:
        cols.append('ballpark')

    # Add inning scores for tooltip
    for i in range(1, 10):
        cols.append(f'visitor_inn{i}')
        cols.append(f'home_inn{i}')
        
    return merged[cols]

def extract_high_scoring_innings(games_df, threshold=4):
    """
    Extracts all innings with run count >= threshold.
    """
    # 1. Melt to long format: game_id, side, inning_no, runs
    id_vars = ['game_id', 'date', 'home_team_id', 'away_team_id']
    if 'ballpark' in games_df.columns:
        id_vars.append('ballpark')
        
    # We need to melt both visitor_innX and home_innX
    # Strategy: Melt all, then parse variable name
    
    value_vars = [c for c in games_df.columns if '_inn' in c and '10' not in c and '11' not in c and '12' not in c] # 1-9 only roughly
    # Better: explicitly construct list 1-9
    visitor_cols = [f'visitor_inn{i}' for i in range(1, 10)]
    home_cols = [f'home_inn{i}' for i in range(1, 10)]
    
    long_df = games_df.melt(id_vars=id_vars, value_vars=visitor_cols + home_cols, 
                            var_name='inn_col', value_name='runs_in_inning')
    
    long_df = long_df.dropna(subset=['runs_in_inning'])
    
    # 2. Parse side and inning number
    def parse_col(s):
        parts = s.split('_')
        side = parts[0] # home or visitor
        inn_num = int(parts[1].replace('inn', ''))
        return side, inn_num
        
    parsed = long_df['inn_col'].apply(parse_col)
    long_df['side'] = [x[0] for x in parsed]
    long_df['inning_no'] = [x[1] for x in parsed]
    
    # 3. Filter Threshold (Exactly 4 runs as requested)
    high_df = long_df[long_df['runs_in_inning'] == threshold].copy()
    
    # 4. Map 'team' column for consistency with grandslam df
    high_df['team'] = np.where(high_df['side'] == 'home', high_df['home_team_id'], high_df['away_team_id'])

    # Construct display inning string (e.g., "7回表", "7回裏")
    def make_inning_str(row):
        inn = row['inning_no']
        # side is who is OFFENSE (scoring runs).
        # visitor scoring -> Top (表), home scoring -> Bottom (裏)
        # Note: logic.py extract_high_scoring_innings melts visitor_innX and home_innX.
        # side='visitor' means visitor scored.
        suffix = '表' if row['side'] == 'visitor' else '裏'
        return f"{inn}回{suffix}"
    
    high_df['inning'] = high_df.apply(make_inning_str, axis=1)
    
    # 5. Calculate Post Stats (Need to rejoin with full games_df or calculate from melted?)
    # Re-using games_df is safer/easier logic similar to process_grandslams
    
    # It's inefficient to apply row-by-row on the whole high_df if it's huge, 
    # but for NPB history it should be fine (< 100k rows likely).
    
    # Let's merge games_df back to high_df to get all inning scores for calculation
    # (The melted df only has single inning score)
    high_df_merged = pd.merge(high_df, games_df, on='game_id', how='left')
    
    # Reuse calculation logic... or refactor.
    # Refactoring calc_post_stats to be standalone would be better but for speed:
    def calc_post_stats_simple(row):
        inning_no = row['inning_no']
        side = row['side'] # 'home' or 'visitor'
        
        runs_total = 0
        innings_count = 0
        
        for i in range(inning_no + 1, 10):
            col_name = f"{side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                runs_total += row[col_name]
                innings_count += 1
        
        team_total = 0
        for i in range(1, 10):
            col_name = f"{side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                team_total += row[col_name]
                
        opponent_side = 'visitor' if side == 'home' else 'home'
        opponent_total = 0
        for i in range(1, 10):
            col_name = f"{opponent_side}_inn{i}"
            if col_name in row and pd.notnull(row[col_name]):
                opponent_total += row[col_name]

        return pd.Series([runs_total, innings_count, team_total, opponent_total], 
                         index=['post_inning_runs_1to9', 'remaining_off_innings_1to9', 'team_total_runs_1to9', 'opponent_total_runs_1to9'])

    # Need to suffix handling if merge happens.
    # high_df has: game_id, date, home_team_id...
    # games_df has: game_id, date, home_team_id... home_inn1...
    
    # Let's clean high_df before merge
    high_df_clean = high_df[['game_id', 'side', 'inning_no', 'runs_in_inning', 'team', 'inning']]
    merged_high = pd.merge(high_df_clean, games_df, on='game_id', how='left')
    
    stats = merged_high.apply(calc_post_stats_simple, axis=1)
    final_high = pd.concat([merged_high, stats], axis=1)
    
    final_high['post_run_rate'] = final_high['post_inning_runs_1to9'] / final_high['remaining_off_innings_1to9']
    
    # Default is_grandslam to False (will be overwritten if matched later)
    final_high['is_grandslam'] = False
    
    # Select relevant columns for clean output
    # Select relevant columns for clean output
    cols = [
        'game_id', 'date', 'team', 'side', 'inning', 'inning_no', 'runs_in_inning',
        'home_team_id', 'away_team_id',
        'post_inning_runs_1to9', 'remaining_off_innings_1to9', 'team_total_runs_1to9', 'opponent_total_runs_1to9', 'post_run_rate', 'is_grandslam'
    ]
    if 'ballpark' in final_high.columns:
        cols.append('ballpark')

    # Add inning scores for tooltip
    for i in range(1, 10):
        # We need to ensure these columns exist in final_high
        # They should be there because we merged with games_df
        if f'visitor_inn{i}' in final_high.columns:
            cols.append(f'visitor_inn{i}')
        if f'home_inn{i}' in final_high.columns:
            cols.append(f'home_inn{i}')

    return final_high[cols]

def merge_and_tag(grandslam_df, high_scoring_df):
    """
    Integrate Logic:
    - Take all 4+ run innings.
    - Check if they correspond to a Grand Slam event (game_id, team, inning_no match).
    - If so, mark is_grandslam=True (and maybe prefer the GS row for details? 
      Actually, the comparison should be between "GS Innings" vs "Non-GS 4+ Innings").
    """
    
    # We mainly work on high_scoring_df as the base universe of "Big Innings".
    # But wait, a GS inning is GUARANTEED to be >= 4 runs.
    # So every row in grandslam_df should ideally exist in high_scoring_df.
    
    # Let's identify matches.
    # Key: game_id, team, inning_no.
    
    gs_keys = set(zip(grandslam_df['game_id'], grandslam_df['team'], grandslam_df['inning_no']))
    
    def check_gs(row):
        return (row['game_id'], row['team'], row['inning_no']) in gs_keys

    high_scoring_df['is_grandslam'] = high_scoring_df.apply(check_gs, axis=1)
    
    # Note: 'inning' string (e.g. 7T) is in grandslam_df but not high_scoring_df (it has raw numbers).
    # That's fine for comparison.
    
    return high_scoring_df
