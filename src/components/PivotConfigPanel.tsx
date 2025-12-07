import Select from './ui/select';

export interface PivotConfig {
    groupBy1: string;
    groupBy2: string;
    aggregateColumn: string;
}

interface PivotConfigPanelProps {
    config: PivotConfig;
    onConfigChange: (config: PivotConfig) => void;
}
const GROUP_OPTIONS = [
    { value: 'Category', label: 'Category' },
    { value: 'Subcategory', label: 'Subcategory' },
    { value: 'Region', label: 'Region' },
];

const AGGREGATE_OPTIONS = [
    { value: 'Sales', label: 'Sales (Sum)' },
];

export default function PivotConfigPanel({ config, onConfigChange }: PivotConfigPanelProps) {

    const handleConfigFieldChange = (field: keyof PivotConfig, value: string) => {
        onConfigChange({ ...config, [field]: value });
    };

    return (
        <div className="pivot-controls">
            <h3>Pivot Table Configuration</h3>
            <div className="control-group">
                <Select
                    label="Group By (Primary)"
                    value={config.groupBy1}
                    onChange={(value) => handleConfigFieldChange('groupBy1', value)}
                    options={GROUP_OPTIONS}
                />
                <Select
                    label="Group By (Secondary)"
                    value={config.groupBy2}
                    onChange={(value) => handleConfigFieldChange('groupBy2', value)}
                    options={GROUP_OPTIONS}
                />
                <Select
                    label="Aggregate Column"
                    value={config.aggregateColumn}
                    onChange={(value) => handleConfigFieldChange('aggregateColumn', value)}
                    options={AGGREGATE_OPTIONS}
                />
            </div>
        </div>
    );
}

