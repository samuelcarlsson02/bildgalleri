'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setSearchResults(data.photos);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  }

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
          <div className="flex flex-col items-center justify-center h-full m-4">
            <h2 className="text-2xl font-bold mb-2 mt-6">Sök efter bilder</h2>
            <p className="mb-4">Ange en söktagg för att söka efter bilder som matchar</p>
            <div className="mb-6 w-full max-w-md">
              <input onChange={handleSearchInput} type="text" id="search-field" placeholder="Söktagg..." className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"></input>
            </div>
          </div>

          {isLoading && <p>Laddar...</p>}

          <div className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
            {searchResults.map((image) => (
              <div key={image.id} className="image-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="h-full w-full max-h-100">
                  <img src={image.src.large2x} alt={image.alt} className="object-cover h-full w-full transition-all duration-300" />
                </div>
              </div>
            ))}
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
