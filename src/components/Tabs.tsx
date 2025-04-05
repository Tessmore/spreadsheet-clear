import { ReactNode, useState } from "react";

interface Tab {
    label: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

export const Tabs = ({ tabs }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-0.5">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 cursor-pointer ${
                            activeTab === index
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "border-b-2 text-gray-600 hover:text-gray-800  hover:border-blue-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">{tabs[activeTab].content}</div>
        </div>
    );
};
