import { useMemo, useRef } from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import type { PivotConfig } from './PivotControls';
import { generatePivotData } from '../utils/pivotHelpers';
import SheetContainer from './ui/SheetContainer';
import SpreadsheetView from './ui/SpreadsheetView';

interface PivotTableWorksheetProps {
    sourceData: (string | number)[][];
    config: PivotConfig;
}

export default function PivotTableWorksheet({ sourceData, config }: PivotTableWorksheetProps) {
    const spreadsheetRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);

    // Generate pivot table data whenever sourceData or config changes
    const pivotData = useMemo(() => {
        if (!sourceData || sourceData.length === 0) {
            return { data: [], columns: [] };
        }
        return generatePivotData(sourceData, config);
    }, [sourceData, config]);

    if (pivotData.data.length === 0) {
        return (
            <SheetContainer
                title="Pivot Table Worksheet"
                description="No data available for pivot table."
                className="pivot-worksheet"
            >
                {null}
            </SheetContainer>
        );
    }

    return (
        <SheetContainer
            title="Pivot Table Worksheet"
            description="Aggregated data based on selected grouping and aggregation settings."
            className="pivot-worksheet"
        >
            <SpreadsheetView
                containerClassName="pivot-table-container"
                spreadsheetRef={spreadsheetRef}
                tabs={false}
                toolbar={false}
                data={pivotData.data}
                columns={pivotData.columns}
                minDimensions={[pivotData.columns.length, pivotData.data.length + 5]}
                tableOverflow={true}
            />
        </SheetContainer>
    );
}
