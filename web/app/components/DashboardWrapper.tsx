'use client';

import { useState } from 'react';
import HeroStory from './HeroStory';

type DashboardWrapperProps = {
    children: React.ReactNode;
};

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
    const [showIntro, setShowIntro] = useState(true);

    if (showIntro) {
        return (
            <HeroStory
                onComplete={() => setShowIntro(false)}
            />
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            {children}
        </div>
    );
}
