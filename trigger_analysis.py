
import sqlite3
import pandas as pd
import numpy as np

def parse_inning(inning_str):
    if not inning_str or len(inning_str) < 2:
        return None, None
    number_part = inning_str[:-1]
    half_part = inning_str[-1]
    return int(number_part), half_part

def is_grandslam_onbase(on_base_str):
    if not isinstance(on_base_str, str):
        return False
    return ('1' in on_base_str) and ('2' in on_base_str) and ('3' in on_base_str)

def analyze():
    conn = sqlite3.connect('yakyuu.db')
    
    # 1. Get GS events
    all_events = pd.read_sql_query("SELECT * FROM event", conn)
    gs_mask = all_events.apply(lambda r: is_grandslam_onbase(r['on_base']) and r['hr'] == 1 and r['rbi'] == 4, axis=1)
    gs_events = all_events[gs_mask].copy()
    
    # Pre-parse innings for GS
    gs_events['inn_no'] = gs_events['inning'].apply(lambda x: parse_inning(x)[0])
    gs_events['inn_half'] = gs_events['inning'].apply(lambda x: parse_inning(x)[1])
    
    # 2. Get Games with 3+ additional runs
    # We can use the logic from logic.py or just use the summary data
    # Actually, let's just use the games table to verify post-GS runs
    games = pd.read_sql_query("SELECT * FROM games", conn)
    
    triggers = []
    
    for _, gs in gs_events.iterrows():
        game_id = gs['game_id']
        team = gs['team']
        inn_no = gs['inn_no']
        inn_half = gs['inn_half']
        
        # Check team side in games table
        game_row = games[games['game_id'] == game_id].iloc[0]
        side = 'home' if game_row['home_team_id'] == team else 'visitor'
        
        # Calculate post-GS runs
        post_runs = 0
        for i in range(inn_no + 1, 10):
            val = game_row.get(f'{side}_inn{i}')
            if pd.notnull(val):
                post_runs += val
        
        if post_runs >= 3:
            # 3. Find the first RBI event after this GS for this team
            # Orders of events in the same game? 
            # Assuming the 'event' table is naturally ordered or has an implicit index.
            # Let's get all events for this game/team after the GS.
            
            # Since 'inning' is 1T, 1B, etc., we need to order them.
            # Convert all innings to a sortable score.
            
            game_events = all_events[all_events['game_id'] == game_id].copy()
            
            def sort_key(row):
                ino, half = parse_inning(row['inning'])
                h_val = 0 if half == 'T' else 1
                return ino * 10 + h_val
            
            game_events['sort_order'] = game_events.apply(sort_key, axis=1)
            gs_sort_order = sort_key(gs)
            
            # Subsequent events for the same team
            sub_events = game_events[
                (game_events['team'] == team) & 
                (game_events['sort_order'] > gs_sort_order)
            ].sort_values('sort_order', ascending=True)
            
            # Find the first event with RBI > 0
            first_rbi_event = sub_events[sub_events['rbi'] > 0].head(1)
            
            if not first_rbi_event.empty:
                evt = first_rbi_event.iloc[0]
                # Try to determine trigger type
                # Usually there's an event_type or similar. Let's look at col names.
                # Common columns: 'event_id', 'h', '2b', '3b', 'hr', 'bb', 'hbp', 'error_play'
                trigger_desc = "Unknown"
                if evt.get('hr') == 1: 
                    trigger_desc = "Home Run"
                elif evt.get('base3') == 1: 
                    trigger_desc = "Triple"
                elif evt.get('base2') == 1: 
                    trigger_desc = "Double"
                elif evt.get('h') == 1: 
                    trigger_desc = "Single"
                elif evt.get('bb') == 1 or evt.get('hbp') == 1: 
                    trigger_desc = "Walk/HBP (Pushing run)"
                elif evt.get('sf') == 1: 
                    trigger_desc = "Sacrifice Fly"
                elif evt.get('sac') == 1: 
                    trigger_desc = "Sacrifice Bunt"
                else: 
                    trigger_desc = "Ground out / Error / Fielder Choice"
                
                triggers.append({
                    'game_id': game_id,
                    'inning': evt['inning'],
                    'trigger': trigger_desc,
                    'rbi': evt['rbi']
                })

    df_triggers = pd.DataFrame(triggers)
    if not df_triggers.empty:
        counts = df_triggers['trigger'].value_counts()
        print("RESULT_START")
        for trigger, count in counts.items():
            print(f"{trigger}: {count}")
        print(f"TOTAL_SAMPLES: {len(df_triggers)}")
        print("RESULT_END")

    conn.close()

if __name__ == "__main__":
    analyze()
