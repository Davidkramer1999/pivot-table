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
    };

    return (
        <div className="data-worksheet">
            <h2>Data Worksheet</h2>
            <p>Edit the data below. Changes will automatically update the pivot table.</p>
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
                    tableWidth="100%"
                    tableHeight="600px"
                />
            </Spreadsheet>
        </div>
    );
}
