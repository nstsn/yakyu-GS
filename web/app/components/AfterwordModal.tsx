'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

type AfterwordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: string;
};

export default function AfterwordModal({ isOpen, onClose, content }: AfterwordModalProps) {
    // ESCキーでモーダルを閉じる
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // モーダルが開いている時はスクロールを無効化
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-3xl max-h-[85vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
                style={{ fontFamily: '"Noto Sans JP", sans-serif', fontFeatureSettings: '"palt"' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-800">📝 編集後記</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 hover:text-slate-800"
                            aria-label="閉じる"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-88px)] px-8 py-8 bg-slate-50">
                    <article className="prose prose-slate max-w-none">
                        <ReactMarkdown
                            components={{
                                h2: ({ children }) => (
                                    <h3 className="text-xl font-bold text-slate-700 mb-4 mt-8 first:mt-0">{children}</h3>
                                ),
                                h3: ({ children }) => (
                                    <h4 className="text-lg font-semibold text-slate-600 mb-3 mt-6">{children}</h4>
                                ),
                                p: ({ children }) => (
                                    <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-slate-800 font-bold">{children}</strong>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">{children}</ul>
                                ),
                                li: ({ children }) => (
                                    <li className="text-slate-600">{children}</li>
                                ),
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 transition-colors underline">
                                        {children}
                                    </a>
                                ),
                                hr: () => (
                                    <div className="border-t border-slate-200 my-8" />
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
}
