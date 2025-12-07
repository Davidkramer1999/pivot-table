import { useState, useCallback } from 'react';
import type { PivotConfig } from './PivotControls';
import { sampleData } from '../data/sampleData';
import DataWorksheet from './DataWorksheet';
import PivotControls from './PivotControls';
import PivotTableWorksheet from './PivotTableWorksheet';

/**
 * Main container component that manages all state and data flow
 * This component handles the coordination between data worksheet and pivot table
 */
export default function PivotTableApp() {
    const [currentData, setCurrentData] = useState<(string | number)[][]>(sampleData);
    const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
        groupBy1: 'Category',
        groupBy2: 'Subcategory',
        aggregateColumn: 'Sales',
    });

    // Handle data changes from the data worksheet
    const handleDataChange = useCallback((data: (string | number)[][]) => {
        setCurrentData(data);
    }, []);

    // Handle pivot configuration changes
    const handleConfigChange = useCallback((config: PivotConfig) => {
        setPivotConfig(config);
    }, []);

    return (
        <div className="pivot-table-app">
            <section className="controls-section">
                <PivotControls onConfigChange={handleConfigChange} />
            </section>

            <div className="worksheets-container">
                <DataWorksheet onDataChange={handleDataChange} />
                <PivotTableWorksheet sourceData={currentData} config={pivotConfig} key={JSON.stringify(pivotConfig)} />
            </div>
        </div>
    );
}

