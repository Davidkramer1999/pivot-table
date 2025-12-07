import React from 'react';
import { jspreadsheet } from '@jspreadsheet/react';
import JSpreadsheetWrapper from './JSpreadsheetWrapper';
import JWorksheetWrapper from './JWorksheetWrapper';

interface SpreadsheetViewProps {
    spreadsheetRef?: React.RefObject<jspreadsheet.spreadsheetInstance | null>;
    onLoad?: (instance: jspreadsheet.spreadsheetInstance) => void;
    tabs?: boolean;
    toolbar?: boolean;
    data: (string | number)[][];
    columns: Array<{ title: string; width?: string }>;
    minDimensions?: [number, number];
    tableOverflow?: boolean;
    onChange?: () => void;
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
            <JSpreadsheetWrapper
                spreadsheetRef={spreadsheetRef}
                tabs={tabs}
                toolbar={toolbar}
                onLoad={onLoad}
            >
                <JWorksheetWrapper
                    data={data}
                    columns={columns}
                    minDimensions={minDimensions}
                    tableOverflow={tableOverflow}
                    onChange={onChange}
                />
            </JSpreadsheetWrapper>
        </div>
    );
}
