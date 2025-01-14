import React, { useState } from "react";

/** Dummy component to get started */
const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    const [counter, setCounter] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);

            setCounter(counter + 1);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative">
            <button onClick={copyToClipboard} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
                {label} ({counter})
            </button>
            {showPopup && (
                <div className="absolute bottom-0 right-0 bg-green-500 text-white px-3 py-2.5 rounded z-10 shadow-lg">
                    Copied!
                </div>
            )}
        </div>
    );
};

export default CopyButton;
