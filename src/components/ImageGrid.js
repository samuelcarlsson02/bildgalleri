'use client'
import { ImageCard } from "./ImageCard"

// The ImageGrid component displays a grid of images using the ImageCard component
export function ImageGrid({ images, onImageClick, isSelectionMode, selectedImages, onSelect }) {
    return (
        <div className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
            {images.map((image) => (
                <ImageCard
                    key={image.id}
                    image={image}
                    onClick={onImageClick}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedImages.some((selectedImage) => selectedImage.id === image.id)}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}