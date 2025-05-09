'use client'

// Loading spinner component
export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
    );
}