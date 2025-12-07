import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Spreadsheet, jspreadsheet } from '@jspreadsheet/react';
import { JSPREADSHEET_LICENSE_KEY } from '../../config/jspreadsheet.config';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';

// Set license once
jspreadsheet.setLicense(JSPREADSHEET_LICENSE_KEY);

interface JSpreadsheetWrapperProps {
    children: ReactNode;
    tabs?: boolean;
    toolbar?: boolean;
    onLoad?: (instance: jspreadsheet.spreadsheetInstance) => void;
    spreadsheetRef?: React.RefObject<jspreadsheet.spreadsheetInstance | null>;
}

/**
 * Wrapper component for jspreadsheet Spreadsheet
 * Handles license setup and provides a clean interface
 */
export default function JSpreadsheetWrapper({
    children,
    tabs = false,
    toolbar = false,
    onLoad,
    spreadsheetRef,
}: JSpreadsheetWrapperProps) {
    const internalRef = useRef<jspreadsheet.spreadsheetInstance | null>(null);
    const ref = spreadsheetRef || internalRef;

    const handleLoad = (instance: jspreadsheet.spreadsheetInstance) => {
        if (ref && 'current' in ref) {
            (ref as React.MutableRefObject<jspreadsheet.spreadsheetInstance | null>).current = instance;
        }
        if (onLoad) {
            onLoad(instance);
        }
    };

    return (
        <Spreadsheet
            ref={ref as React.RefObject<jspreadsheet.spreadsheetInstance>}
            tabs={tabs}
            toolbar={toolbar}
            onload={handleLoad}
        >
            {children}
        </Spreadsheet>
    );
}

