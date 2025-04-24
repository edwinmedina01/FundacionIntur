import React from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline"; // Asegurate que tienes Heroicons instalados

const LoadingOverlay = ({ loading, setLoading, message = "Por favor espere..." }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white relative rounded-xl shadow-lg px-8 py-6 flex flex-col items-center space-y-4">
        {/* Botón de cierre */}
       
          <button
            onClick={() => setLoading(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
  

        <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-700 font-medium text-base">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
