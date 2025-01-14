import Dropzone from "./components/Dropzone";

function App() {
    const handleFileSelect = (file: File, contents: string) => {
        console.log("Selected file:", file.name);
        console.log("File contents:", contents);
    };

    return (
        <div className="p-2">
            <h1 className="text-xl font-bold mb-4">Spreadsheet clear</h1>
            <Dropzone onFileSelect={handleFileSelect} />
        </div>
    );
}

export default App;
