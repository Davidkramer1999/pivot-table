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

    const notifyDataChange = useCallback(() => {
        if (!onDataChange) return;

        const worksheet = spreadsheetRef.current?.worksheets?.[0];
        if (!worksheet) return;

        const data = worksheet.getData() as (string | number)[][];
        if (data && data.length > 0) {
            onDataChange(data);
        }
    }, [onDataChange]);

    const handleLoad = useCallback((instance: jspreadsheet.spreadsheetInstance) => {
        spreadsheetRef.current = instance;
        notifyDataChange();
    }, [notifyDataChange]);

    const handleChange = useCallback(() => {
        notifyDataChange();
    }, [notifyDataChange]);

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

