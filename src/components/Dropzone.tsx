import { useState, DragEvent, useRef } from "react";
import { DELIMITERS, transformValue, transformValueExcel } from "./dropzone-utils";
import Papa from "papaparse";
import ExcelJS from "exceljs";

export interface ParseResult {
    data: string[][];
    processedFile: Blob;
}

export interface DropzoneProps {
    onFileSelect: (file: File, contents: ParseResult) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const readFileContents = async (file: File) => {
        try {
            if (file.name.endsWith(".xlsx")) {
                const workbook = new ExcelJS.Workbook();
                const arrayBuffer = await file.arrayBuffer();

                await workbook.xlsx.load(arrayBuffer);

                const worksheet = workbook.worksheets[0];
                const data: string[][] = [];

                worksheet.eachRow((row, rowNumber) => {
                    const rowValues: string[] = [];

                    row.eachCell((cell, colNumber) => {
                        // Add transformed value for preview
                        const cleanedValue = transformValue(cell.value as any);
                        rowValues.push(cleanedValue);

                        // Update the cell with cleaned value
                        cell.value = transformValueExcel(cell.value as any);
                    });

                    data.push(rowValues);
                });

                // Generate processed Excel file
                const processedFile = await workbook.xlsx.writeBuffer();
                const blob = new Blob([processedFile], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                onFileSelect(file, { data, processedFile: blob });
            } else {
                const cleanedData: string[][] = [];

                // Config options
                // https://www.papaparse.com/docs#config
                Papa.parse(file as any, {
                    skipEmptyLines: true,
                    delimitersToGuess: DELIMITERS,
                    transform: (value: any) => transformValue(value),
                    step: (results: any) => {
                        cleanedData.push(results.data);
                    },
                    complete: () => {
                        // Generate processed CSV file
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
            alert(`Error reading file ${error}`);
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
