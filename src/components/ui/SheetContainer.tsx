import type { ReactNode } from 'react';

interface HeaderProps {
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
}

export default function Header({
    title,
    description,
    children,
    className = '',
}: HeaderProps) {
    return (
        <div className={`header ${className}`}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="header-content">
                {children}
            </div>
        </div>
    );
}
