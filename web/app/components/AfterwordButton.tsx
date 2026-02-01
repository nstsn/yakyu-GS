'use client';

import { useState } from 'react';
import AfterwordModal from './AfterwordModal';

type AfterwordButtonProps = {
    content: string;
};

export default function AfterwordButton({ content }: AfterwordButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex justify-center py-16">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

                    {/* Button content */}
                    <span className="relative flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        📝 編集後記を読む
                    </span>
                </button>
            </div>

            <AfterwordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={content} />
        </>
    );
}
