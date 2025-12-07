import { useMemo } from 'react';
import type { PivotConfig } from './PivotConfigPanel';
import { generatePivotData } from '../utils/pivotHelpers';
import JSpreadsheetWrapper from './ui/JSpreadsheetWrapper';
import JWorksheetWrapper from './ui/JWorksheetWrapper';

interface PivotResultsViewProps {
    sourceData: (string | number)[][];
    config: PivotConfig;
}

/**
 * PivotResultsView component - purely presentational
 * Receives data and config as props and displays the pivot table results
 */
export default function PivotResultsView({ sourceData, config }: PivotResultsViewProps) {
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
                <JSpreadsheetWrapper tabs={false} toolbar={false}>
                    <JWorksheetWrapper
                        data={pivotData.data}
                        columns={pivotData.columns}
                        minDimensions={[pivotData.columns.length, pivotData.data.length + 5]}
                        tableOverflow={true}
                    />
                </JSpreadsheetWrapper>
            </div>
        </div>
    );
}

