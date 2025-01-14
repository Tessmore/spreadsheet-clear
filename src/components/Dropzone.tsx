import { useState, DragEvent, useRef } from "react";

interface DropzoneProps {
    onFileSelect: (file: File, contents: string) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const readFileContents = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const contents = event.target?.result as string;
            onFileSelect(file, contents);
        };
        reader.readAsText(file);
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
        const csvFile = files.find((file) => file.type === "text/csv");

        if (csvFile) {
            setFile(csvFile);
            readFileContents(csvFile);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const selectedFile = files[0];
            if (selectedFile.type === "text/csv") {
                setFile(selectedFile);
                readFileContents(selectedFile);
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                border-2 border-dashed rounded-lg p-8
                text-center cursor-pointer transition-colors
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
        >
            <input ref={inputRef} type="file" accept=".csv" onChange={handleFileInput} className="hidden" />
            <div className="text-gray-600">
                {file ? (
                    <p>Selected file: {file.name}</p>
                ) : (
                    <>
                        <p className="text-lg mb-2">Drop your CSV file here</p>
                        <p className="text-sm">or click to select a file</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dropzone;
