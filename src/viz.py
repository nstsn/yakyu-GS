
import pandas as pd
import matplotlib.pyplot as plt
import json
import os

def generate_summary(df):
    """
    Generates summary statistics grouping by is_grandslam.
    """
    # Define groups
    def get_stage(inning):
        if inning <= 3: return 'Early (1-3)'
        elif inning <= 6: return 'Mid (4-6)'
        else: return 'Late (7-9)'
        
    df['stage'] = df['inning_no'].apply(get_stage)
    
    # Calculate if at least one run was scored after
    df['scored_any'] = (df['post_inning_runs_1to9'] > 0).astype(int)
    
    # 1. Overall Comparison
    overall = df.groupby('is_grandslam').agg({
        'post_run_rate': ['mean', 'median', 'count', 'std'],
        'post_inning_runs_1to9': 'mean',
        'remaining_off_innings_1to9': 'mean',
        'scored_any': 'mean' # This becomes the probability
    }).round(3)
    
    # Rename for clarity if needed, but keeping consistent with other flattened names
    
    # 2. Stage Breakdown
    stage = df.groupby(['stage', 'is_grandslam']).agg({
        'post_run_rate': ['mean', 'median', 'count'],
        'scored_any': 'mean'
    }).round(3)
    
    return overall, stage

def plot_comparison(df, output_path):
    """
    Creates visual comparison of post_run_rate.
    """
    # Filter out cases with 0 remaining innings (though logic should have handled it/NaN)
    valid = df.dropna(subset=['post_run_rate'])
    
    plt.figure(figsize=(10, 6))
    
    # Boxplot
    # Prepare data
    gs_data = valid[valid['is_grandslam'] == True]['post_run_rate']
    non_gs_data = valid[valid['is_grandslam'] == False]['post_run_rate']
    
    plt.boxplot([non_gs_data, gs_data], labels=['Non-GS 4+ Runs', 'Grand Slam (4 Runs)'], patch_artist=True)
    
    plt.title('Post-Inning Run Rate Comparison\n(Runs Scored After Big Inning / Remaining Innings)')
    plt.ylabel('Run Rate')
    plt.grid(True, linestyle='--', alpha=0.6)
    
    plt.savefig(output_path)
    plt.close()

def export_json(events_df, summary_df_list, output_path):
    """
    Exports data for the web dashboard.
    """
    # Convert timestamps to string if any
    events = events_df.where(pd.notnull(events_df), None).to_dict(orient='records')
    
    # summary_df_list is tuple (overall, stage)
    # Pandas multi-index columns need flattening for JSON
    
    def flatten_stats(df):
        # Flatten MultiIndex columns
        df_flat = df.copy()
        df_flat.columns = ['_'.join(col).strip() for col in df.columns.values]
        return df_flat.reset_index().to_dict(orient='records')

    overall_stats = flatten_stats(summary_df_list[0])
    stage_stats = flatten_stats(summary_df_list[1])

    # Replace NaN/Infinity with None for valid standard JSON
    def clean_for_json(obj):
        if isinstance(obj, float):
            if pd.isna(obj) or np.isinf(obj):
                return None
        if isinstance(obj, dict):
            return {k: clean_for_json(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [clean_for_json(v) for v in obj]
        return obj

    # Clean the entire data structure
    # Note: data['events'] is a list of dicts from pandas.
    # Pandas to_dict might have left NaNs if we didn't handle them.
    # The stats dictionaries also need cleaning.
    
    # Re-construct data cleanly
    data = {
        "metadata": {
            "description": "Analysis of Grand Slam vs Non-GS 4+ Run Innings",
            "source": "yakyuu.db"
        },
        "stats": {
            "overall": json.loads(pd.DataFrame(overall_stats).to_json(orient='records')),
            "by_stage": json.loads(pd.DataFrame(stage_stats).to_json(orient='records'))
        },
        "events": json.loads(pd.DataFrame(events).to_json(orient='records'))
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
