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
        const newConfig = { ...config, [field]: value };
        
        if (field === 'groupBy1' && value === config.groupBy2) {
            newConfig.groupBy2 = GROUP_OPTIONS.find(opt => opt.value !== value)?.value || GROUP_OPTIONS[0].value;
        }
        
        if (field === 'groupBy2' && value === config.groupBy1) {
            newConfig.groupBy2 = GROUP_OPTIONS.find(opt => opt.value !== config.groupBy1)?.value || GROUP_OPTIONS[0].value;
        }
        
        onConfigChange(newConfig);
    };

    // Secondary options should exclude the primary selection
    const secondaryOptions = GROUP_OPTIONS.filter(opt => opt.value !== config.groupBy1);

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
                    options={secondaryOptions}
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

