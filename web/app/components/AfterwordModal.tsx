'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

type AfterwordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: string;
};

export default function AfterwordModal({ isOpen, onClose, content }: AfterwordModalProps) {
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
                {/* Close Button */}
                <div className="absolute top-6 right-8 z-20">
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur rounded-full cursor-pointer"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto px-6 py-16 md:px-12 md:py-24 scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-2xl mx-auto">
                        <article className="prose prose-slate lg:prose-xl prose-headings:font-serif prose-headings:font-black prose-headings:text-slate-950 prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:font-light prose-strong:text-slate-900 prose-blockquote:border-slate-300 prose-blockquote:text-slate-500 prose-blockquote:italic selection:bg-cyan-100">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </article>

                        {/* Footer inside Modal */}
                        <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
                            <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-8">End of Editorial Afterword</div>
                            <button
                                onClick={onClose}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg cursor-pointer"
                            >
                                ダッシュボードに戻る
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
