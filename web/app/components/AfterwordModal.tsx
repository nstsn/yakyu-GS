'use client';

import { useEffect, useRef } from 'react';

type AfterwordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AfterwordModal({ isOpen, onClose }: AfterwordModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl max-h-[90vh] bg-[#fcfcfc] text-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out"
            >
                {/* Header/Close Button */}
                <div className="absolute top-6 right-8 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur rounded-full"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto px-6 py-16 md:px-12 md:py-24 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-2xl mx-auto space-y-16">

                        {/* Title Section */}
                        <header className="space-y-4 text-center">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Editorial Afterword</div>
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-950 leading-tight">
                                満塁ホームランの後、<br />なぜ得点が止まるのか？
                            </h2>
                            <p className="text-lg md:text-xl text-slate-500 font-light italic">
                                データが教える「成功後の罠」と習慣化の秘訣
                            </p>
                            <div className="flex justify-center items-center gap-4 pt-6">
                                <div className="w-12 h-px bg-slate-200"></div>
                                <div className="w-2 h-2 rounded-full border border-slate-300"></div>
                                <div className="w-12 h-px bg-slate-200"></div>
                            </div>
                        </header>

                        {/* Body Text */}
                        <article className="prose prose-slate prose-lg max-w-none text-slate-700 leading-[1.8] font-light">
                            <p className="first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-slate-900">
                                日本のプロ野球には、興味深いデータがあります。満塁ホームランを打った次の回以降、チームの得点率が一時的に下がるものの、ひとたび得点が入ると再び加点する傾向が強まるというのです。
                            </p>
                            <p>
                                一見すると矛盾したこの現象は、実はスポーツ心理学の視点から分析すると合理的に説明できます。そしてさらに興味深いことに、この原理は私たちの日常生活における習慣化のメカニズムとも深く関連しているのです。
                            </p>
                            <p>
                                今回は、野球のデータから出発し、その背後にある心理メカニズムを探り、最終的に私たちの生活における習慣化のヒントを導き出してみたいと思います。
                            </p>

                            <div className="my-16 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">1. データが示す不思議な現象</h3>
                            <p>
                                満塁ホームランを打った直後の回は、チーム全体の得点率が通常より低下する傾向が見られます。
                                しかし、ひとたび追加点が入ると、その後の得点確率は急激に上昇。
                                この「大量得点後の停滞」と「再加点の連鎖」は、選手の心理状態を紐解くと見えてくるものがあります。
                            </p>

                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 mt-12">2. 「満塁ホームラン後症候群」</h3>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 my-8">
                                <h4 className="text-slate-900 font-bold mb-4">心理的満足感による緊張の緩和</h4>
                                <p className="text-sm text-slate-600 italic mb-4">「これだけ点を取ったのだから、もう大丈夫だろう」</p>
                                <p className="text-sm leading-relaxed">
                                    圧倒的な成功体験は大きな達成感をもたらしますが、同時に「勝ちを守る」という守備的マインドへの無意識な移行を招き、攻撃時の集中力を削いでしまうことがあります。
                                </p>
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 mt-12">3. 習慣化の科学</h3>
                            <p>
                                「停滞後の最初の1点が、その後の流れを決める」。
                                これを習慣化に応用すると、大きな成功の直後こそ、あえて誇示できるものではないほど「小さな行動（最初の追加点）」を継続することが、最も重要な戦略となります。
                            </p>

                            <div className="bg-slate-900 text-white p-8 rounded-3xl mt-16 text-center shadow-xl">
                                <p className="m-0 font-serif text-xl italic leading-relaxed">
                                    「大きな成功」こそが、習慣化における最大の敵かもしれない。
                                </p>
                            </div>
                        </article>

                        {/* Footer */}
                        <footer className="pt-8 text-center">
                            <button
                                onClick={onClose}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 rounded-full font-bold text-sm hover:bg-slate-200 transition-all"
                            >
                                閉じて戻る
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
