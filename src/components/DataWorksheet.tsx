import { useRef } from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import { sampleData, columnHeaders } from '../data/sampleData';
import SheetContainer from './ui/SheetContainer';
import SpreadsheetView from './ui/SpreadsheetView';

interface DataWorksheetProps {
    onDataChange?: (data: (string | number)[][]) => void;
    onInstanceReady?: (instance: any) => void;
}

export default function DataWorksheet({ onDataChange, onInstanceReady }: DataWorksheetProps) {
    const spreadsheetRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);

    const handleLoad = (instance: jspreadsheet.spreadsheetInstance) => {
        console.log('handleLoad');
        console.log(instance);
        spreadsheetRef.current = instance;
        const worksheet = instance.worksheets?.[0];

        if (onInstanceReady && worksheet) {
            onInstanceReady(worksheet);
        }

        if (onDataChange && worksheet?.getData) {
            const raw = worksheet.getData() as unknown;
            const normalized = Array.isArray(raw) ? (raw as (string | number)[][]) : [];
            onDataChange(normalized);
        }
    };

    const handleChange = () => {
        const worksheet = spreadsheetRef.current?.worksheets?.[0];
        if (!worksheet) return;

        if (onDataChange && worksheet.getData) {
            // jspreadsheet returns a loosely typed value; normalize to 2D array for consumers
            const raw = worksheet.getData() as unknown;
            const normalized = Array.isArray(raw) ? (raw as (string | number)[][]) : [];
            onDataChange(normalized);
        }
    };

    return (
        <SheetContainer
            title="Data Worksheet"
            description="Edit the data below. Changes will automatically update the pivot table."
            className="data-worksheet"
        >
            <SpreadsheetView
                containerClassName="data-table-container"
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
        </SheetContainer>
    );
}
