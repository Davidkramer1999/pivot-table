import { useMemo, useRef } from 'react';
import { jspreadsheet, Spreadsheet, Worksheet } from '@jspreadsheet/react';
import type { PivotConfig } from './PivotControls';
import { generatePivotData } from '../utils/pivotHelpers';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';

interface PivotTableWorksheetProps {
    sourceData: (string | number)[][];
    config: PivotConfig;
}

export default function PivotTableWorksheet({ sourceData, config }: PivotTableWorksheetProps) {
    const spreadsheetRef = useRef<jspreadsheet.worksheetInstance[] | undefined>(undefined);

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
                <Spreadsheet ref={spreadsheetRef} tabs={false} toolbar={false}>
                    <Worksheet
                        data={pivotData.data}
                        columns={pivotData.columns}
                        minDimensions={[pivotData.columns.length, pivotData.data.length + 5]}
                        tableOverflow={true}
                    />
                </Spreadsheet>
            </div>
        </div>
    );
}
