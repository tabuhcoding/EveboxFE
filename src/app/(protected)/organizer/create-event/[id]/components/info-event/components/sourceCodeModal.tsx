
import React from 'react';

interface SourceCodeModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sourceCode: string;
    setSourceCode: React.Dispatch<React.SetStateAction<string>>;
    handleSaveSourceCode: () => void;
}

export default function SourceCodeModal ({ isModalOpen, setIsModalOpen, sourceCode, setSourceCode, handleSaveSourceCode } : SourceCodeModalProps) {
    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                <div className="bg-white p-4 rounded-lg w-full max-w-3xl">
                    <h2 className="text-xl mb-4">Edit Source Code</h2>
                    <textarea
                        className="w-full h-60 p-2 border border-gray-300 rounded-lg"
                        value={sourceCode}
                        onChange={(e) => setSourceCode(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={handleSaveSourceCode}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};