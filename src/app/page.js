'use client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageGrid } from '../components/ImageGrid';
import { ImageModal } from '../components/ImageModal';
import { Header } from '../components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  // Current active tab, either "search" or "gallery"
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Loads the gallery from local storage when the page loads
  useEffect(() => {
    const gallery = JSON.parse(localStorage.getItem("gallery")) || [];
    setGallery(gallery);
  }, []);

  // Clears the search results, selected images and selection mode when switching tabs
  useEffect(() => {
    setSearchResults([]);
    setSelectedImages([]);
    setIsSelectionMode(false);
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
      setSelectedImages([]);
      setIsSelectionMode(false);
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // Function to handle the search input change
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  }

  // Function to open the modal with the selected image
  const openModal = (image) => {
    if (!isSelectionMode) {
      setModalImage(image);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden'; // Stops the ability to scroll
    }
  }

  // Function to close the modal
  const closeModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Enables scrolling
  }

  // Adds/removes the selected image to/from the gallery
  const addOrRemoveImageGallery = () => {
    if (isImageInGallery()) {
      const updatedGallery = gallery.filter((image) => image.id !== modalImage.id);
      setGallery(updatedGallery);
      localStorage.setItem("gallery", JSON.stringify(updatedGallery));
      // Closes the modal automatically only when removing an image from gallery
      closeModal();
    } else {
      const updatedGallery = [...gallery, modalImage];
      setGallery(updatedGallery);
      localStorage.setItem("gallery", JSON.stringify(updatedGallery));
    }
  }

  // Checks if image already in gallery by using image id
  const isImageInGallery = () => {
    return gallery.some((image) => image.id === modalImage.id);
  }

  // Toggles the selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedImages([]);
  }

  // Toggles the selection of an image
  const toggleImageSelection = (image) => {
    if (selectedImages.some(img => img.id === image.id)) {
      setSelectedImages(selectedImages.filter(img => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  }

  // Add multiple images to gallery
  const addSelectedToGallery = () => {
    // Filter out images that are already in gallery
    const newImages = selectedImages.filter(image => !gallery.some(img => img.id === image.id));

    if (newImages.length === 0) {
      alert("Alla valda bilder finns redan i ditt galleri");
      return;
    }

    // Add old and new images to an updated gallery
    const updatedGallery = [...gallery, ...newImages];
    setGallery(updatedGallery);
    localStorage.setItem("gallery", JSON.stringify(updatedGallery));

    // Reset selection
    setSelectedImages([]);
    setIsSelectionMode(false);
    alert(`${newImages.length} bilder har lagts till i ditt galleri!`);
  };

  // Removes selected images from gallery
  const removeSelectedFromGallery = () => {
    const updatedGallery = gallery.filter((image) => !selectedImages.some(img => img.id === image.id));
    setGallery(updatedGallery);
    localStorage.setItem("gallery", JSON.stringify(updatedGallery));

    // Reset selection
    setSelectedImages([]);
    setIsSelectionMode(false);
    alert(`${selectedImages.length} bilder har tagits bort från ditt galleri!`);
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
          addOrRemoveImageGallery={addOrRemoveImageGallery}
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
