import React from 'react';
import clsx from 'clsx';

/**
 * Loading Skeleton component
 */
export const Skeleton = ({ className = '', variant = 'rounded' }) => {
    const variants = {
        rounded: 'rounded-lg',
        circle: 'rounded-full',
        text: 'rounded h-4',
    };

    return (
        <div
            className={clsx(
                'animate-pulse bg-slate-200',
                variants[variant],
                className
            )}
        />
    );
};

/**
 * Card Skeleton
 */
export const CardSkeleton = () => {
    return (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-glass rounded-2xl p-6">
            <Skeleton className="h-12 w-12 mb-4" variant="circle" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
};

/**
 * List Skeleton
 */
export const ListSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl">
                    <Skeleton className="h-12 w-12" variant="circle" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Paragraph Skeleton (for summaries)
 */
export const ParagraphSkeleton = ({ lines = 3 }) => {
    return (
        <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={clsx(
                        'h-4',
                        i === lines - 1 ? 'w-2/3' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
};

export default Skeleton;
