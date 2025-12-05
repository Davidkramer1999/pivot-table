import type { ChangeEvent } from 'react';

type SelectOption = {
    label: string;
    value: string;
};

interface SelectProps {
    label?: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Lightweight select component to keep form markup consistent.
 */
export default function Select({
    label,
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    className = '',
}: SelectProps) {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <label className={`select-field ${className}`.trim()}>
            {label && <span className="select-label">{label}</span>}
            <select value={value} onChange={handleChange}>
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
