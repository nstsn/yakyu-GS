
import sys
import os
import argparse
from pathlib import Path

# Add src to path to allow running as script if needed, though -m is preferred
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src import data, logic, viz, report

def main():
    parser = argparse.ArgumentParser(description="Yakyuu Grand Slam Hypothesis Verifier")
    parser.add_argument('--db', type=str, default='yakyuu.db', help='Path to SQLite DB')
    parser.add_argument('--out', type=str, default='out', help='Output directory')
    args = parser.parse_args()
    
    out_dir = Path(args.out)
    out_dir.mkdir(exist_ok=True)
    
    print(f"Connecting to DB: {args.db}")
    try:
        conn = data.get_db_connection(args.db)
    except Exception as e:
        print(f"Error: {e}")
        return

    # 1. Load Data
    print("Loading events...")
    events_raw = data.load_events(conn)
    print(f"  Loaded {len(events_raw)} candidate events.")
    
    print("Loading games...")
    games_raw = data.load_games(conn)
    print(f"  Loaded {len(games_raw)} games.")
    
    # ... (previous code)
    
    # 2b. Load Teams for Name Mapping
    print("Loading teams...")
    teams_df = data.load_teams(conn)
    # Create a mapping dictionary for faster/easier mapping
    team_map = dict(zip(teams_df['team_id'], teams_df['team_name']))
    
    conn.close()
    
    # 2. Process Grand Slams
    print("Processing Grand Slam events...")
    gs_df = logic.process_grandslams(events_raw, games_raw)
    print(f"  Identified {len(gs_df)} valid Grand Slam events (<= 9th inning).")
    
    # Map team names
    gs_df['team'] = gs_df['team'].map(team_map).fillna(gs_df['team'])
    gs_df['home_team'] = gs_df['home_team_id'].map(team_map).fillna(gs_df['home_team_id'])
    gs_df['away_team'] = gs_df['away_team_id'].map(team_map).fillna(gs_df['away_team_id'])
    
    gs_df.to_csv(out_dir / 'grandslam_events.csv', index=False, encoding='utf-8-sig')
    
    # 3. Process High Scoring Innings (Comparison Group)
    print("Extracting 4 runs innings...")
    high_df = logic.extract_high_scoring_innings(games_raw, threshold=4)
    print(f"  Found {len(high_df)} innings with 4 runs.")
    
    # Map team names
    high_df['team'] = high_df['team'].map(team_map).fillna(high_df['team'])
    high_df['home_team'] = high_df['home_team_id'].map(team_map).fillna(high_df['home_team_id'])
    high_df['away_team'] = high_df['away_team_id'].map(team_map).fillna(high_df['away_team_id'])
    
    # 4. Integrate
    print("Merging and tagging...")
    final_df = logic.merge_and_tag(gs_df, high_df)
    final_df.to_csv(out_dir / 'fourplus_inning_events.csv', index=False, encoding='utf-8-sig')
    
    # 5. Analysis
    print("Generating summaries...")
    overall, stage = viz.generate_summary(final_df)
    
    # Save summaries
    overall.to_csv(out_dir / 'summary_overall.csv', encoding='utf-8-sig')
    stage.to_csv(out_dir / 'summary_stage.csv', encoding='utf-8-sig')
    
    # 6. Localization/Plotting
    print("Plotting comparison...")
    viz.plot_comparison(final_df, out_dir / 'comparison_runs_after.png')
    
    # 7. Dashboard Data
    print("Exporting dashboard data...")
    viz.export_json(final_df, (overall, stage), out_dir / 'dashboard_data.json')
    
    # 8. Report
    print("Generating report...")
    report.generate_markdown_report(overall, stage, out_dir / 'report.md')
    
    print("Done! Check output in 'out/' directory.")

if __name__ == "__main__":
    main()
