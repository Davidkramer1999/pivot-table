import { useRef, useCallback, useEffect } from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import JSpreadsheetWrapper from './ui/JSpreadsheetWrapper';
import JWorksheetWrapper from './ui/JWorksheetWrapper';

interface SourceDataEditorProps {
    onDataChange?: (data: (string | number)[][]) => void;
}

/**
 * SourceDataEditor component - manages its own spreadsheet instance internally
 * Notifies parent component when data changes via callback
 */
export default function SourceDataEditor({ onDataChange }: SourceDataEditorProps) {
    const spreadsheetRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);
    
    // Notify parent with initial data on mount
    useEffect(() => {
        if (onDataChange && sampleData.length > 0) {
            onDataChange(sampleData);
        }
    }, [onDataChange]);

    // Extract data from worksheet and notify parent
    const extractAndNotifyData = useCallback(() => {
        const worksheet = spreadsheetRef.current?.worksheets?.[0];
        if (!worksheet || !onDataChange) return;

        try {
            const raw = worksheet.getData() as unknown;
            const normalized = Array.isArray(raw) ? (raw as (string | number)[][]) : [];
            if (normalized.length > 0) {
                onDataChange(normalized);
            }
        } catch (error) {
            console.error('Error extracting data from worksheet:', error);
        }
    }, [onDataChange]);

    // Handle spreadsheet load - check if worksheet is immediately available
    const handleLoad = useCallback((instance: jspreadsheet.spreadsheetInstance) => {
        spreadsheetRef.current = instance;
        
        // Try to extract data immediately if worksheet is available
        const worksheet = instance.worksheets?.[0];
        if (worksheet && onDataChange) {
            extractAndNotifyData();
        }
    }, [extractAndNotifyData, onDataChange]);

    // Handle worksheet data changes
    const handleChange = useCallback(() => {
        extractAndNotifyData();
    }, [extractAndNotifyData]);

    return (
        <div className="data-worksheet">
            <h2>Data Worksheet</h2>
            <p>Edit the data below. Changes will automatically update the pivot table.</p>
            <div className="data-table-container">
                <JSpreadsheetWrapper
                    spreadsheetRef={spreadsheetRef}
                    tabs={true}
                    toolbar={true}
                    onLoad={handleLoad}
                >
                    <JWorksheetWrapper
                        data={sampleData}
                        columns={columnHeaders}
                        minDimensions={[4, 25]}
                        tableOverflow={true}
                        onChange={handleChange}
                    />
                </JSpreadsheetWrapper>
            </div>
        </div>
    );
}

