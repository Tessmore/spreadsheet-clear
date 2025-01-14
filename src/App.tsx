import CopyButton from "./components/CopyButton";

function App() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold">PLACEHOLDER_TITLE</h1>
                        <p className="text-xl">Get started</p>

                        <CopyButton value="Copy text" label="Copy to clipboard" />
                    </div>
                </header>
            </div>
        </div>
    );
}

export default App;
