
import sqlite3
import pandas as pd

def parse_inning(inning_str):
    if not isinstance(inning_str, str) or pd.isna(inning_str) or len(inning_str) < 2:
        return None, None
    number_part = inning_str[:-1]
    half_part = inning_str[-1]
    try:
        return int(number_part), half_part
    except:
        return None, None

def is_grandslam_onbase(on_base_str):
    if not isinstance(on_base_str, str) or pd.isna(on_base_str):
        return False
    return ('1' in on_base_str) and ('2' in on_base_str) and ('3' in on_base_str)

def analyze_onbase_method():
    conn = sqlite3.connect('yakyuu.db')
    all_events = pd.read_sql_query("SELECT * FROM event", conn)
    games = pd.read_sql_query("SELECT * FROM games", conn)
    
    gs_mask = all_events.apply(lambda r: is_grandslam_onbase(r['on_base']) and r['hr'] == 1 and r['rbi'] == 4, axis=1)
    gs_events = all_events[gs_mask].copy()
    
    def sort_key(row):
        ino, half = parse_inning(row['inning'])
        h_val = 0 if half == 'T' else 1
        return ino * 10 + h_val

    results = []

    for _, gs in gs_events.iterrows():
        game_id = gs['game_id']
        team = gs['team']
        
        # Check if 3+ runs after
        game_row = games[games['game_id'] == game_id].iloc[0]
        side = 'home' if game_row['home_team_id'] == team else 'visitor'
        gs_inn_no, _ = parse_inning(gs['inning'])
        
        post_runs = 0
        for i in range(gs_inn_no + 1, 10):
            val = game_row.get(f'{side}_inn{i}')
            if pd.notnull(val):
                post_runs += val
        
        if post_runs < 3:
            continue
            
        # Found a re-ignition game.
        # Find first scoring event for this team after GS.
        game_events = all_events[all_events['game_id'] == game_id].copy()
        game_events['sort_order'] = game_events.apply(sort_key, axis=1)
        gs_sort_order = sort_key(gs)
        
        sub_events = game_events[
            (game_events['team'] == team) & 
            (game_events['sort_order'] > gs_sort_order)
        ].sort_values(['sort_order'], ascending=True)
        
        # In a real scenario, we might have multiple events in the same inning half.
        # Since we don't have a sequence number, we assume the physical order in the DB is sorted.
        # Let's use the original dataframe's index as a proxy for order.
        sub_events = sub_events.sort_index()

        scoring_event = sub_events[sub_events['rbi'] > 0].head(1)
        if scoring_event.empty:
            continue
            
        evt = scoring_event.iloc[0]
        score_inn = evt['inning']
        score_sort_order = evt['sort_order']
        
        on_base_start = evt['on_base']
        target_runner_pos = None
        if not isinstance(on_base_start, str) or pd.isna(on_base_start):
            target_runner_pos = 0 # Assume batter if no one on base (or data missing)
        elif '3' in on_base_start: target_runner_pos = 3
        elif '2' in on_base_start: target_runner_pos = 2
        elif '1' in on_base_start: target_runner_pos = 1
        else: target_runner_pos = 0 # Batter
        
        if target_runner_pos == 0:
            results.append({'game_id': game_id, 'method': 'Home Run (Batter)'})
        else:
            inn_events = game_events[
                (game_events['team'] == team) & 
                (game_events['inning'] == score_inn) &
                (game_events['sort_order'] <= score_sort_order)
            ].sort_index()
            
            # Find the first reaching event in this inning
            first_on = inn_events[
                (inn_events['h'] > 0) | (inn_events['bb'] > 0) | (inn_events['hbp'] > 0) | (inn_events['roe'] > 0)
            ].head(1)
            
            if not first_on.empty:
                f_evt = first_on.iloc[0]
                on_method = "Unknown"
                if f_evt['hr'] == 1: on_method = "Home Run"
                elif f_evt['3b'] == 1: on_method = "Triple"
                elif f_evt['2b'] == 1: on_method = "Double"
                elif f_evt['1b'] == 1: on_method = "Single"
                elif f_evt['bb'] == 1: on_method = "Walk"
                elif f_evt['hbp'] == 1: on_method = "HBP"
                elif f_evt['roe'] == 1: on_method = "Error"
                else: on_method = "Other"
                
                results.append({'game_id': game_id, 'method': on_method})

    df_res = pd.DataFrame(results)
    if not df_res.empty:
        print("RESULT_START")
        print(df_res['method'].value_counts().to_string())
        print(f"TOTAL_SAMPLES: {len(results)}")
        print("RESULT_END")
    else:
        print("RESULT_START")
        print("No data")
        print("RESULT_END")

    conn.close()

if __name__ == "__main__":
    analyze_onbase_method()
