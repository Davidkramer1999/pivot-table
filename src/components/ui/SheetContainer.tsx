import type { ReactNode } from 'react';

interface SheetContainerProps {
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
}

export default function SheetContainer({
    title,
    description,
    children,
    className = '',
}: SheetContainerProps) {
    return (
        <div className={`sheet-container ${className}`}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="sheet-content">
                {children}
            </div>
        </div>
    );
}
