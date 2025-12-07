import { useMemo } from 'react';
import type { PivotConfig } from './PivotControls';
import { generatePivotData } from '../utils/pivotHelpers';
import SpreadsheetComponent from './ui/SpreadsheetComponent';
import WorksheetComponent from './ui/WorksheetComponent';

interface PivotTableWorksheetProps {
    sourceData: (string | number)[][];
    config: PivotConfig;
}

/**
 * PivotTableWorksheet component - purely presentational
 * Receives data and config as props and displays the pivot table
 */
export default function PivotTableWorksheet({ sourceData, config }: PivotTableWorksheetProps) {
    // Generate pivot table data whenever sourceData or config changes
    const pivotData = useMemo(() => {
        if (!sourceData || sourceData.length === 0) {
            return { data: [], columns: [] };
        }
        return generatePivotData(sourceData, config);
    }, [sourceData, config]);

    if (pivotData.data.length === 0) {
        return (
            <div className="pivot-worksheet">
                <h2>Pivot Table Worksheet</h2>
                <p>No data available for pivot table.</p>
            </div>
        );
    }

    return (
        <div className="pivot-worksheet">
            <h2>Pivot Table Worksheet</h2>
            <p>Aggregated data based on selected grouping and aggregation settings.</p>
            <div className="pivot-table-container">
                <SpreadsheetComponent tabs={false} toolbar={false}>
                    <WorksheetComponent
                        data={pivotData.data}
                        columns={pivotData.columns}
                        minDimensions={[pivotData.columns.length, pivotData.data.length + 5]}
                        tableOverflow={true}
                    />
                </SpreadsheetComponent>
            </div>
        </div>
    );
}
