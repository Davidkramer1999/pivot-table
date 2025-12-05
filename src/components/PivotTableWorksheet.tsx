import { useMemo, useRef } from 'react';
import { jspreadsheet, Spreadsheet, Worksheet } from '@jspreadsheet/react';
import type { PivotConfig } from './PivotControls';
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
            <Spreadsheet ref={spreadsheetRef} tabs={false} toolbar={false}>
                <Worksheet
                    data={pivotData.data}
                    columns={pivotData.columns}
                    minDimensions={[pivotData.columns.length, pivotData.data.length + 5]}
                    tableOverflow={true}
                    tableWidth="100%"
                    tableHeight="600px"
                />
            </Spreadsheet>
        </div>
    );
}

/**
 * Generate pivot table data from source data
 */
function generatePivotData(
    sourceData: (string | number)[][],
    config: PivotConfig
): { data: (string | number)[][]; columns: { title: string; width: string }[] } {

    // Column mapping
    const columnMap: { [key: string]: number } = {
        'Category': 0,
        'Subcategory': 1,
        'Region': 2,
        'Sales': 3,
    };

    const group1Index = columnMap[config.groupBy1];
    const group2Index = columnMap[config.groupBy2];
    const aggIndex = columnMap[config.aggregateColumn];

    // Build pivot structure
    const pivotMap = new Map<string, Map<string, number>>();
    const group1Values = new Set<string>();
    const group2Values = new Set<string>();

    // Aggregate data
    sourceData.forEach((row) => {
        const group1Value = String(row[group1Index]);
        const group2Value = String(row[group2Index]);
        const aggValue = Number(row[aggIndex]) || 0;

        group1Values.add(group1Value);
        group2Values.add(group2Value);

        if (!pivotMap.has(group1Value)) {
            pivotMap.set(group1Value, new Map());
        }

        const group2Map = pivotMap.get(group1Value)!;
        const currentValue = group2Map.get(group2Value) || 0;
        group2Map.set(group2Value, currentValue + aggValue);
    });

    // Sort group values
    const sortedGroup1 = Array.from(group1Values).sort();
    const sortedGroup2 = Array.from(group2Values).sort();

    // Build output data
    const outputData: (string | number)[][] = [];
    const columns = [
        { title: config.groupBy1, width: '150px' },
        { title: config.groupBy2, width: '150px' },
        { title: `Total ${config.aggregateColumn}`, width: '150px' },
    ];

    let grandTotal = 0;

    sortedGroup1.forEach((group1Val) => {
        const group2Map = pivotMap.get(group1Val)!;
        let group1Subtotal = 0;

        sortedGroup2.forEach((group2Val) => {
            const value = group2Map.get(group2Val) || 0;
            if (value > 0) {
                outputData.push([group1Val, group2Val, value]);
                group1Subtotal += value;
            }
        });

        // Add subtotal row
        outputData.push([`${group1Val} Subtotal`, '', group1Subtotal]);
        grandTotal += group1Subtotal;
    });

    // Add grand total row
    outputData.push(['Grand Total', '', grandTotal]);

    return { data: outputData, columns };
}
