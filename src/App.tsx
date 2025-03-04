import { useState } from "react";
import Dropzone, { ParseResult } from "./components/Dropzone";
import Footer from "./components/Footer";
import { markdownTable } from "markdown-table";
import { Tabs } from "./components/Tabs";
import { DownloadIcon, XIcon } from "./components/Icons";

function App() {
    const [fileName, setFileName] = useState<string>("");
    const [fileContents, setFileContents] = useState<string>("");
    const [markdown, setMarkdown] = useState<string>("");
    const [processedFile, setProcessedFile] = useState<Blob | null>(null);

    const handleFileSelect = (file: File, contents: ParseResult) => {
        const data = contents?.data || [];

        setFileName(file.name);
        setFileContents(data.slice(0, 10).join("\n") || "");
        setProcessedFile(contents.processedFile);

        setMarkdown(
            markdownTable(data, {
                align: data[0].map(() => "left"),
                padding: true,
            }),
        );
    };

    const handleDownload = () => {
        if (processedFile && fileName) {
            const url = URL.createObjectURL(processedFile);
            const a = document.createElement("a");
            a.href = url;

            // Preserve the original file extension
            const extension = fileName.split(".").pop();
            a.download = `cleaned_${fileName.replace(`.${extension}`, "")}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleClear = () => {
        setFileName("");
        setFileContents("");
        setMarkdown("");
        setProcessedFile(null);
    };

    const renderContent = () => {
        const tabs = [
            {
                label: "Data preview",
                content: (
                    <div
                        contentEditable
                        className="w-full overflow-auto p-4 border font-mono whitespace-pre"
                        suppressContentEditableWarning
                    >
                        {fileContents}
                    </div>
                ),
            },
            {
                label: "Markdown",
                content: (
                    <div
                        contentEditable
                        className="w-full overflow-auto p-4 border font-mono whitespace-pre"
                        suppressContentEditableWarning
                    >
                        {markdown}
                    </div>
                ),
            },
        ];

        return (
            <div className="flex flex-col gap-2">
                <Tabs tabs={tabs} />
                <div className="text-sm text-gray-600 text-center">
                    <em>{fileName}</em>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto p-8">
            <h1 className="text-2xl font-bold">Spreadsheet Clear</h1>
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2 mb-6">
                    <p className="hidden sm:block">
                        Upload an Excel or CSV file and each column will be cleaned up. It locally removes trailing
                        spaces and replaces multiple spaces to a single one.
                    </p>
                </div>

                {fileContents && (
                    <div className="flex gap-8">
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-black rounded bg-gray-50 border hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                        >
                            <XIcon />
                            <span className="hidden sm:block">Choose different file</span>
                        </button>

                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-blue-500 text-white rounded border-blue-800 hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                        >
                            <DownloadIcon />
                            <span className="hidden sm:block">Download cleaned file</span>
                        </button>
                    </div>
                )}
            </div>

            {fileContents ? renderContent() : <Dropzone onFileSelect={handleFileSelect} />}

            <Footer />
        </div>
    );
}

export default App;
