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
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
        {/* Botón de cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖️
        </button>

        {/* Título del Modal */}
        <h2 className="text-xl font-semibold text-gray-800 text-center">{titulo}</h2>

        {/* Contenido dinámico del modal */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalGenerico;
