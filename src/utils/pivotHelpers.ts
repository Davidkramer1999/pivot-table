import type { PivotConfig } from '../components/PivotControls';

/**
 * Column mapping for the source data
 */
const COLUMN_MAP: { [key: string]: number } = {
    'Category': 0,
    'Subcategory': 1,
    'Region': 2,
    'Sales': 3,
};

/**
 * Result type for generated pivot data
 */
export interface PivotDataResult {
    data: (string | number)[][];
    columns: { title: string; width: string }[];
}

/**
 * Generate pivot table data from source data
 * 
 * @param sourceData - The raw source data as a 2D array
 * @param config - Pivot configuration specifying grouping and aggregation
 * @returns Pivot table data with columns configuration
 */
export function generatePivotData(
    sourceData: (string | number)[][],
    config: PivotConfig
): PivotDataResult {
    const group1Index = COLUMN_MAP[config.groupBy1];
    const group2Index = COLUMN_MAP[config.groupBy2];
    const aggIndex = COLUMN_MAP[config.aggregateColumn];

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
