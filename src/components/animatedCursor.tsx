'use client'; // indicates Client Component

// Import with next's dynamic import
import dynamic from 'next/dynamic';

export const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
    ssr: false,
});

