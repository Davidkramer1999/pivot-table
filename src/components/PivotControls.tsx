import { useMemo, useState } from 'react';
import Select from './ui/select';

export interface PivotConfig {
    groupBy1: string;
    groupBy2: string;
    aggregateColumn: string;
}

interface PivotControlsProps {
    onConfigChange: (config: PivotConfig) => void;
}

export default function PivotControls({ onConfigChange }: PivotControlsProps) {
    const [groupBy1, setGroupBy1] = useState('Category');
    const [groupBy2, setGroupBy2] = useState('Subcategory');
    const [aggregateColumn, setAggregateColumn] = useState('Sales');

    const groupOptions = useMemo(
        () => [
            { value: 'Category', label: 'Category' },
            { value: 'Subcategory', label: 'Subcategory' },
            { value: 'Region', label: 'Region' },
        ],
        []
    );

    const aggregateOptions = useMemo(
        () => [{ value: 'Sales', label: 'Sales (Sum)' }],
        []
    );

    const handleUpdate = () => {
        onConfigChange({
            groupBy1,
            groupBy2,
            aggregateColumn,
        });
    };

    return (
        <div className="pivot-controls">
            <h3>Pivot Table Configuration</h3>
            <div className="control-group">
                <Select
                    label="Group By (Primary)"
                    value={groupBy1}
                    onChange={setGroupBy1}
                    options={groupOptions}
                />
                <Select
                    label="Group By (Secondary)"
                    value={groupBy2}
                    onChange={setGroupBy2}
                    options={groupOptions}
                />
                <Select
                    label="Aggregate Column"
                    value={aggregateColumn}
                    onChange={setAggregateColumn}
                    options={aggregateOptions}
                />
                <button onClick={handleUpdate}>Update Pivot Table</button>
            </div>
        </div>
    );
}
