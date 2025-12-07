import { useState, useCallback } from 'react';
import type { PivotConfig } from './PivotConfigPanel';
import PivotConfigPanel from './PivotConfigPanel';
import FormulaBasedPivotTable from './FormulaBasedPivotTable';
 
/**
 * PivotTableContainer - Main container with formula-based pivot table
 * Parent manages pivot configuration and generates pivot data
 */
export default function PivotTableContainer() {
    const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
        groupBy1: 'Category',
        groupBy2: 'Subcategory',
        aggregateColumn: 'Sales',
    });

    const handleConfigChange = useCallback((config: PivotConfig) => {
        setPivotConfig(config);
    }, [])
 

    return (
        <div className="pivot-table-app">
            <section className="controls-section">
                <PivotConfigPanel config={pivotConfig} onConfigChange={handleConfigChange} />
                <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    Changes will update Sheet2 automatically
                </p>
            </section>

            <div className="worksheets-container">
                <FormulaBasedPivotTable 
                    pivotConfig={pivotConfig}
                />
            </div>
        </div>
    );
}
