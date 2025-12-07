import { useRef, useCallback, useEffect } from 'react';
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import { JSPREADSHEET_LICENSE_KEY } from '../config/jspreadsheet.config';
import Header from './ui/header';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';

// Set license once
jspreadsheet.setLicense(JSPREADSHEET_LICENSE_KEY);

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

    const handleDataChange = useCallback(() => {
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
        handleDataChange();
    }, [handleDataChange]);

    return (
        <div className="data-worksheet">
            <Header title="Data Worksheet" description="Edit the data below. Changes will automatically update the pivot table." />
            <div className="data-table-container">
                <Spreadsheet
                    ref={spreadsheetRef as React.RefObject<jspreadsheet.spreadsheetInstance>}
                    tabs={true}
                    toolbar={true}
                    onload={handleLoad}
                >
                    <Worksheet
                        data={sampleData}
                        columns={columnHeaders}
                        minDimensions={[4, 25]}
                        tableOverflow={true}
                        onchange={handleDataChange}
                    />
                </Spreadsheet>
            </div>
        </div>
    );
}

