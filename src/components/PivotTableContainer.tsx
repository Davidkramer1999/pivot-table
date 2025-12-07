import { useState, useCallback } from 'react';
import type { PivotConfig } from './PivotConfigPanel';
import { sampleData } from '../data/sampleData';
import SourceDataEditor from './SourceDataEditor';
import PivotConfigPanel from './PivotConfigPanel';
import PivotResultsView from './PivotResultsView';

/**
 * PivotTableContainer - Main container component that manages all state and data flow
 * This component handles the coordination between source data editor and pivot results view
 */
export default function PivotTableContainer() {
    const [currentData, setCurrentData] = useState<(string | number)[][]>(sampleData);
    const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
        groupBy1: 'Category',
        groupBy2: 'Subcategory',
        aggregateColumn: 'Sales',
    });

    // Handle data changes from the source data editor
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
                <PivotConfigPanel onConfigChange={handleConfigChange} />
            </section>

            <div className="worksheets-container">
                <SourceDataEditor onDataChange={handleDataChange} />
                <PivotResultsView sourceData={currentData} config={pivotConfig} />
            </div>
        </div>
    );
}

