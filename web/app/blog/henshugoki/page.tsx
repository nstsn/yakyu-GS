import Link from 'next/link';
import DashboardWrapper from '../../components/DashboardWrapper';

export default function HenshugokiPage() {
    return (
        <main className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500/30">
            <DashboardWrapper skipIntro={true}>
                <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 relative z-10 min-h-screen">

                    {/* Navigation */}
                    <nav className="fixed top-0 left-0 right-0 z-50 p-6 backdrop-blur-md bg-slate-950/30 border-b border-white/5">
                        <div className="max-w-4xl mx-auto flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/5">
                                Editorial Afterword
                            </div>
                        </div>
                    </nav>

                    <div className="max-w-4xl mx-auto px-6 pt-32 pb-32 space-y-24">

                        {/* Hero Section */}
                        <header className="space-y-6 text-center animate-reveal">
                            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 leading-tight">
                                満塁ホームランの後、<br />なぜ得点が止まるのか？
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 font-light italic">
                                ――データが教える「成功後の罠」と習慣化の秘訣
                            </p>
                            <div className="flex justify-center items-center gap-4 pt-4">
                                <div className="w-12 h-px bg-slate-800"></div>
                                <span className="text-slate-500 text-xs uppercase tracking-[0.3em]">Editorial Report</span>
                                <div className="w-12 h-px bg-slate-800"></div>
                            </div>
                        </header>

                        {/* Introduction */}
                        <section className="animate-reveal stagger-1 prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                            <p>
                                日本のプロ野球には、興味深いデータがあります。満塁ホームランを打った次の回以降、チームの得点率が一時的に下がるものの、ひとたび得点が入ると再び加点する傾向が強まるというのです。
                            </p>
                            <p>
                                一見すると矛盾したこの現象は、実はスポーツ心理学の視点から分析すると合理的に説明できます。そしてさらに興味深いことに、この原理は私たちの日常生活における習慣化のメカニズムとも深く関連しているのです。
                            </p>
                            <p>
                                今回は、野球のデータから出発し、その背後にある心理メカニズムを探り、最終的に私たちの生活における習慣化のヒントを導き出してみたいと思います。
                            </p>
                        </section>

                        <hr className="border-white/5" />

                        {/* Chapter 1 */}
                        <section className="animate-reveal stagger-2">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-5xl font-black text-slate-800">01</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">データが示す不思議な現象</h2>
                                    <p className="text-sm text-slate-500 uppercase tracking-widest">Mysterious Pattern</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-colors">
                                    <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                        直後の停滞
                                    </h3>
                                    <ul className="space-y-3 text-slate-300 text-sm">
                                        <li>・得点率（得点/回）が通常より低下</li>
                                        <li>・打者の積極性がやや減少</li>
                                        <li>・攻撃リズムの一時的な鈍化</li>
                                    </ul>
                                </div>
                                <div className="bg-orange-500/5 p-8 rounded-3xl border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                                    <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></span>
                                        再加点の爆発
                                    </h3>
                                    <ul className="space-y-3 text-slate-300 text-sm">
                                        <li>・ひとたび得点が入ると確率急上昇</li>
                                        <li>・連続得点の可能性が高まる</li>
                                        <li>・試合全体の得点ペースが加速</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Chapter 2 */}
                        <section className="animate-reveal stagger-3">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-5xl font-black text-slate-800">02</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">「満塁ホームラン後症候群」</h2>
                                    <p className="text-sm text-slate-500 uppercase tracking-widest">Psychological Mechanism</p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-8">
                                <div className="bg-slate-800/30 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white mt-0">心理的満足感による緊張の緩和</h4>
                                    <p>
                                        満塁ホームランは一打で4点という大量得点をもたらします。この圧倒的な成功体験は、チーム全体に大きな達成感と安心感を生み出します。
                                    </p>
                                    <blockquote className="border-emerald-500/50 text-slate-400 italic">
                                        「これだけ点を取ったのだから、もう大丈夫だろう」
                                    </blockquote>
                                    <p>
                                        この無意識の心理が、集中力のわずかな低下や「守備的マインド」への移行を招きます。
                                    </p>
                                </div>

                                <div className="bg-cyan-500/5 p-8 rounded-3xl border border-cyan-500/10">
                                    <h4 className="text-white mt-0">心理的ブレイクスルー効果</h4>
                                    <p>
                                        逆に、停滞していた攻撃に再び得点が生まれると、チーム全体に「やはり自分たちは得点できる」という自己効力感の回復が起こります。
                                    </p>
                                    <p>
                                        最初の1点は、いわば<strong>「氷を溶かす」</strong>役割を果たし、選手たちの攻撃的マインドセットを復活させるのです。
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Chapter 3 - Abstract */}
                        <section className="animate-reveal stagger-4 bg-gradient-to-br from-indigo-900/20 to-slate-900/20 p-10 md:p-16 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-12">
                                    <span className="text-5xl font-black text-indigo-800">03</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">人生における「満塁ホームラン」</h2>
                                        <p className="text-sm text-slate-500 uppercase tracking-widest">Abstraction & Life</p>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center space-y-2">
                                            <div className="h-16 w-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                                <span className="text-3xl">🏆</span>
                                            </div>
                                            <h4 className="font-bold text-emerald-400 text-sm">大きな成功</h4>
                                            <p className="text-[10px] text-slate-500 leading-relaxed italic">目標達成、合格、大型契約</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                                <span className="text-3xl">💤</span>
                                            </div>
                                            <h4 className="font-bold text-slate-400 text-sm">その後の停滞</h4>
                                            <p className="text-[10px] text-slate-500 leading-relaxed italic">満足感による緊張感の緩和</p>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <div className="h-16 w-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                                                <span className="text-3xl">⚡</span>
                                            </div>
                                            <h4 className="font-bold text-orange-400 text-sm">再加点の好循環</h4>
                                            <p className="text-[10px] text-slate-500 leading-relaxed italic">小さな一歩が自信を再構築</p>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 prose prose-invert prose-sm">
                                        <h4 className="text-white mt-0 border-b border-white/5 pb-2">共通する心理サイクル</h4>
                                        <p className="font-bold text-center text-lg md:text-xl py-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-orange-400 uppercase tracking-tighter">
                                            大きな成功 → 心理的満足 → 行動の停滞 → 小さな再開 → 自己効力感の回復 → 行動の加速
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Chapter 4 - Science of Habit */}
                        <section className="animate-reveal stagger-5">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-5xl font-black text-slate-800">04</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">「最初の追加点」戦略</h2>
                                    <p className="text-sm text-slate-500 uppercase tracking-widest">Habit Science</p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-12">
                                <p>
                                    野球のデータが教えてくれる最も重要な教訓は、<strong>「停滞後の最初の1点が、その後の流れを決める」</strong>ということです。
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                                    <div className="group bg-slate-800/40 p-6 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-all">
                                        <span className="text-xs font-black text-emerald-500 mb-2 block uppercase tracking-tighter">Strategy 01</span>
                                        <h5 className="text-white font-bold mb-3">意図的な最小行動</h5>
                                        <p className="text-slate-400 text-xs leading-relaxed">目標達成の翌日こそが重要です。「もう十分」という心の声に抗い、あえて小さすぎるくらいの行動を続けます。</p>
                                    </div>
                                    <div className="group bg-slate-800/40 p-6 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-all">
                                        <span className="text-xs font-black text-cyan-500 mb-2 block uppercase tracking-tighter">Strategy 02</span>
                                        <h5 className="text-white font-bold mb-3">ゴールを「線」で描く</h5>
                                        <p className="text-slate-400 text-xs leading-relaxed">「10キロ痩せる」という点ではなく、「健康的な食生活を続ける人である」というプロセス（アイデンティティ）として再定義します。</p>
                                    </div>
                                </div>

                                <div className="bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/20 text-center">
                                    <p className="text-emerald-400 font-bold text-xl md:text-2xl m-0 leading-tight">
                                        「大きな成功」こそが、習慣化における最大の敵かもしれない。
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Final Action Section */}
                        <section className="animate-reveal stagger-5 bg-gradient-to-t from-slate-900 to-slate-800/50 p-10 md:p-16 rounded-[4rem] border border-white/10 text-center">
                            <h2 className="text-3xl font-bold mb-12">あなたの「最初の1点」を確実に。</h2>

                            <div className="max-w-xl mx-auto space-y-8 text-left mb-16">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center text-xs font-bold text-emerald-400">1</div>
                                    <p className="text-slate-300 text-sm pt-1">最近の「満塁ホームラン（成功）」を特定し、停滞の予兆を自覚する。</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex-shrink-0 flex items-center justify-center text-xs font-bold text-cyan-400">2</div>
                                    <p className="text-slate-300 text-sm pt-1">達成の翌日に行う「小さすぎる最小行動」を今この瞬間に決めておく。</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex-shrink-0 flex items-center justify-center text-xs font-bold text-orange-400">3</div>
                                    <p className="text-slate-300 text-sm pt-1">記録をつけて、小さな成功の連鎖を視覚化する。</p>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group"
                            >
                                ダッシュボードに戻る
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </section>

                        {/* Footer Article Meta */}
                        <footer className="pt-20 border-t border-white/5 text-center space-y-4">
                            <p className="text-slate-500 text-xs tracking-widest uppercase">NPB Grand Slam Analysis Project / Henshugoki</p>
                            <p className="text-slate-600 text-[10px] italic">Writing and Analysis by the team. Based on various sports psychology theories and NPB data 2018-2025.</p>
                        </footer>

                    </div>
                </div>
            </DashboardWrapper>
        </main>
    );
}
