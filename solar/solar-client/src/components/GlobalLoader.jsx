import React, { useEffect, useState } from 'react';
import useLoaderStore from '../store/loaderStore';

const GlobalLoader = () => {
    const activeRequests = useLoaderStore((state) => state.activeRequests);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (activeRequests === 0) {
            setVisible(false);
            return;
        }

        const timer = window.setTimeout(() => setVisible(true), 350);
        return () => window.clearTimeout(timer);
    }, [activeRequests]);

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-1 bg-transparent">
            <div className="h-full w-1/2 animate-pulse rounded-r-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30" />
            <div className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                Processing...
            </div>
        </div>
    );
};

export default GlobalLoader;
