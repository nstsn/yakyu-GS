import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import DashboardWrapper from './components/DashboardWrapper';

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
  [key: string]: any; // Allow dynamic access for inning scores
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
  // In a real app we might want error handling here, but for this demo simple read is fine.
  // If multiple reads are needed, caching or using a proper data fetching strat is better.
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getData();

  const gsStats = data.stats.overall.find((s) => s.is_grandslam === true);
  const nonGsStats = data.stats.overall.find((s) => s.is_grandslam === false);

  const gsCount = gsStats?.post_run_rate_count || 0;
  const nonGsCount = nonGsStats?.post_run_rate_count || 0;

  // Prepare Stage Data
  const stages = ['Early (1-3)', 'Mid (4-6)', 'Late (7-9)'];

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">

      <DashboardWrapper>
        {/* Main Dashboard Content */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 relative z-10">
          <div className="max-w-6xl mx-auto space-y-12 p-6 md:p-12 pt-16 md:pt-24">

            {/* Header */}
            <header className="space-y-4 text-center animate-reveal">
              <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-500/20">
                Analysis Report
              </div>
              <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 pb-2">
                検証：勢いは止まるのか？
              </h1>
              <div className="text-slate-400 max-w-4xl mx-auto text-lg leading-relaxed">
                2018年〜2025年の <span className="text-cyan-400 font-bold">満塁ホームラン</span> と <span className="text-slate-300 font-bold">HR以外の得点追加 (4点)</span> の「その後」を徹底比較。
              </div>
            </header>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GS Card */}
              <div className="group relative bg-[#1a0b02]/80 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 hover:bg-[#2a0f05]/90 transition-all duration-300 shadow-2xl overflow-hidden animate-fire animate-reveal stagger-1">
                {/* Dynamic Fire Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 via-red-600/5 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px] animate-pulse"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-500/20 rounded-full blur-[60px] animate-pulse delay-700"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-4 w-4 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600 shadow-[0_0_15px_rgba(255,69,0,1)]"></span>
                    </span>
                    <h2 className="text-xl font-bold tracking-wider fiery-text drop-shadow-sm flex items-center gap-2">
                      🔥 満塁ホームラン後
                    </h2>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">
                      {gsStats?.post_inning_runs_1to9_mean.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-orange-200 uppercase tracking-widest">点 (平均追加点)</span>
                  </div>
                  <p className="text-xs text-orange-500/60 mb-6 font-mono font-bold tracking-widest">SAMPLES: {gsCount}</p>

                  <div className="space-y-3 bg-black/40 p-5 rounded-2xl border border-orange-500/20 backdrop-blur-md">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-orange-200 font-medium tracking-wide">得点ペース (点/回)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-black text-xl">{gsStats?.post_run_rate_mean.toFixed(3)}</span>
                        <span className="text-orange-500 animate-bounce">▲</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-300 shadow-[0_0_10px_rgba(255,165,0,0.8)] animate-grow-x" style={{ width: '100%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] items-center text-orange-400/70 font-bold uppercase tracking-widest pt-1 border-t border-orange-500/10">
                      <span>Scoring Prob.</span>
                      <span className="font-mono">{((gsStats?.scored_any_mean || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] items-center text-orange-400/70 font-bold uppercase tracking-widest pt-0.5">
                      <span>Innings Covered</span>
                      <span className="font-mono">{gsStats?.remaining_off_innings_1to9_mean.toFixed(2)} inn avg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-GS Card */}
              <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-slate-800/80 transition-all duration-300 shadow-2xl overflow-hidden animate-reveal stagger-2">
                <div className="absolute top-0 right-0 p-32 bg-slate-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-slate-500/10 transition-all"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-3 w-3 relative">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-600"></span>
                    </span>
                    <h2 className="text-xl text-slate-300 font-semibold">比較：HR以外の得点追加 (4点イニング) 後</h2>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-slate-200 tracking-tight">{nonGsStats?.post_inning_runs_1to9_mean.toFixed(2)}</span>
                    <span className="text-sm text-slate-400">点 (平均追加点)</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 font-mono">N = {nonGsCount}</p>

                  <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-400">得点ペース (点/回)</span>
                      <span className="font-mono text-slate-300 font-bold text-lg">{nonGsStats?.post_run_rate_mean.toFixed(3)}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 animate-grow-x" style={{ width: `${(nonGsStats?.post_run_rate_mean || 0) / (gsStats?.post_run_rate_mean || 1) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] items-center text-slate-500 font-bold uppercase tracking-widest pt-1 border-t border-white/5">
                      <span>Scoring Prob.</span>
                      <span className="font-mono">{((nonGsStats?.scored_any_mean || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] items-center text-slate-500 font-bold uppercase tracking-widest pt-0.5">
                      <span>Innings Covered</span>
                      <span className="font-mono">{nonGsStats?.remaining_off_innings_1to9_mean.toFixed(2)} inn avg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Chart Section */}
            <section className="bg-slate-800/30 border border-white/5 rounded-3xl p-8 md:p-10 animate-reveal">
              <div className="mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  イニング帯別分析 (得点ペース：1試合換算)
                </h3>
                <p className="text-slate-400 text-sm mt-2 ml-5">
                  ※各イニング帯でビッグイニングが発生した後、その勢いで「1試合(9イニング)フルで戦ったら何点入るか」の比較
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stages.map(stageName => {
                  const gsSt = data.stats.by_stage.find(s => s.stage === stageName && s.is_grandslam === true);
                  const nonGsSt = data.stats.by_stage.find(s => s.stage === stageName && s.is_grandslam === false);

                  // Convert to "Per 9 Innings" scale
                  const gsRate9 = (gsSt?.post_run_rate_mean || 0) * 9;
                  const nonGsRate9 = (nonGsSt?.post_run_rate_mean || 0) * 9;

                  const maxVal = Math.max(gsRate9, nonGsRate9) * 1.2;
                  // Avoid div by zero
                  const scale = maxVal > 0 ? maxVal : 1;

                  return (
                    <div key={stageName} className={`group/stage relative p-6 rounded-2xl transition-all duration-500 animate-reveal stagger-2 ${stageName.includes('Mid')
                      ? 'bg-[#1a0b02]/60 border border-orange-500/30 hover:bg-[#2a0f05]/80 shadow-[0_0_30px_rgba(255,69,0,0.1)] animate-fire'
                      : 'bg-slate-900/50 border border-white/5 hover:border-white/10'
                      }`}>
                      {stageName.includes('Mid') && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/5 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span className="w-1 h-1 bg-orange-500 rounded-full animate-ping"></span>
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-ping delay-100"></span>
                          </div>
                        </>
                      )}
                      <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center justify-between ${stageName.includes('Mid') ? 'text-orange-400' : 'text-slate-400'}`}>
                        {stageName.replace('Early', '序盤').replace('Mid', '中盤').replace('Late', '終盤')}
                        {stageName.includes('Mid') && <span className="ml-2">🔥</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded ${stageName.includes('Mid') ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-800 text-slate-500'}`}>
                          {stageName.replace(' (', '').replace(')', '')}
                        </span>
                      </h4>

                      <div className="space-y-6">
                        {/* GS Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-cyan-400 font-bold">満塁ホームラン</span>
                            <span className="text-cyan-400 font-mono text-base">{gsRate9.toFixed(2)}</span>
                          </div>
                          <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-grow-x"
                              style={{ width: `${gsRate9 / scale * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Non-GS Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300 font-semibold">HR以外の得点追加 (4点)</span>
                            <span className="text-slate-300 font-mono text-base">{nonGsRate9.toFixed(2)}</span>
                          </div>
                          <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-500 rounded-full animate-grow-x"
                              style={{ width: `${nonGsRate9 / scale * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Timeline / Recent Events */}
            <section className="animate-reveal stagger-3">
              <h3 className="text-2xl font-bold mb-6 mt-12 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                直近の満塁ホームラン一覧
              </h3>
              <div className="bg-slate-800/30 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider backdrop-blur-sm">
                        <th className="p-4 font-semibold whitespace-nowrap">日付</th>
                        <th className="p-4 font-semibold whitespace-nowrap">回</th>
                        <th className="p-4 font-semibold whitespace-nowrap">チーム</th>
                        <th className="p-4 font-semibold text-right whitespace-nowrap">以降得点<span className="text-[10px] block font-normal text-slate-500">(合計)</span></th>
                        <th className="p-4 font-semibold text-right whitespace-nowrap">以降得点率<span className="text-[10px] block font-normal text-slate-500">(点/回)</span></th>
                        <th className="p-4 font-semibold text-center whitespace-nowrap">試合結果</th>
                        <th className="p-4 font-semibold whitespace-nowrap">球場</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {data.events
                        .filter(e => e.is_grandslam)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 10)
                        .map((event, idx) => {
                          const isGrayed = event.post_inning_runs_1to9 === 0;
                          const isWin = (event.team_total_runs_1to9 || 0) > (event.opponent_total_runs_1to9 || 0);

                          return (
                            <tr key={idx} className={`hover:bg-slate-700/30 transition-colors group ${isGrayed ? 'opacity-30 bg-slate-900/50' : ''}`}>
                              <td className="p-4 font-mono text-slate-300 group-hover:text-white transition-colors">{event.date}</td>
                              <td className="p-4 font-bold text-white">{event.inning}</td>
                              <td className="p-4 text-slate-300">{event.team}</td>
                              <td className={`p-4 text-right font-mono font-bold transition-colors ${isGrayed ? 'text-slate-500' : 'text-cyan-300 bg-cyan-500/5 group-hover:bg-cyan-500/10'}`}>
                                {event.post_inning_runs_1to9}
                                <span className="text-[10px] ml-2 font-normal opacity-60">
                                  (残{event.remaining_off_innings_1to9}回)
                                </span>
                              </td>
                              <td className="p-4 text-right font-mono text-slate-400">
                                {event.post_run_rate !== null ? event.post_run_rate.toFixed(3) : '-'}
                              </td>
                              <td className="p-4 text-center font-mono font-bold relative group/score">
                                <span className={`${isWin ? 'text-emerald-400' : 'text-slate-400'} cursor-help border-b border-dotted border-slate-600`}>
                                  {event.team_total_runs_1to9} - {event.opponent_total_runs_1to9}
                                </span>

                                {/* Scoreboard Tooltip */}
                                {!isGrayed && (
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/score:block z-50 w-max pointer-events-none">
                                    <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-4 text-xs">
                                      {/* Triangle pointer */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>

                                      <div className="text-slate-400 mb-2 text-center text-[10px] tracking-wider uppercase">Running Score (9回まで)</div>

                                      <table className="border-collapse">
                                        <thead>
                                          <tr className="text-slate-500 border-b border-white/5">
                                            <th className="p-1 min-w-[20px]"></th>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                              <th key={i} className={`p-1 min-w-[20px] text-center font-normal ${i === event.inning_no ? 'text-cyan-400 font-bold bg-cyan-500/10 rounded-t' : ''}`}>
                                                {i}
                                              </th>
                                            ))}
                                            <th className="p-1 min-w-[30px] text-center font-semibold text-white ml-2">R</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {/* Visitor Row */}
                                          <tr className="border-b border-white/5">
                                            <td className="p-1 text-right font-semibold text-slate-300 pr-2 whitespace-nowrap">
                                              {event.side === 'visitor' ? '★' : ''} {event.away_team}
                                            </td>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                              <td key={i} className={`p-1 text-center font-mono ${i === event.inning_no ? 'bg-cyan-500/10' : ''} ${event.side === 'visitor' && i === event.inning_no ? 'text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'}`}>
                                                {event[`visitor_inn${i}`] !== null ? event[`visitor_inn${i}`] : ''}
                                              </td>
                                            ))}
                                            <td className="p-1 text-center font-mono font-bold text-white pl-2">
                                              {event.side === 'visitor' ? event.team_total_runs_1to9 : event.opponent_total_runs_1to9}
                                            </td>
                                          </tr>
                                          {/* Home Row */}
                                          <tr>
                                            <td className="p-1 text-right font-semibold text-slate-300 pr-2 whitespace-nowrap">
                                              {event.side === 'home' ? '★' : ''} {event.home_team}
                                            </td>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                              <td key={i} className={`p-1 text-center font-mono ${i === event.inning_no ? 'bg-cyan-500/10 rounded-b' : ''} ${event.side === 'home' && i === event.inning_no ? 'text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'}`}>
                                                {event[`home_inn${i}`] !== null ? event[`home_inn${i}`] : 'x'}
                                              </td>
                                            ))}
                                            <td className="p-1 text-center font-mono font-bold text-white pl-2">
                                              {event.side === 'home' ? event.team_total_runs_1to9 : event.opponent_total_runs_1to9}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-slate-500">{event.ballpark}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-center border-t border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-xs text-slate-500 hover:text-slate-300 transition-colors">全てのイベントを見る &rarr;</span>
                </div>
              </div>
            </section>

            {/* Analysis Report Section */}
            <section className="bg-slate-800/50 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-40 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-500/20 mb-6">
                  Verification Report
                </div>
                <h3 className="text-3xl font-bold mb-8 leading-tight">
                  【検証】満塁ホームランで大量得点した後、<br />
                  打線の勢いは止まってしまうのか？
                </h3>

                <article className="prose prose-invert prose-lg max-w-none text-slate-300">
                  <p>
                    「一気に4点取ってお祭り騒ぎ。でも、その直後に打線が冷えて追加点が入らなくなる...」<br />
                    野球ファンなら一度は感じたことがある、この<strong className="text-white">「満塁ホームラン後の燃え尽き」説</strong>。
                  </p>
                  <p>
                    これって本当なんでしょうか？<br />
                    プロ野球のデータ（合計 {gsCount + nonGsCount} 件のビッグイニング）を使って、ガチで検証してみました。
                    <br />
                    <span className="text-xs text-slate-500 mt-2 block">
                      ※本検証では、満塁弾がもたらす直接的な影響力の範囲を正確に測るため、延長戦などは含めず、**「9回終了時点まで」**の得点推移を比較対象としています。
                    </span>
                  </p>

                  <div className="my-10 bg-gradient-to-r from-emerald-900/30 to-slate-900/30 p-6 rounded-xl border-l-4 border-emerald-500">
                    <h4 className="text-xl font-bold text-emerald-400 mt-0 mb-2">結論から言うと</h4>
                    <p className="mb-0 text-white font-bold text-2xl">
                      「勢いは止まらない。むしろ加速する」
                    </p>
                    <p className="mt-2 mb-0">が正解でした。</p>
                  </div>

                  <h4 className="text-white font-bold text-xl mt-8 mb-4">分析結果 1. 得点ペースの比較（1試合換算）</h4>
                  <p>
                    「その後、もし9回まで試合が続いたとしたら何点入るペースか」で比較すると、圧倒的な差が出ました。
                  </p>
                  <ul className="list-none pl-0 space-y-4 my-6 not-prose">
                    <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 animate-reveal stagger-1">
                      <span className="w-12 h-12 flex items-center justify-center bg-orange-500/20 text-orange-400 rounded-full font-bold text-xl shadow-[0_0_15px_rgba(255,69,0,0.2)]">VS</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-white flex items-center gap-2">満塁ホームラン後 <span className="text-[10px] animate-pulse">🔥</span></span>
                          <span className="font-mono text-2xl text-orange-400 font-bold drop-shadow-sm">{(gsStats?.post_run_rate_mean! * 9).toFixed(2)} <span className="text-sm text-slate-400 font-normal">点ペース</span></span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-300 h-full animate-grow-x shadow-[0_0_10px_rgba(255,165,0,0.5)]" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 opacity-80 animate-reveal stagger-2">
                      <span className="w-12 h-12"></span>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-400">HR以外の得点追加後</span>
                          <span className="font-mono text-xl text-slate-300 font-bold">{(nonGsStats?.post_run_rate_mean! * 9).toFixed(2)} <span className="text-sm text-slate-500 font-normal">点ペース</span></span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-slate-500 h-full animate-grow-x" style={{ width: `${(nonGsStats?.post_run_rate_mean || 0) / (gsStats?.post_run_rate_mean || 1) * 100}%` }}></div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <p>
                    なんと、満塁ホームランの後の方が、打線の勢いは上回っています。<br />
                    ただし、詳しく見ると面白い事実が。実は**「追加点が入る確率（発生率）」**だけで見ると、通常のビッグイニング後（56.5%）よりわずかに低い <strong className="text-white">53.3%</strong> でした。
                  </p>
                  <p>
                    つまり、「一旦落ち着いてしまう（燃え尽き）」時間は確かに存在するものの、<strong className="text-emerald-400 text-lg italic">「一度火がつくと止まらなくなる爆発力（再着火）」</strong>がその後の平均得点を大きく押し上げている、という実態が浮かび上がってきました。
                  </p>

                  <h4 className="text-white font-bold text-xl mt-12 mb-4">分析結果 2. イニング別の面白い傾向</h4>
                  <p>さらに詳しく見ると、「いつ打ったか」で大きく運命が分かれています。</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
                    <div className="bg-slate-900/40 p-5 rounded-xl border border-white/5">
                      <h5 className="text-lg font-bold text-emerald-300 mb-2">☀️ 序盤・中盤（1〜6回）</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        めちゃくちゃ打ちます。特に中盤に満塁弾が出た場合の勢いは凄まじく、得点ペースは比較対象を大きく上回りました。「イケイケ」の雰囲気は本物のようです。
                      </p>
                    </div>
                    <div className="bg-slate-900/40 p-5 rounded-xl border border-white/5">
                      <h5 className="text-lg font-bold text-indigo-300 mb-2">🌙 終盤（7〜9回）</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        ここだけは急ブレーキがかかります。ペースに換算すると「1試合やっても2点も取れない」レベルまで落ち込みます。おそらく点差が開きすぎて「店じまい」ムードになるからだと推測されます。
                      </p>
                    </div>
                  </div>

                  <h4 className="text-white font-bold text-xl mt-12 mb-4">まとめ</h4>
                  <p>
                    「満塁弾で満足して打線が沈黙する」というのは、どうやら私の（そして多くのファンの）思い込みだったようです。<br />
                    次に贔屓チームが満塁ホームランを打ったら、安心してこう思いましょう。
                  </p>
                  <p className="text-center font-bold text-3xl text-white my-8">
                    「まだまだ点は入るぞ！」
                  </p>

                  {/* Future Work / Deep Dive */}
                  <div className="mt-20 pt-10 border-t border-white/10">
                    <h4 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
                      🔍 今後の深掘り課題：得点の「理由」を考える
                    </h4>
                    <p className="text-sm text-slate-400 mb-6 font-sans">
                      今回の分析では「満塁ホームラン後の得点率」を機械的に集計しましたが、個別の試合を見ると、数字だけでは語れないドラマがありました。
                    </p>

                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5">
                      <h5 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 font-sans">
                        <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Case Study</span>
                        2025年9月13日 読売ジャイアンツの例
                      </h5>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 text-sm leading-relaxed text-slate-300 font-sans">
                          <p>
                            1回裏に満塁ホームランが飛び出し、最高のスタートを切った試合。しかし5回表に一挙7点を奪われ、<strong className="text-white">10 - 6</strong> と逆転を許してしまいます。
                          </p>
                          <p className="mt-2 text-slate-300">
                            その後、巨人は7回に3点、9回に2点を取り返し、最終的に <strong className="text-white">11 - 10</strong> で劇的なサヨナラ勝ちを収めました。
                          </p>
                          <p className="mt-4 p-3 bg-white/5 rounded-lg italic text-slate-400 border-l-2 border-slate-700">
                            「この後半の得点は、満塁弾の『勢い』なのか。それとも逆転されたことによる『反撃の意志』なのか？」
                          </p>
                          <p className="mt-4 text-slate-300 font-sans">
                            今回の統計ではこれらも「満塁ホームラン後の得点」としてカウントされていますが、得点の背景にある「点差の変化」や「試合展開」を考慮することで、より本質的な「打線の心理」に迫れるかもしれません。
                          </p>
                        </div>
                        <div className="md:w-56 w-full bg-slate-800 rounded-lg p-3 font-mono text-[10px] border border-white/5 opacity-80 shadow-inner">
                          <div className="text-center border-b border-white/10 pb-1 mb-2 text-slate-500 uppercase tracking-tighter">Running Score (09/13)</div>
                          <div className="flex justify-between py-0.5"><span>Tigers</span><span className="text-slate-300 tracking-wider">300 070 000 | 10</span></div>
                          <div className="flex justify-between py-0.5 font-bold text-cyan-400"><span>Giants</span><span className="tracking-wider">402 000 302 | 11</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5 mt-6">
                      <h5 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 font-sans">
                        <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Hypothesis</span>
                        打線の「意外性」がもたらす波及効果
                      </h5>
                      <div className="text-sm leading-relaxed text-slate-300 font-sans">
                        <p>
                          もう一つの興味深い仮説は、<strong className="text-white">「誰が打ったか」がチームの士気に与える影響</strong>です。
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
                          <li>本塁打率や打率が極端に低い選手のホームラン</li>
                          <li>投手のタイムリー、あるいはホームラン</li>
                          <li>不振にあえいでいた選手の「マルチ安打」</li>
                        </ul>
                        <p className="mt-4">
                          観客席が一番盛り上がるのは「ホームラン」という野球の華ですが、共に戦う選手やベンチ、首脳陣にとって、こうした「意外な一打」は数値以上の勇気を与え、打線全体の奮起（相関）を呼ぶ可能性があります。
                        </p>
                        <p className="mt-2 text-xs text-slate-500 italic">
                          ※ホームランだけではサンプルが少ない場合、下位打線のマルチ安打と、その後のイニングでの得点率の相関を調べることで、この「ベンチの盛り上がり」を数値化できるかもしれません。
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5 mt-6">
                      <h5 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 font-sans">
                        <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Future Research</span>
                        「再着火」のきっかけ：何が勢いを呼び覚ますのか？
                      </h5>
                      <div className="text-sm leading-relaxed text-slate-300 font-sans">
                        <p>
                          今回の分析で明らかになった、満塁弾後の「確率は低いが爆発力は高い」という特徴。
                          では、一旦落ち着いた打線に再び火をつける**「再着火のきっかけ」**は何なのでしょうか？
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-1 text-slate-400 text-xs">
                          <li>代打の切り札による「出塁」</li>
                          <li>相手のエラーや四球といった守備の「綻び」</li>
                          <li>回を跨いだ際の「相手投手の交代」</li>
                        </ul>
                        <p className="mt-4">
                          このトリガーを特定できれば、満塁弾が生む熱量を冷まさずに「確実な大量得点」へと繋げる、プロ野球の新たな戦略が見えてくるかもしれません。
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>

          </div>

          {/* Footer */}
          <footer className="py-12 text-center text-slate-600 text-sm border-t border-white/5 mt-12 bg-slate-950/20 backdrop-blur-sm">
            <p>© 2026 NPB Grand Slam Analysis Project.</p>
            <div className="mt-4 space-y-1 text-[10px] md:text-xs">
              <p>
                Data source: <span className="text-slate-400">Internal Database (2018-2025 seasons)</span>
              </p>
              <p>
                Database compiled and processed by <a href="https://github.com/pluckhahn/yakyuu" target="_blank" rel="noopener noreferrer" className="text-cyan-500/70 hover:text-cyan-400 transition-colors underline decoration-cyan-500/20">Lukas Pluckhahn (yakyuu.jp)</a>
              </p>
              <p className="opacity-50">
                All underlying player stats and game results are property of Nippon Professional Baseball (NPB).
              </p>
            </div>
          </footer>
        </div>
      </DashboardWrapper>
    </main>
  );
}
