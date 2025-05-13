import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageGrid } from '../components/ImageGrid';

// Mocks the ImageCard component
jest.mock('../components/ImageCard', () => ({
    ImageCard: ({ image, onClick, isSelectionMode, isSelected, onSelect }) => (
        <div
            data-testid={`image-card-${image.id}`}
            data-image-id={image.id}
            data-is-selected={isSelected}
            data-is-selection-mode={isSelectionMode}
            onClick={() => onClick && onClick(image)}
        >
            {/* Adds a button to test selection functionality */}
            {isSelectionMode && (
                <button data-testid={`select-button-${image.id}`} onClick={(e) => { e.stopPropagation(); onSelect && onSelect(image); }}>
                    Select
                </button>
            )}
            Mock ImageCard {image.title}
        </div>
    )
}));

describe('ImageGrid Component', () => {
    // Test data
    const mockImages = [
        { id: '1', title: 'Image 1', url: 'https://example.com/image1.png' },
        { id: '2', title: 'Image 2', url: 'https://example.com/image2.png' },
        { id: '3', title: 'Image 3', url: 'https://example.com/image3.png' }
    ];

    // Mock functions
    const mockOnImageClick = jest.fn();
    const mockOnSelect = jest.fn();

    beforeEach(() => {
        // Clears mock function calls between tests
        mockOnImageClick.mockClear();
        mockOnSelect.mockClear();
    });

    test('renders no images when images array is empty', () => {
        render(
            <ImageGrid
                images={[]}
                onImageClick={mockOnImageClick}
                isSelectionMode={false}
                selectedImages={[]}
                onSelect={mockOnSelect}
            />
        );

        // Checks that no image cards are rendered
        expect(screen.queryByTestId(/^image-card-/)).not.toBeInTheDocument();
    });

    test('renders the correct number of images', () => {
        render(
            <ImageGrid
                images={mockImages}
                onImageClick={mockOnImageClick}
                isSelectionMode={false}
                selectedImages={[]}
                onSelect={mockOnSelect}
            />
        );

        // Checks if all images are rendered
        mockImages.forEach(image => {
            expect(screen.getByTestId(`image-card-${image.id}`)).toBeInTheDocument();
        });
    });

    test('clicking an image calls onImageClick', () => {
        render(
            <ImageGrid
                images={mockImages}
                onImageClick={mockOnImageClick}
                isSelectionMode={false}
                selectedImages={[]}
                onSelect={mockOnSelect}
            />
        );

        // Clicks on the first image
        fireEvent.click(screen.getByTestId('image-card-1'));

        // Checks if the click handler was called with the correct image
        expect(mockOnImageClick).toHaveBeenCalledTimes(1);
        expect(mockOnImageClick).toHaveBeenCalledWith(mockImages[0]);
    });

    test('renders selection correctly', () => {
        const selectedImages = [mockImages[0]]; // First image is selected

        render(
            <ImageGrid
                images={mockImages}
                onImageClick={mockOnImageClick}
                isSelectionMode={true}
                selectedImages={selectedImages}
                onSelect={mockOnSelect}
            />
        );

        // Checks that selection mode is passed to ImageCard components
        expect(screen.getByTestId('image-card-1')).toHaveAttribute('data-is-selection-mode', 'true');
        expect(screen.getByTestId('image-card-1')).toHaveAttribute('data-is-selected', 'true');
        expect(screen.getByTestId('image-card-2')).toHaveAttribute('data-is-selected', 'false'); // Second image is not selected
    });

    test('clicking an image in selection mode calls onSelect', () => {
        render(
            <ImageGrid
                images={mockImages}
                onImageClick={mockOnImageClick}
                isSelectionMode={true}
                selectedImages={[]}
                onSelect={mockOnSelect}
            />
        );

        // Clicks the select button on the first image
        fireEvent.click(screen.getByTestId('select-button-1'));

        // Checks if onSelect was called with the correct image
        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockImages[0]);
        expect(mockOnImageClick).not.toHaveBeenCalled(); // Ensures onImageClick was not called
    });
});