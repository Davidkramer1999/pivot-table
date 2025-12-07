import { useRef, useCallback, useEffect } from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import Header from './ui/SheetContainer';
import SpreadsheetView from './ui/SpreadsheetView';

interface SourceDataEditorProps {
    onDataChange?: (data: (string | number)[][]) => void;
}


export default function SourceDataEditor({ onDataChange }: SourceDataEditorProps) {
    const spreadsheetRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);
    
    useEffect(() => {
        if (onDataChange && sampleData.length > 0) {
            onDataChange(sampleData);
        }
    }, [onDataChange]);

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

    const handleLoad = useCallback((instance: jspreadsheet.spreadsheetInstance) => {
        spreadsheetRef.current = instance;
        
        const worksheet = instance.worksheets?.[0];
        if (worksheet && onDataChange) {
            extractAndNotifyData();
        }
    }, [extractAndNotifyData, onDataChange]);

    const handleChange = useCallback(() => {
        extractAndNotifyData();
    }, [extractAndNotifyData]);

    return (
        <div className="data-worksheet">
            <Header title="Data Worksheet" description="Edit the data below. Changes will automatically update the pivot table." />
            <SpreadsheetView
                spreadsheetRef={spreadsheetRef}
                tabs={true}
                toolbar={true}
                onLoad={handleLoad}
                data={sampleData}
                columns={columnHeaders}
                minDimensions={[4, 25]}
                tableOverflow={true}
                onChange={handleChange}
            />
        </div>
    );
}

