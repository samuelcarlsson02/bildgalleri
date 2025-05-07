'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  // Current active tab, either "search" or "gallery"
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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
  }, [activeTab])

  // Sets the loading state for the image when the modal is opened
  useEffect(() => {
    if (isModalOpen) {
      setIsImageLoading(true);
    }
  }, [isModalOpen]);

  // Function to perform the search with the given query
  const performSearch = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResults(data.photos);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect to perform the search when the search query changes and is longer than two characters
  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
    <div className="flex flex-col font-sans h-screen max-w-screen-xl mx-auto">
      {/* Header with title and navbar */}
      <div className="flex md:flex-row flex-col gap-2 justify-between items-center h-20 bg-gray-600 w-full border-b-2 border-white rounded-lg shadow-lg">
        <header>
          <h1 className="font-mono text-3xl font-bold pl-4 cursor-default">Bildgalleri</h1>
        </header>
        <nav className="flex md:flex-row h-full text-lg">
          <a onClick={() => setActiveTab("search")} className={`flex items-center px-4 cursor-pointer ${activeTab === "search" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Sök</a>
          <a onClick={() => setActiveTab("gallery")} className={`flex items-center px-4 cursor-pointer rounded-br-lg rounded-tr-lg ${activeTab === "gallery" ? "bg-gray-900" : "bg-gray-600 hover:bg-gray-800"}`}>Mitt galleri</a>
        </nav>
      </div>

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

          {/* Loading while searching */}
          {isLoading && (
            <div className="flex items-center justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          )}

          <div className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
            {searchResults.map((image) => (
              <div key={image.id} onClick={() => openModal(image)} className="image-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div onClick={() => toggleImageSelection(image)} className="h-75 w-full relative">
                  <img src={image.src.large} alt={image.alt} className="object-cover h-full w-full transition-all duration-300" />
                  {/* Adds a selection indicator if in selection mode */}
                  {isSelectionMode && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-white cursor-pointer">
                      {selectedImages.some(img => img.id === image.id) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for displaying image */}
      {isModalOpen && modalImage && (
        <div onClick={() => closeModal()} className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white rounded-lg p-4 m-4 max-w-[90vw] max-h-[90vh] flex flex-col">
            {/* Header section */}
            <div className="flex justify-between items-center mb-3">
              <div className="overflow-hidden">
                <h3 className="text-black font-medium text-lg">{modalImage.alt}</h3>
                <p className="text-gray-600 text-sm">Bild av: {modalImage.photographer}</p>
              </div>
            </div>

            {/* Image container */}
            <div className="flex-grow flex items-center justify-center overflow-hidden">
              {isImageLoading && (
                <div className="flex items-center justify-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
              <img src={modalImage.src.original} alt={modalImage.alt} className={`max-w-full max-h-[70vh] object-contain ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} onLoad={() => setIsImageLoading(false)} />
            </div>

            {/* Button section */}
            <div className="flex justify-between items-center mt-3">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors cursor-pointer">Stäng</button>
              <button onClick={addOrRemoveImageGallery} className={`px-4 py-2 ${isImageInGallery() ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors cursor-pointer`}>
                {isImageInGallery() ? 'Ta bort från galleri' : 'Lägg till i galleri'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My gallery tab */}
      {activeTab === "gallery" && (
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center h-full m-4">
            <h2 className="text-2xl font-bold mb-2 mt-6">Mitt galleri</h2>
            <p className="mb-4">Här är alla dina sparade bilder</p>

            {gallery.length > 0 && (
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
            )}
          </div>

          <div className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
            {gallery.map((image) => (
              <div key={image.id} onClick={() => openModal(image)} className="image-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div onClick={() => toggleImageSelection(image)} className="h-75 w-full relative">
                  <img src={image.src.large} alt={image.alt} className="object-cover h-full w-full transition-all duration-300" />
                  {isSelectionMode && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-white cursor-pointer">
                      {selectedImages.some(img => img.id === image.id) && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer with Pexels credit */}
      <footer className="mt-auto py-4 text-center w-full">
        Bilderna är från <a href="https://www.pexels.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Pexels</a>
      </footer>
    </div>
  );
}
