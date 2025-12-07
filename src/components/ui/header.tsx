interface HeaderProps {
    title: string;
    description: string;
    className?: string;
}

export default function Header({
    title,
    description,
    className = '',
}: HeaderProps) {
    return (
        <div className={`header ${className}`}>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}
