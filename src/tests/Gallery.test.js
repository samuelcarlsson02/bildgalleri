import { renderHook, act } from '@testing-library/react';
import { useGallery } from '../hooks/useGallery';

// Test data
const mockImage1 = { id: '1', src: { medium: 'image1.jpg' }, alt: 'Test Image 1', photographer: 'Photographer 1' };
const mockImage2 = { id: '2', src: { medium: 'image2.jpg' }, alt: 'Test Image 2', photographer: 'Photographer 2' };
const mockImage3 = { id: '3', src: { medium: 'image3.jpg' }, alt: 'Test Image 3', photographer: 'Photographer 3' };

describe('useGallery Hook', () => {
    // Mocks window.alert before running any tests
    beforeAll(() => {
        window.alert = jest.fn();
    });

    // Clears localStorage and mock function calls between tests
    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(Storage.prototype, 'setItem');
        jest.spyOn(Storage.prototype, 'getItem');
        jest.clearAllMocks();
        window.alert.mockClear();
    });

    afterEach(() => {
        localStorage.setItem.mockRestore();
        localStorage.getItem.mockRestore();
    });

    test('loads empty gallery from localStorage initially', () => {
        // Mocks localStorage to return null (empty gallery)
        localStorage.getItem.mockReturnValueOnce(null);

        const { result } = renderHook(() => useGallery());

        // Checks if gallery is empty
        expect(result.current.gallery).toEqual([]);
        expect(localStorage.getItem).toHaveBeenCalledWith('gallery');
    });

    test('loads existing gallery from localStorage', () => {
        // Sets initial gallery in localStorage containing two images
        const existingGallery = [mockImage1, mockImage2];
        localStorage.getItem.mockReturnValueOnce(JSON.stringify(existingGallery));

        const { result } = renderHook(() => useGallery());

        // Checks if gallery is loaded correctly
        expect(result.current.gallery).toEqual(existingGallery);
    });

    test('adds image to gallery and updates localStorage', () => {
        // Sets empty gallery
        localStorage.getItem.mockReturnValueOnce(JSON.stringify([]));

        const { result } = renderHook(() => useGallery());

        // Sets image to add to gallery
        act(() => {
            result.current.openModal(mockImage1);
        });

        // Adds the image to the gallery
        act(() => {
            result.current.addOrRemoveImageGallery();
        });

        // Verifies localStorage was updated with the new image
        expect(localStorage.setItem).toHaveBeenCalledWith('gallery', JSON.stringify([mockImage1]));
        expect(result.current.gallery).toContainEqual(mockImage1);
    });

    test('removes image from gallery and updates localStorage', () => {
        // Sets gallery containing one image
        const initialGallery = [mockImage1];
        localStorage.getItem.mockReturnValueOnce(JSON.stringify(initialGallery));

        const { result } = renderHook(() => useGallery());

        // Sets image to be removed
        act(() => {
            result.current.openModal(mockImage1);
        });

        // Verifies image is in gallery before removal
        expect(result.current.gallery).toEqual([mockImage1]);

        // Removes the image
        act(() => {
            result.current.addOrRemoveImageGallery();
        });

        // Verifies the image was removed
        expect(localStorage.setItem).toHaveBeenCalledWith('gallery', JSON.stringify([]));
        expect(result.current.gallery).toEqual([]);
    });

    test('adds multiple selected images to gallery', () => {
        // Sets empty gallery
        localStorage.getItem.mockReturnValueOnce(JSON.stringify([]));

        const { result } = renderHook(() => useGallery());

        // Enables selection mode
        act(() => {
            result.current.toggleSelectionMode();
        });

        // Selects first image
        act(() => {
            result.current.toggleImageSelection(mockImage1);
        });

        // Selects second image
        act(() => {
            result.current.toggleImageSelection(mockImage2);
        });

        // Verifies both images are selected
        expect(result.current.selectedImages).toHaveLength(2);

        // Adds selected images to gallery
        act(() => {
            result.current.addSelectedToGallery();
        });

        // Verifies both images were added to the gallery
        expect(result.current.gallery).toContainEqual(mockImage1);
        expect(result.current.gallery).toContainEqual(mockImage2);
        expect(result.current.gallery).toHaveLength(2);

        // Verifies alert and state reset
        expect(window.alert).toHaveBeenCalledWith('2 bilder har lagts till i ditt galleri!');
        expect(result.current.selectedImages).toEqual([]);
        expect(result.current.isSelectionMode).toBe(false);
    });

    test('removes multiple selected images from gallery', () => {
        // Sets up gallery containing three images
        const initialGallery = [mockImage1, mockImage2, mockImage3];
        localStorage.getItem.mockReturnValueOnce(JSON.stringify(initialGallery));

        const { result } = renderHook(() => useGallery());

        // Enables selection mode
        act(() => {
            result.current.toggleSelectionMode();
        });

        // Selects first image to remove
        act(() => {
            result.current.toggleImageSelection(mockImage1);
        });

        // Selects second image to remove
        act(() => {
            result.current.toggleImageSelection(mockImage2);
        });

        // Verifies both images are selected
        expect(result.current.selectedImages).toHaveLength(2);

        // Removes selected images from gallery
        act(() => {
            result.current.removeSelectedFromGallery();
        });

        // Verifies only the remaining image is in the gallery
        expect(result.current.gallery).toHaveLength(1);
        expect(result.current.gallery).toContainEqual(mockImage3);
        expect(result.current.gallery).not.toContainEqual(mockImage1);
        expect(result.current.gallery).not.toContainEqual(mockImage2);

        // Verifies alert and state reset
        expect(window.alert).toHaveBeenCalledWith('2 bilder har tagits bort från ditt galleri!');
        expect(result.current.selectedImages).toEqual([]);
        expect(result.current.isSelectionMode).toBe(false);
    });

    test('does not add duplicate images to gallery', () => {
        // Sets gallery containing one image
        const initialGallery = [mockImage1];
        localStorage.getItem.mockReturnValueOnce(JSON.stringify(initialGallery));

        const { result } = renderHook(() => useGallery());

        // Selects the image already in the gallery
        act(() => {
            result.current.toggleImageSelection(mockImage1);
        });

        // Tries to add image to gallery
        act(() => {
            result.current.addSelectedToGallery();
        });

        // Verifies alert was shown for duplicate
        expect(window.alert).toHaveBeenCalledWith('Alla valda bilder finns redan i ditt galleri');
        expect(result.current.gallery).toEqual([mockImage1]); // No change in gallery
    });
});