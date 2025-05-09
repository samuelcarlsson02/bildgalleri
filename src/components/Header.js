'use client'

// The header component displays the title and navigation bar
export function Header({ title, activeTab, onTabChange }) {
    return (
        <div className="h-20 bg-gray-600 w-full border-b-2 border-black dark:border-white shadow-lg text-white">
            <div className="flex md:flex-row flex-col gap-2 justify-between items-center h-full max-w-screen-xl mx-auto">
                <header>
                    <h1 className="font-mono text-3xl font-bold pl-4 cursor-default">{title}</h1>
                </header>
                <nav className="flex md:flex-row h-full text-lg">
                    <a onClick={() => onTabChange("search")} className={`flex items-center px-4 cursor-pointer ${activeTab === "search" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Sök</a>
                    <a onClick={() => onTabChange("gallery")} className={`flex items-center px-4 cursor-pointer ${activeTab === "gallery" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Mitt galleri</a>
                </nav>
            </div>
        </div>
    );
}