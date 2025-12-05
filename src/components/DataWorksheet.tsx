import { useRef } from 'react';
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react';
import { JSPREADSHEET_LICENSE_KEY } from '../config/jspreadsheet.config';
import { sampleData, columnHeaders } from '../data/sampleData';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';

interface DataWorksheetProps {
    onDataChange?: (data: (string | number)[][]) => void;
    onInstanceReady?: (instance: any) => void;
}

// Set license once
jspreadsheet.setLicense(JSPREADSHEET_LICENSE_KEY);

export default function DataWorksheet({ onDataChange, onInstanceReady }: DataWorksheetProps) {
    const spreadsheetRef = useRef<jspreadsheet.worksheetInstance[] | undefined>(undefined);

    const handleLoad = (instance: any) => {
        if (onInstanceReady) {
            onInstanceReady(instance);
        }
        if (onDataChange) {
            onDataChange(instance.getData());
        }
    };

    const handleChange = () => {
        if (onDataChange && spreadsheetRef.current?.[0]) {
            // jspreadsheet returns a loosely typed value; normalize to 2D array for consumers
            const raw = spreadsheetRef.current[0].getData() as unknown;
            const normalized = Array.isArray(raw) ? (raw as (string | number)[][]) : [];
            onDataChange(normalized);
        }
    };

    return (
        <div className="data-worksheet">
            <h2>Data Worksheet</h2>
            <p>Edit the data below. Changes will automatically update the pivot table.</p>
            <div className="data-table-container">
                <Spreadsheet
                    ref={spreadsheetRef}
                    tabs={true}
                    toolbar={true}
                    onload={handleLoad}
                >
                    <Worksheet
                        data={sampleData}
                        columns={columnHeaders}
                        minDimensions={[4, 25]}
                        tableOverflow={true}
                        onchange={handleChange}
                    />
                </Spreadsheet>
            </div>
        </div>
    );
}
