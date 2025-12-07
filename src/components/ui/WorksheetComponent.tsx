import { Worksheet } from '@jspreadsheet/react';

interface WorksheetComponentProps {
    data: (string | number)[][];
    columns: Array<{ title: string; width?: string }>;
    minDimensions?: [number, number];
    tableOverflow?: boolean;
    onChange?: () => void;
}

export default function WorksheetComponent({
    data,
    columns,
    minDimensions,
    tableOverflow = true,
    onChange,
}: WorksheetComponentProps) {
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
