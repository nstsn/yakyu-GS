'use client';

import { useState } from 'react';
import AfterwordModal from './AfterwordModal';

type DashboardContentProps = {
    children: React.ReactNode;
    afterwordContent: string;
};

export default function DashboardContent({ children, afterwordContent }: DashboardContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {children}

            {/* Footer (Simplified for injection) */}
            <footer className="py-12 text-center text-slate-600 text-sm border-t border-white/5 mt-12 bg-slate-950/20 backdrop-blur-sm">
                <div className="flex justify-center gap-6 mb-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                        編集後記 (Afterword)
                    </button>
                    <span className="text-slate-800">|</span>
                    <a
                        href="https://github.com/nstsn/yakyu-GS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        Project Source
                    </a>
                </div>
                <p>© 2026 NPB Grand Slam Analysis Project.</p>
            </footer>

            <AfterwordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                content={afterwordContent}
            />
        </>
    );
}
