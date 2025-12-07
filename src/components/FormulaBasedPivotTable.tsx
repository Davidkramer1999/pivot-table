import { useRef, useCallback, useMemo, useEffect } from 'react';
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import Header from './ui/header';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';
import type { PivotConfig } from './PivotConfigPanel';
import { JSPREADSHEET_LICENSE_KEY } from '../config/jspreadsheet.config';
import { generatePivotData } from '../utils/pivotHelpers';

jspreadsheet.setLicense(JSPREADSHEET_LICENSE_KEY);

const SHEET1_DATA = sampleData;
const SHEET1_COLUMNS = columnHeaders;
const SHEET1_MIN_DIMENSIONS: [number, number] = [4, 25];

interface FormulaBasedPivotTableProps {
    pivotConfig: PivotConfig;
}

export default function FormulaBasedPivotTable({ pivotConfig }: FormulaBasedPivotTableProps) {
    const spreadsheet = useRef<jspreadsheet.worksheetInstance[] | undefined>(undefined);

    const { data: pivotData, columns: pivotColumnsRaw } = useMemo(
        () => generatePivotData(SHEET1_DATA, SHEET1_COLUMNS, pivotConfig, 'Sheet1'),
        [pivotConfig]
    );

    const pivotColumns = useMemo(
        () => pivotColumnsRaw.map(col => ({ ...col, type: 'text' as const })),
        [pivotColumnsRaw]
    );

    useEffect(() => {
        if (!spreadsheet.current || spreadsheet.current.length < 2) return;

        const sheet2 = spreadsheet.current[1] as any;
        if (sheet2.setData) sheet2.setData(pivotData);
        if (sheet2.setColumns) sheet2.setColumns(pivotColumns);
    }, [pivotData, pivotColumns]);

    const onload = useCallback((_instance: jspreadsheet.spreadsheetInstance) => {
        // Spreadsheet loaded
    }, []);

    return (
        <div className="data-worksheet">
            <Header 
                title="Data & Pivot Worksheets" 
                description="Sheet1 has source data. Sheet2 will show pivot results." 
            />
            <div className="data-table-container">
                <Spreadsheet
                    ref={spreadsheet}
                    tabs={true}
                    toolbar={true}
                    onload={onload}
                >
                    <Worksheet
                        name="Sheet1"
                        data={SHEET1_DATA}
                        columns={SHEET1_COLUMNS}
                        minDimensions={SHEET1_MIN_DIMENSIONS}
                        tableOverflow={true}
                    />
                    <Worksheet
                        name="Sheet2"
                        data={pivotData}
                        columns={pivotColumns}
                        minDimensions={[3, pivotData.length || 1]}
                        tableOverflow={true}
                    />
                </Spreadsheet>
            </div>
        </div>
    );
}
