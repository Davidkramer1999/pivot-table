import { Worksheet } from '@jspreadsheet/react';

interface JWorksheetWrapperProps {
    data: (string | number)[][];
    columns: Array<{ title: string; width?: string }>;
    minDimensions?: [number, number];
    tableOverflow?: boolean;
    onChange?: () => void;
}

export default function JWorksheetWrapper({
    data,
    columns,
    minDimensions,
    tableOverflow = true,
    onChange,
}: JWorksheetWrapperProps) {
    return (
        <Worksheet
            data={data}
            columns={columns}
            minDimensions={minDimensions}
            tableOverflow={tableOverflow}
            onchange={onChange}
        />
    );
}

