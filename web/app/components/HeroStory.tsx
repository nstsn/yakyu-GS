'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type HeroStoryProps = {
    onComplete: () => void;
};

export default function HeroStory({ onComplete }: HeroStoryProps) {
    const [step, setStep] = useState(1);
    const [mounted, setMounted] = useState(false);
    const lastScrollTime = useRef(0);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        // Auto-advance logic (only early steps)
        if (step === 1) {
            timer = setTimeout(() => setStep(2), 5000); // Step 1 -> 2 after 5s
        } else if (step === 2) {
            timer = setTimeout(() => setStep(3), 6000); // Step 2 -> 3 after 6s
        }

        return () => clearTimeout(timer);
    }, [step]);

    const advanceStep = useCallback(() => {
        const now = Date.now();
        console.log(`[HeroStory] advanceStep called. Step: ${step}, Global lastScroll: ${lastScrollTime.current}, Now: ${now}, Diff: ${now - lastScrollTime.current}`);

        if (now - lastScrollTime.current < 800) {
            console.log(`[HeroStory] advanceStep debounced.`);
            return;
        }

        if (step < 3) {
            console.log(`[HeroStory] moving from ${step} to ${step + 1}`);
            setStep((prev) => prev + 1);
            lastScrollTime.current = now;
        } else if (step === 3) {
            console.log(`[HeroStory] step 3 complete. calling onComplete.`);
            onComplete();
        }
    }, [step, onComplete]);

    // For manual debugging in console
    useEffect(() => {
        (window as any).advanceHeroStep = advanceStep;
        console.log("[HeroStory] mounted. current step:", step);
        return () => {
            delete (window as any).advanceHeroStep;
        };
    }, [advanceStep, step]);

    const regressStep = useCallback(() => {
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return; // Debounce

        if (step > 1) {
            setStep((prev) => prev - 1);
            lastScrollTime.current = now;
        }
    }, [step]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 20) {
                advanceStep();
            } else if (e.deltaY < -20) {
                regressStep();
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartY.current === null) return;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY.current - touchEndY;

            // Swipe up (Step Forward)
            if (deltaY > 50) {
                advanceStep();
            }
            // Swipe down (Step Backward)
            else if (deltaY < -50) {
                regressStep();
            }
            touchStartY.current = null;
        };

        window.addEventListener('wheel', handleWheel);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [advanceStep, regressStep]);

    // Click handler to advance immediately (up to step 3)
    const handleScreenClick = () => {
        advanceStep();
    };

    return (
        <section
            onClick={handleScreenClick}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white cursor-pointer select-none"
        >

            {/* Background Floating Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl px-6 text-center transition-all duration-1000 ease-in-out">

                {/* Step 1: Assumption */}
                <div className={`transition-all duration-1000 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${step === 1 ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-4 pointer-events-none invisible'}`}>
                    <div className="text-6xl mb-6 opacity-80 animate-bounce">?</div>
                    <h2 className="text-2xl md:text-3xl font-light leading-relaxed text-slate-300">
                        満塁ホームランで一気に4点。<br />
                        そこで安心して、<span className="text-white font-medium">攻撃の手が止まってしまうんじゃないか？</span>
                    </h2>
                    <p className="mt-8 text-slate-500 font-mono text-sm">私はそう仮説立てました。</p>
                    <div className="mt-12 flex flex-col items-center gap-2 opacity-40">
                        <p className="text-[10px] uppercase tracking-widest font-bold">Scroll or Swipe up to start</p>
                        <div className="w-px h-8 bg-gradient-to-b from-emerald-500 to-transparent animate-bounce"></div>
                    </div>
                </div>

                {/* Step 2: Inspection */}
                <div className={`transition-all duration-1000 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${step === 2 ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-10 pointer-events-none invisible'}`}>
                    <div className="flex justify-center gap-2 mb-8 opacity-60">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150" />
                        <div className="w-20 h-0.5 bg-slate-700 self-center" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-light leading-relaxed text-slate-300">
                        本当にそうなのか？<br />
                        実際のプロ野球データ（2018-2025）で、その<span className="text-cyan-400 font-medium border-b border-cyan-400/30 pb-1">「思い込み」</span>を確かめてみることにしました。
                    </h2>
                    <p className="mt-12 text-slate-500 text-sm italic opacity-40">Analyzing all games from 2018 to 2025...</p>
                </div>

                {/* Step 3: Discovery */}
                <div className={`transition-all duration-1000 ${step === 3 ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10 pointer-events-none invisible'}`}>
                    <div className="mb-6 flex justify-center">
                        <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs tracking-widest border border-emerald-500/20 uppercase font-bold">
                            Data Analysis
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                        <span className="text-slate-400 text-xl md:text-2xl block mb-4 font-normal">結果は、予想の逆でした。</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            満塁弾の後の方が、<br />打線の勢いは増す。
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-12 leading-relaxed">
                        追加得点が入る確率は53.3%と、通常（56.5%）よりわずかに下がります。<br />
                        しかし、<span className="text-white font-medium italic">「一度火がつくと止まらなくなる」</span>爆発力がそこにはありました。
                    </p>

                    <div className="relative inline-block group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onComplete();
                            }}
                            className="relative px-12 py-4 bg-slate-900 hover:bg-black text-white rounded-full transition-all border border-white/10 flex items-center gap-4 mx-auto cursor-pointer"
                        >
                            <span className="text-lg font-medium tracking-wide">データを詳しく見る</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            {/* Skip button (only for steps 1 & 2) */}
            {step < 3 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setStep(3);
                    }}
                    className="absolute bottom-12 text-slate-600 hover:text-slate-400 text-xs uppercase tracking-widest transition-colors cursor-pointer z-20 px-4 py-2"
                >
                    Skip Intro
                </button>
            )}
        </section>
    );
}
