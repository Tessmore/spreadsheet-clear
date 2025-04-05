import { useState, DragEvent, useRef } from "react";
import { DELIMITERS, transformValue, transformValueExcel, dateToExcelSerial, formatDate } from "./dropzone-utils";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParseResult {
    data: (string | Date | number)[][];
    processedFile: Blob;
}

export interface DropzoneProps {
    onFileSelect: (file: File, contents: ParseResult) => void;
}

const Dropzone = ({ onFileSelect }: DropzoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const readFileContents = async (file?: File) => {
        try {
            if (file?.name.endsWith(".xlsx")) {
                const arrayBuffer = await file.arrayBuffer();

                // NOTE: Uses SheetJS which handles Protected View files
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array", cellDates: true });

                const wsname = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[wsname];

                // Preserve the date formats from the original worksheet
                const cellFormat = {};
                for (const cell in worksheet) {
                    if (cell[0] === "!" || !worksheet[cell].w) {
                        continue;
                    }

                    // Store format string if exists
                    (cellFormat as any)[cell] = worksheet[cell].z;
                }

                // Convert to JSON with date detection
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    raw: false,
                    dateNF: "dd-mm-yyyy", // Use consistent date format
                }) as any[][];

                const data: (string | Date | number)[][] = jsonData.map((row) =>
                    Array.isArray(row) ? row.map((cell) => transformValueExcel(cell)) : [],
                );

                // For preview, convert dates to formatted strings
                const previewData = data.map((row) =>
                    row.map((cell) => (cell instanceof Date ? formatDate(cell) : cell)),
                );

                // Write to a new workbook to get clean data (and avoid protected view issues)
                const newWorkbook = XLSX.utils.book_new();

                // Convert dates back to Excel serial numbers for the worksheet
                const worksheetData = data.map((row) =>
                    row.map((cell) => (cell instanceof Date ? dateToExcelSerial(cell) : cell)),
                );

                const newWorksheet = XLSX.utils.aoa_to_sheet(worksheetData);

                // Apply the original formats to the new worksheet
                for (const cell in cellFormat) {
                    if (newWorksheet[cell]) {
                        const format = (cellFormat as any)[cell];
                        newWorksheet[cell].z = format;

                        // If this was originally a date column, ensure proper formatting
                        if (format?.toLowerCase().includes("yy") || format?.toLowerCase().includes("dd")) {
                            newWorksheet[cell].t = "n"; // Numeric type for Excel dates
                            newWorksheet[cell].z = "dd-mm-yyyy"; // Consistent date format
                        }
                    }
                }

                XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

                // Generate processed Excel file
                const processedBuffer = XLSX.write(newWorkbook, { type: "array", bookType: "xlsx" });
                const blob = new Blob([processedBuffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                onFileSelect(file, { data: previewData, processedFile: blob });
            } else if (file) {
                const cleanedData: string[][] = [];

                Papa.parse(file, {
                    skipEmptyLines: true,
                    delimitersToGuess: DELIMITERS,
                    transform: (value) => transformValue(value),
                    step: (results) => {
                        cleanedData.push(results.data as string[]);
                    },
                    complete: () => {
                        const processedCsv = Papa.unparse(cleanedData);
                        const blob = new Blob([processedCsv], { type: "text/csv" });

                        onFileSelect(file, {
                            data: cleanedData,
                            processedFile: blob,
                        });
                    },
                });
            }
        } catch (error) {
            console.error("Error reading file:", error);

            alert(`Error reading file ${error}`);
            setFile(null);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const dataFile = files.find((file) => file.type);

        if (dataFile) {
            setFile(dataFile);
            readFileContents(dataFile);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files?.[0]) {
            const selectedFile = files[0];
            setFile(selectedFile);
            readFileContents(selectedFile);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick();
                }
            }}
            className={`
                bg-gray-50
                border-2 border-dashed rounded-lg p-12 mt-8
                text-center cursor-pointer transition-colors
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
        >
            <input ref={inputRef} type="file" accept=".csv,.txt,.xlsx" onChange={handleFileInput} className="hidden" />
            <div className="text-gray-600">
                {file ? (
                    <p>Selected file: {file.name}</p>
                ) : (
                    <>
                        <p className="text-lg mb-2">Drop your Excel or CSV file here</p>
                        <p className="text-sm">or click to select a file</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dropzone;
