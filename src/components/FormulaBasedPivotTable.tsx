import { useRef, useCallback, useEffect, useMemo } from 'react';
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import Header from './ui/header';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';
import type { PivotConfig } from './PivotConfigPanel';
import formula from "@jspreadsheet/formula-pro";

// IMPORTANT: License must be set BEFORE extensions (order matters!)
jspreadsheet.setLicense('YTc5YmFhMTNhNmYyNTZiY2U3MjM2MjhlN2FmMDc1ZDBiNjU5MTc2MTJjMmZkNGI4ZTg4MDkwZGNmMzRjZjU2MGM2ZmNjNzljYjEzZGIzYzE3Y2RhNmNiNWIzYzc5OTI0NzZkM2IzNjI0OGJjMWZhNmIzMGJhMjY2NzRmZDA3MjgsZXlKamJHbGxiblJKWkNJNklpSXNJbTVoYldVaU9pSktjM0J5WldGa2MyaGxaWFFpTENKa1lYUmxJam94TnpZMU1Ua3lNVFF4TENKa2IyMWhhVzRpT2xzaWFuTndjbVZoWkhOb1pXVjBMbU52YlNJc0ltTnZaR1Z6WVc1a1ltOTRMbWx2SWl3aWFuTm9aV3hzTG01bGRDSXNJbU56WWk1aGNIQWlMQ0p6ZEdGamEySnNhWFI2TG1sdklpd2lkMlZpWTI5dWRHRnBibVZ5TG1sdklpd2liRzlqWVd4b2IzTjBJbDBzSW5Cc1lXNGlPaUl6TkNJc0luTmpiM0JsSWpwYkluWTNJaXdpZGpnaUxDSjJPU0lzSW5ZeE1DSXNJbll4TVNJc0luWXhNaUlzSW1Ob1lYSjBjeUlzSW1admNtMXpJaXdpWm05eWJYVnNZU0lzSW5CaGNuTmxjaUlzSW5KbGJtUmxjaUlzSW1OdmJXMWxiblJ6SWl3aWFXMXdiM0owWlhJaUxDSmlZWElpTENKMllXeHBaR0YwYVc5dWN5SXNJbk5sWVhKamFDSXNJbkJ5YVc1MElpd2ljMmhsWlhSeklpd2lZMnhwWlc1MElpd2ljMlZ5ZG1WeUlpd2ljMmhoY0dWeklpd2labTl5YldGMElsMHNJbVJsYlc4aU9uUnlkV1Y5');
jspreadsheet.setExtensions({ formula });
// Simple static data for Sheet1
const SHEET1_DATA = sampleData;
const SHEET1_COLUMNS = columnHeaders;
const SHEET1_MIN_DIMENSIONS: [number, number] = [4, 25];


interface FormulaBasedPivotTableProps {
    pivotConfig: PivotConfig;
}

export default function FormulaBasedPivotTable({ pivotConfig }: FormulaBasedPivotTableProps) {
    // Use the same ref pattern as the example - array of worksheet instances
    const spreadsheet = useRef<jspreadsheet.worksheetInstance[] | undefined>(undefined);

    // Generate pivot data using SUMIFS formulas - simple inline generation
    const pivotData = useMemo(() => {
        const group1Idx = SHEET1_COLUMNS.findIndex(c => c.title === pivotConfig.groupBy1);
        const group2Idx = SHEET1_COLUMNS.findIndex(c => c.title === pivotConfig.groupBy2);
        const aggIdx = SHEET1_COLUMNS.findIndex(c => c.title === pivotConfig.aggregateColumn);
        
        if (group1Idx === -1 || group2Idx === -1 || aggIdx === -1) return [];

        const col1 = String.fromCharCode(65 + group1Idx);
        const col2 = String.fromCharCode(65 + group2Idx);
        const colAgg = String.fromCharCode(65 + aggIdx);

        const g1Vals = [...new Set(SHEET1_DATA.map(r => String(r[group1Idx])))].sort();
        const g2Vals = [...new Set(SHEET1_DATA.map(r => String(r[group2Idx])))].sort();

        const result: (string | number)[][] = [[pivotConfig.groupBy1, pivotConfig.groupBy2, `Total ${pivotConfig.aggregateColumn}`]];
        
        g1Vals.forEach(g1 => {
            g2Vals.forEach(g2 => {
                if (SHEET1_DATA.some(r => String(r[group1Idx]) === g1 && String(r[group2Idx]) === g2)) {
                    result.push([g1, g2, `=SUMIFS(Sheet1!${colAgg}:${colAgg}, Sheet1!${col1}:${col1}, "${g1}", Sheet1!${col2}:${col2}, "${g2}")`]);
                }
            });
            result.push(['', '']);
            result.push([`${g1} Total:`, '', `=SUMIF(Sheet1!${col1}:${col1}, "${g1}", Sheet1!${colAgg}:${colAgg})`]);
        });

        return result;
    }, [pivotConfig]);

    const pivotColumns = useMemo(() => [
        { title: pivotConfig.groupBy1, width: '150px', type: 'text' as const },
        { title: pivotConfig.groupBy2, width: '150px', type: 'text' as const },
        { title: `Total ${pivotConfig.aggregateColumn}`, width: '150px', type: 'text' as const },
    ], [pivotConfig]);

    // Update Sheet2 when pivotConfig changes
    useEffect(() => {
        if (!spreadsheet.current || spreadsheet.current.length < 2) {
            return;
        }

        const sheet2 = spreadsheet.current[1];
        console.log('[FormulaBasedPivotTable] Updating Sheet2', {
            pivotDataRows: pivotData.length,
            pivotColumns: pivotColumns.map(c => c.title),
        });

        try {
            // Update data
            sheet2.setData(pivotData);
            console.log('[FormulaBasedPivotTable] ✓ Sheet2 data updated');
            
            // Update columns if setColumns method exists
            const worksheetInstance = sheet2 as any;
            if (typeof worksheetInstance.setColumns === 'function') {
                worksheetInstance.setColumns(pivotColumns);
                console.log('[FormulaBasedPivotTable] ✓ Sheet2 columns updated');
            }
        } catch (error) {
            console.error('[FormulaBasedPivotTable] ✗ Error updating Sheet2:', error);
        }
    }, [pivotConfig, pivotData, pivotColumns]);

    // Handler when spreadsheet loads - matches example pattern
    const onload = useCallback((instance: jspreadsheet.spreadsheetInstance) => {
        console.log('[FormulaBasedPivotTable] ✓ Spreadsheet loaded', {
            worksheetsCount: instance.worksheets?.length,
            sheet1DataRows: SHEET1_DATA.length,
            sheet1Columns: SHEET1_COLUMNS.map(c => c.title || c),
        });
        
        // Access worksheets via array indexing like the example
        if (spreadsheet.current && spreadsheet.current.length > 0) {
            const sheet1 = spreadsheet.current[0];
            console.log('[FormulaBasedPivotTable] ✓ Sheet1 ready', {
                exists: !!sheet1,
                worksheetName: sheet1.name,
            });
            
            if (spreadsheet.current.length > 1) {
                const sheet2 = spreadsheet.current[1];
                console.log('[FormulaBasedPivotTable] ✓ Sheet2 ready', {
                    exists: !!sheet2,
                    worksheetName: sheet2.name,
                });
            }
        }
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
                        minDimensions={[3, Math.max(15, pivotData.length + 5)]}
                        tableOverflow={true}
                    />
                </Spreadsheet>
            </div>
        </div>
    );
}
