import React from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import SpreadsheetComponent from './SpreadsheetComponent';
import WorksheetComponent from './WorksheetComponent';

interface SpreadsheetViewProps {
    // Spreadsheet props
    spreadsheetRef?: React.RefObject<jspreadsheet.spreadsheetInstance | null>;
    onLoad?: (instance: jspreadsheet.spreadsheetInstance) => void;
    tabs?: boolean;
    toolbar?: boolean;

    // Worksheet props
    data: (string | number)[][];
    columns: Array<{ title: string; width?: string }>;
    minDimensions?: [number, number];
    tableOverflow?: boolean;
    onChange?: () => void;

    // Container props
    containerClassName?: string;
}

export default function SpreadsheetView({
    spreadsheetRef,
    onLoad,
    tabs = false,
    toolbar = false,
    data,
    columns,
    minDimensions,
    tableOverflow = true,
    onChange,
    containerClassName = '',
}: SpreadsheetViewProps) {
    return (
        <div className={containerClassName}>
            <SpreadsheetComponent
                spreadsheetRef={spreadsheetRef}
                tabs={tabs}
                toolbar={toolbar}
                onLoad={onLoad}
            >
                <WorksheetComponent
                    data={data}
                    columns={columns}
                    minDimensions={minDimensions}
                    tableOverflow={tableOverflow}
                    onChange={onChange}
                />
            </SpreadsheetComponent>
        </div>
    );
}
