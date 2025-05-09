'use client'

// This component represents an individual image card in the image grid
export function ImageCard({ image, onClick, isSelectionMode, isSelected, onSelect }) {
    const handleClick = () => {
        if (isSelectionMode) {
            onSelect(image); // Toggle selection
        } else {
            onClick(image); // Open modal if not in selection mode
        }
    };

    return (
        <div onClick={handleClick} className="image-card border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="h-75 w-full relative">
                <img src={image.src.large} alt={image.alt} className="object-cover h-full w-full transition-all duration-300" />
                {/* Adds a selection indicator if in selection mode */}
                {isSelectionMode && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-white cursor-pointer">
                        {isSelected && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}