'use client';

import { useState } from 'react';
import DashboardWrapper from './DashboardWrapper';
import AfterwordModal from './AfterwordModal';

type DashboardContentProps = {
    data: any;
    afterwordContent: string;
};

export default function DashboardContent({ data, afterwordContent }: DashboardContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const gsStats = data.stats.overall.find((s: any) => s.is_grandslam === true);
    const nonGsStats = data.stats.overall.find((s: any) => s.is_grandslam === false);
    const gsCount = gsStats?.post_run_rate_count || 0;
    const nonGsCount = nonGsStats?.post_run_rate_count || 0;
    const stages = ['Early (1-3)', 'Mid (4-6)', 'Late (7-9)'];

    return (
        <DashboardWrapper>
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
                            2018年〜2025年の <span className="text-cyan-400 font-bold">満塁ホームラン</span> と <span className="text-slate-300 font-bold">HR以外の得点追加 (4点以上)</span> の「その後」を徹底比較。
                        </div>
                    </header>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GS Card */}
                        <div className="group relative bg-[#1a0b02]/80 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 hover:bg-[#2a0f05]/90 transition-all duration-300 shadow-2xl overflow-hidden animate-fire animate-reveal stagger-1">
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
                                    <h2 className="text-xl text-slate-300 font-semibold">比較：HR以外の得点追加 (4点以上) 後</h2>
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
                                const gsSt = data.stats.by_stage.find((s: any) => s.stage === stageName && s.is_grandslam === true);
                                const nonGsSt = data.stats.by_stage.find((s: any) => s.stage === stageName && s.is_grandslam === false);
                                const gsRate9 = (gsSt?.post_run_rate_mean || 0) * 9;
                                const nonGsRate9 = (nonGsSt?.post_run_rate_mean || 0) * 9;
                                const maxVal = Math.max(gsRate9, nonGsRate9) * 1.2;
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
                                        </h4>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-cyan-400 font-bold">満塁ホームラン</span>
                                                    <span className="text-cyan-400 font-mono text-base">{gsRate9.toFixed(2)}</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-grow-x" style={{ width: `${gsRate9 / scale * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-300 font-semibold">HR以外の得点追加 (4点以上)</span>
                                                    <span className="text-slate-300 font-mono text-base">{nonGsRate9.toFixed(2)}</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-500 rounded-full animate-grow-x" style={{ width: `${nonGsRate9 / scale * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Timeline of Analysis Section (RESTORED) */}
                    <section className="space-y-8 animate-reveal">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                            <h3 className="text-2xl font-bold">検証データの詳細 (一部抜粋)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.events.slice(0, 12).map((event: any, idx: number) => (
                                <div key={idx} className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-xs font-mono text-slate-500">{event.date} @ {event.ballpark || 'Unknown'}</div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${event.is_grandslam ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {event.is_grandslam ? 'Grand Slam' : 'Big Inning'}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-white mb-2">{event.team}</div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <div>
                                            <span className="text-[10px] block uppercase tracking-tighter text-slate-500 mb-0.5">その後の得点</span>
                                            <span className="text-white font-bold text-base">{event.post_inning_runs_1to9}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] block uppercase tracking-tighter text-slate-500 mb-0.5">残イニング</span>
                                            <span className="text-slate-300 font-bold">{event.remaining_off_innings_1to9}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                <div className="my-10 bg-gradient-to-r from-emerald-900/30 to-slate-900/30 p-6 rounded-xl border-l-4 border-emerald-500">
                                    <h4 className="text-xl font-bold text-emerald-400 mt-0 mb-2">統計が示す結論</h4>
                                    <p className="mb-2 text-white font-bold text-2xl">「確率は下がる。だが、爆発力は上がる」</p>
                                </div>
                                <p className="text-center font-bold text-3xl text-white my-8">
                                    「再着火のサインを見逃すな！」
                                </p>

                                {/* Editorial Afterword CTA - Modified to Button */}
                                <div className="mt-16 pt-12 border-t border-white/10 text-center animate-reveal stagger-1">
                                    <p className="text-slate-400 mb-6 font-light italic">
                                        検証の結果から、私たちは何を感じ、何を学ぶべきか。
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-full hover:scale-105 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] group cursor-pointer"
                                    >
                                        編集後記：データが教える習慣化の秘訣
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Future Work / Deep Dive (RESTORED) */}
                                <div className="mt-20 pt-10 border-t border-white/10">
                                    <h4 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                                        今後の検証課題
                                    </h4>
                                    <ul className="space-y-4 text-slate-400 list-none p-0">
                                        <li className="flex gap-3">
                                            <span className="text-cyan-500 font-bold">・</span>
                                            <span>ビジター・ホームでの「勢い」の持続性の違い</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-cyan-500 font-bold">・</span>
                                            <span>失点した直後のイニングでの「取り返し」発生率</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-cyan-500 font-bold">・</span>
                                            <span>球場（ドーム・野外）による打撃モメンタムの影響</span>
                                        </li>
                                    </ul>
                                </div>
                            </article>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-12 text-center text-slate-600 text-sm border-t border-white/5 mt-12 bg-slate-950/20 backdrop-blur-sm">
                        <div className="flex justify-center gap-6 mb-4">
                            <button onClick={() => setIsModalOpen(true)} className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer">編集後記 (Afterword)</button>
                            <span className="text-slate-800">|</span>
                            <a href="https://github.com/nstsn/yakyu-GS" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors">Project Source</a>
                        </div>
                        <p>© 2026 NPB Grand Slam Analysis Project.</p>
                    </footer>
                </div>
            </div>

            <AfterwordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={afterwordContent} />
        </DashboardWrapper>
    );
}
