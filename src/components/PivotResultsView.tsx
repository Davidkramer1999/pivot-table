import { useMemo, useRef } from 'react';
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react';
import type { PivotConfig } from './PivotConfigPanel';
import { generatePivotData } from '../utils/pivotHelpers';
import Header from './ui/header';

interface PivotResultsViewProps {
    sourceData: (string | number)[][];
    config: PivotConfig;
}

export default function PivotResultsView({ sourceData, config }: PivotResultsViewProps) {
    const spreadsheetRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);
    const pivotData = useMemo(() => {
        if (!sourceData || sourceData.length === 0) {
            return { data: [], columns: [] };
        }
        return generatePivotData(sourceData, config);
    }, [sourceData, config]);

    if (pivotData.data.length === 0) {
        return (
            <Header title="Pivot Table Worksheet" description="No data available for pivot table." />
        );
    }

    return (
        <div className="pivot-worksheet">
            <Header title="Pivot Table Worksheet" description="Aggregated data based on selected grouping and aggregation settings." />
            <div className="pivot-table-container">
                <Spreadsheet
                    ref={spreadsheetRef as React.RefObject<jspreadsheet.spreadsheetInstance>}
                    tabs={false}
                    toolbar={false}
                >
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

