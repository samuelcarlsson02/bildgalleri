'use client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageGrid } from '../components/ImageGrid';
import { ImageModal } from '../components/ImageModal';
import { Header } from '../components/Header';
import { useEffect, useState } from 'react';
import { useGallery } from '../hooks/useGallery';

// Main component for the home page
export default function Home() {
  const [activeTab, setActiveTab] = useState("search"); // Current active tab, either "search" or "gallery"
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Debounced search query to avoid too many API calls

  // Custom hook to manage everything related to the gallery
  const {
    modalImage,
    isModalOpen,
    gallery,
    selectedImages,
    isSelectionMode,
    openModal,
    closeModal,
    addOrRemoveImageGallery,
    toggleSelectionMode,
    toggleImageSelection,
    addSelectedToGallery,
    removeSelectedFromGallery,
    resetSelections,
    isImageInGallery
  } = useGallery();

  // Clears the search results, selected images and selection mode when switching tabs
  useEffect(() => {
    setSearchResults([]);
    resetSelections();
    setSearchQuery('');
  }, [activeTab])

  // Debounces the search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
      }
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce time
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Function to perform the search with the given query
  const performSearch = async (query) => {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResults(data.photos);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert("Ett fel inträffade vid hämtning av bilder. Vänligen försök igen senare.");
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect to perform the search when the debounced search query changes and is longer than two characters
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setSearchResults([]);
      resetSelections();
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // Function to handle the search input change
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="flex flex-col font-sans h-screen">
      {/* Header with title and navbar */}
      <Header title="Bildgalleri" activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <div className="flex flex-col h-full max-w-screen-xl mx-auto">
        {/* Search tab */}
        {activeTab === "search" && (
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center h-full m-4">
              <h2 className="text-2xl font-bold mb-2 mt-6">Sök efter bilder</h2>
              <p className="mb-4">Ange en söktagg för att söka efter bilder som matchar</p>
              <div className="mb-6 w-full max-w-md">
                <input onChange={handleSearchInput} type="text" id="search-field" placeholder="Söktagg..." className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"></input>
              </div>

              {/* Ability to select multiple images */}
              {searchResults.length > 0 && (
                <div className="flex justify-between items-center w-full">
                  <button onClick={toggleSelectionMode} className={`px-4 py-2 rounded ${isSelectionMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 text-black hover:bg-gray-400'} cursor-pointer`}>
                    {isSelectionMode ? 'Avbryt val' : 'Välj flera bilder'}
                  </button>

                  {isSelectionMode && (
                    <div>
                      <span className="mr-2">{selectedImages.length} bilder valda</span>
                      <button onClick={addSelectedToGallery} disabled={selectedImages.length === 0} className={`px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white ${selectedImages.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        Lägg till i galleri
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {debouncedQuery.length > 2 && searchResults.length === 0 && !isLoading && (
              <div className="flex items-center justify-center my-8">
                <p className="text-gray-600 text-3xl">Inga bilder hittades...</p>
              </div>
            )}

            {/* Loading while searching */}
            {isLoading && <LoadingSpinner />}

            <ImageGrid
              images={searchResults}
              onImageClick={openModal}
              isSelectionMode={isSelectionMode}
              selectedImages={selectedImages}
              onSelect={toggleImageSelection}
            />
          </div>
        )}

        {/* Modal for displaying image */}
        <ImageModal
          image={modalImage}
          isOpen={isModalOpen}
          onClose={closeModal}
          addOrRemoveImageGallery={() => addOrRemoveImageGallery(activeTab)}
          isInGallery={modalImage ? isImageInGallery() : false}
        />

        {/* My gallery tab */}
        {activeTab === "gallery" && (
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center h-full m-4">
              <h2 className="text-2xl font-bold mb-2 mt-6">Mitt galleri</h2>
              <p className="mb-4">Här är alla dina sparade bilder</p>

              {gallery.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <button onClick={toggleSelectionMode} className={`px-4 py-2 rounded ${isSelectionMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 text-black hover:bg-gray-400'} cursor-pointer`}>
                    {isSelectionMode ? 'Avbryt val' : 'Välj flera bilder'}
                  </button>

                  {isSelectionMode && (
                    <div>
                      <span className="mr-2">{selectedImages.length} bilder valda</span>
                      <button onClick={removeSelectedFromGallery} disabled={selectedImages.length === 0} className={`px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ${selectedImages.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        Ta bort från galleri
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center my-8">
                  <p className="text-gray-600 text-3xl">Inga bilder är sparade till ditt galleri...</p>
                </div>
              )}
            </div>

            <ImageGrid
              images={gallery}
              onImageClick={openModal}
              isSelectionMode={isSelectionMode}
              selectedImages={selectedImages}
              onSelect={toggleImageSelection}
            />
          </div>
        )}

        {/* Footer with Pexels credit */}
        <footer className="mt-auto py-4 text-center w-full">
          Bilderna är från <a href="https://www.pexels.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Pexels</a>
        </footer>
      </div>
    </div>
  );
}
