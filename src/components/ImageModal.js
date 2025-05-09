'use client'
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

// This component represents a modal that displays a larger version of an image
export function ImageModal({ image, isOpen, onClose, addOrRemoveImageGallery, isInGallery }) {
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Sets the loading state for the image when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setIsImageLoading(true);
            document.body.style.overflow = "hidden"; // Stops the ability to scroll
        }
        return () => {
            document.body.style.overflow = "auto"; // Enables scrolling
        };
    }, [isOpen]);

    if (!image || !isOpen) return null; // If no image is provided or the modal is not open, return null

    return (
        <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-white rounded-lg p-4 m-4 max-w-[90vw] max-h-[90vh] flex flex-col">
                {/* Header section */}
                <div className="flex justify-between items-center mb-3">
                    <div className="overflow-hidden">
                        <h3 className="text-black font-medium text-lg">{image.alt}</h3>
                        <p className="text-gray-600 text-sm">Bild av: {image.photographer}</p>
                    </div>
                </div>

                {/* Image container */}
                <div className="flex-grow flex items-center justify-center overflow-hidden">
                    {isImageLoading && <LoadingSpinner />}
                    <img src={image.src.original} alt={image.alt} className={`max-w-full max-h-[70vh] object-contain ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} onLoad={() => setIsImageLoading(false)} />
                </div>

                {/* Button section */}
                <div className="flex justify-between items-center mt-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors cursor-pointer">Stäng</button>
                    <button onClick={addOrRemoveImageGallery} className={`px-4 py-2 ${isInGallery ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors cursor-pointer`}>
                        {isInGallery ? 'Ta bort från galleri' : 'Lägg till i galleri'}
                    </button>
                </div>
            </div>
        </div>
    );
}