'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

type AfterwordModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: string;
};

export default function AfterwordModal({ isOpen, onClose, content }: AfterwordModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

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

    // スクロールアニメーション
    useEffect(() => {
        if (!isOpen || !contentRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '100px 0px 100px 0px',
            }
        );

        // 見出し要素を文字単位でラップ
        const headings = contentRef.current.querySelectorAll('h3, h4');
        headings.forEach((heading) => {
            const text = heading.textContent || '';
            heading.innerHTML = '';

            // 絵文字を正しく分割するためにSegmenterを使用
            const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
            const segments = Array.from(segmenter.segment(text));

            segments.forEach((segment, index) => {
                const char = segment.segment;
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('opacity-0', 'translate-y-4', 'inline-block');
                span.style.animationDelay = `${index * 0.03}s`;
                heading.appendChild(span);
                observer.observe(span);
            });
        });

        // その他の要素は要素単位で監視
        const otherElements = contentRef.current.querySelectorAll('p, ul, li, div.border-t, strong, a');
        otherElements.forEach((el) => {
            el.classList.add('opacity-0', 'translate-y-4');
            observer.observe(el);
        });

        return () => {
            headings.forEach((heading) => {
                const spans = heading.querySelectorAll('span');
                spans.forEach((span) => observer.unobserve(span));
            });
            otherElements.forEach((el) => observer.unobserve(el));
        };
    }, [isOpen, content]);

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
                <div ref={contentRef} className="overflow-y-auto max-h-[calc(85vh-88px)] px-8 py-8 bg-slate-50">
                    <style jsx global>{`
                        @keyframes fadeInUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        .animate-fade-in-up {
                            animation: fadeInUp 0.6s ease-out forwards;
                        }
                    `}</style>
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
                                    <p className="text-slate-600 leading-relaxed mb-2 mt-4">{children}</p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-slate-800 font-bold">{children}</strong>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">{children}</ul>
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
