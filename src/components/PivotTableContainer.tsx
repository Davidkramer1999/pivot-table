import { useState, useCallback } from 'react';
import type { PivotConfig } from './PivotConfigPanel';
import { sampleData } from '../data/sampleData';
import SourceDataEditor from './SourceDataEditor';
import PivotConfigPanel from './PivotConfigPanel';
import PivotResultsView from './PivotResultsView';

export default function PivotTableContainer() {
    const [currentData, setCurrentData] = useState<(string | number)[][]>(sampleData);
    const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
        groupBy1: 'Category',
        groupBy2: 'Subcategory',
        aggregateColumn: 'Sales',
    });

    const handleDataChange = useCallback((data: (string | number)[][]) => {
        setCurrentData(data);
    }, []);

    const handleConfigChange = useCallback((config: PivotConfig) => {
        setPivotConfig(config);
    }, []);

    return (
        <div className="pivot-table-app">
            <section className="controls-section">
                <PivotConfigPanel config={pivotConfig} onConfigChange={handleConfigChange} />
            </section>

            <div className="worksheets-container">
                <SourceDataEditor onDataChange={handleDataChange} />
                <PivotResultsView sourceData={currentData} config={pivotConfig} key={JSON.stringify(pivotConfig)} />
            </div>
        </div>
    );
}

