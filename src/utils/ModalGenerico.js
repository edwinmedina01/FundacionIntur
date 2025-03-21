import React from "react";

const ModalGenerico = ({ 
  id,
  isOpen, 
  onClose, 
  titulo = "Título del Modal", 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[480px] relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg"
        >
          ✖️
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          {titulo}
        </h2>

        {/* Contenedor del contenido con scroll si excede */}
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalGenerico;
