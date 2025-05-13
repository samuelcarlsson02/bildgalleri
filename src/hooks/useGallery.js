'use client'

import { useState, useEffect } from "react";

// Custom hook to manage everything related to the gallery
export function useGallery() {
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
    const addOrRemoveImageGallery = (activeTab) => {
        if (isImageInGallery()) {
            const updatedGallery = gallery.filter((image) => image.id !== modalImage.id);
            setGallery(updatedGallery);
            localStorage.setItem("gallery", JSON.stringify(updatedGallery));
            // Closes the modal automatically only when removing an image from gallery in the gallery tab
            if (activeTab === "gallery") {
                closeModal();
            }
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

    const resetSelections = () => {
        setSelectedImages([]);
        setIsSelectionMode(false);
    }

    return {
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
    };
}