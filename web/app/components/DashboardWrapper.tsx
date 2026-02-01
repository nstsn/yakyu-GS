'use client';

import { useState, useCallback, useEffect } from 'react';
import HeroStory from './HeroStory';

type DashboardWrapperProps = {
    children: React.ReactNode;
};

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
    const [showIntro, setShowIntro] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const completeIntro = useCallback(() => {
        console.log("[DashboardWrapper] completeIntro called");
        setShowIntro(false);
    }, []);

    const setupObserver = (node: HTMLDivElement) => {
        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('animate-reveal')) {
                        entry.target.classList.add('reveal-active');
                    }
                    if (entry.target.classList.contains('animate-grow-x')) {
                        entry.target.classList.add('grow-active');
                    }
                    // Once animated, we can stop observing
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const targets = node.querySelectorAll('.animate-reveal, .animate-grow-x');
        targets.forEach(t => observer.observe(t));
    };

    if (showIntro) {
        return (
            <HeroStory
                onComplete={completeIntro}
            />
        );
    }

    return (
        <div className="animate-in fade-in duration-700" ref={setupObserver}>
            {children}
        </div>
    );
}
