import { useState } from "react";
import Dropzone, { ParseResult } from "./components/Dropzone";
import { markdownTable } from "markdown-table";
import { Tabs } from "./components/Tabs";

function App() {
    const [fileName, setFileName] = useState<string>("");
    const [fileContents, setFileContents] = useState<string>("");
    const [markdown, setMarkdown] = useState<string>("");

    const handleFileSelect = (file: File, contents: ParseResult) => {
        const data = contents?.data || [];

        setFileName(file.name);
        setFileContents(data.slice(0, 10).join("\n") || "");

        setMarkdown(
            markdownTable(data, {
                align: data[0].map(() => "left"),
                padding: true,
            }),
        );
    };

    const handleClear = () => {
        setFileName("");
        setFileContents("");
        setMarkdown("");
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
        <div className="flex flex-col gap-2 p-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-xl font-bold">Spreadsheet clear</h1>
                    <p>
                        Upload an Excel or CSV file and each column will be cleaned up. It locally removes trailing
                        spaces and replaces multiple spaces to a single one.
                    </p>
                </div>

                {fileContents && (
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 text-black rounded hover:bg-gray-100 transition-colors"
                    >
                        Choose different file
                    </button>
                )}
            </div>

            {fileContents ? renderContent() : <Dropzone onFileSelect={handleFileSelect} />}
        </div>
    );
}

export default App;
