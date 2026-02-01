import fs from 'fs';
import path from 'path';
import DashboardContent from './components/DashboardContent';

// Types
type OverallStat = {
  is_grandslam: boolean;
  post_run_rate_mean: number;
  post_run_rate_median: number;
  post_run_rate_count: number;
  post_run_rate_std: number;
  post_inning_runs_1to9_mean: number;
  remaining_off_innings_1to9_mean: number;
  scored_any_mean: number;
};

type StageStat = {
  stage: string;
  is_grandslam: boolean;
  post_run_rate_mean: number;
  post_run_rate_median: number;
  post_run_rate_count: number;
  scored_any_mean: number;
};

type EventData = {
  game_id: string;
  date: string;
  team: string;
  side: string;
  inning: string;
  inning_no: number;
  post_inning_runs_1to9: number;
  remaining_off_innings_1to9: number;
  team_total_runs_1to9: number;
  opponent_total_runs_1to9: number;
  post_run_rate: number;
  is_grandslam: boolean | null;
  ballpark?: string;
  [key: string]: any;
};

type DashboardData = {
  metadata: { description: string; source: string };
  stats: {
    overall: OverallStat[];
    by_stage: StageStat[];
  };
  events: EventData[];
};

async function getData(): Promise<DashboardData> {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

async function getAfterwordContent(): Promise<string> {
  const filePath = path.join(process.cwd(), '..', 'blog', '編集後記.md');
  return fs.readFileSync(filePath, 'utf8');
}

export default async function Home() {
  const data = await getData();
  const afterwordContent = await getAfterwordContent();

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
      <DashboardContent data={data} afterwordContent={afterwordContent} />
    </main>
  );
}
