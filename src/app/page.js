'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="flex flex-col font-sans h-screen">
      <div className="flex flex-row justify-between items-center h-20 bg-gray-600 w-full border-b-2 border-white">
        <header>
          <h1 className="font-mono text-3xl font-bold pl-4 cursor-default">Bildgalleri</h1>
        </header>
        <nav className="flex h-full text-lg">
          <a onClick={() => setActiveTab("search")} className={`flex items-center px-4 cursor-pointer ${activeTab === "search" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Sök</a>
          <a onClick={() => setActiveTab("gallery")} className={`flex items-center px-4 cursor-pointer ${activeTab === "gallery" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Mitt galleri</a>
        </nav>
      </div>

      {activeTab === "search" && (
        <div className="flex flex-col">
          <h2>Sök efter bilder här</h2>
          <p>Ange en tagg för att söka efter matchande bilder</p>
          <div>
            <label htmlFor="search-field">Sökfält:</label>
            <input type="text" id="search-field" placeholder="Tagg..."></input>
          </div>
          <div>
            <ul id="image-list"></ul>
          </div>
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="flex flex-col">
          <h2>Mitt galleri</h2>
          <p>Här är dina sparade bilder</p>
          <div>
            <ul id="saved-image-list"></ul>
          </div>
        </div>
      )}
      <footer></footer>
    </div>
  );
}
