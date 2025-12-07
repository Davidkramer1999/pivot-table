import type { PivotConfig } from '../components/PivotConfigPanel';

/**
 * Result type for generated pivot data
 */
export interface PivotDataResult {
    data: (string | number)[][];
    columns: { title: string; width: string }[];
}

/**
 * Generate pivot table data from source data with formulas
 * 
 * @param sourceData - The raw source data as a 2D array
 * @param columnHeaders - Array of column header objects with 'title' property
 * @param config - Pivot configuration specifying grouping and aggregation
 * @param sheetName - Name of the source sheet for formula references (default: 'Sheet1')
 * @returns Pivot table data with columns configuration
 */
export function generatePivotData(
    sourceData: (string | number)[][],
    columnHeaders: { title: string }[],
    config: PivotConfig,
    sheetName: string = 'Sheet1'
): PivotDataResult {
    const group1Index = columnHeaders.findIndex(c => c.title === config.groupBy1);
    const group2Index = columnHeaders.findIndex(c => c.title === config.groupBy2);
    const aggIndex = columnHeaders.findIndex(c => c.title === config.aggregateColumn);
    
    if (group1Index === -1 || group2Index === -1 || aggIndex === -1) {
        return { data: [], columns: [] };
    }

    const col1 = String.fromCharCode(65 + group1Index);
    const col2 = String.fromCharCode(65 + group2Index);
    const colAgg = String.fromCharCode(65 + aggIndex);

    // Build pivot structure - track combinations
    const pivotMap = new Map<string, Set<string>>();
    const group1Values = new Set<string>();

    sourceData.forEach((row) => {
        const group1Value = String(row[group1Index]);
        const group2Value = String(row[group2Index]);
        group1Values.add(group1Value);
        if (!pivotMap.has(group1Value)) {
            pivotMap.set(group1Value, new Set());
        }
        pivotMap.get(group1Value)!.add(group2Value);
    });

    // Sort group values
    const sortedGroup1 = Array.from(group1Values).sort();

    // Build output data with formulas
    const outputData: (string | number)[][] = [];
    const columns = [
        { title: config.groupBy1, width: '150px' },
        { title: config.groupBy2, width: '150px' },
        { title: `Total ${config.aggregateColumn}`, width: '150px' },
    ];

    sortedGroup1.forEach((group1Val) => {
        const g2Vals = Array.from(pivotMap.get(group1Val)!).sort();
        
        // Add data rows with formulas
        g2Vals.forEach((group2Val) => {
            outputData.push([
                group1Val,
                group2Val,
                `=SUMIFS(${sheetName}!${colAgg}:${colAgg}, ${sheetName}!${col1}:${col1}, "${group1Val}", ${sheetName}!${col2}:${col2}, "${group2Val}")`
            ]);
        });
        
        // Add empty row separator
        outputData.push(['', '']);
        
        // Add subtotal with formula
        outputData.push([`${group1Val} Total:`, '', `=SUMIF(${sheetName}!${col1}:${col1}, "${group1Val}", ${sheetName}!${colAgg}:${colAgg})`]);
    });

    // Add grand total
    outputData.push(['', '']);
    outputData.push(['Grand Total:', '', `=SUM(${sheetName}!${colAgg}:${colAgg})`]);

    return { data: outputData, columns };
}
