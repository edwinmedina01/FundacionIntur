import React from "react";

const ModalConfirmacion = ({ 
  id,
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = "Confirmar Acción", 
  mensaje = "¿Estás seguro de realizar esta acción?", 
  entidad = "", 
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "bg-red-600 hover:bg-red-700" // Color por defecto para eliminar
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        <p className="text-gray-600 mt-2">
          {mensaje} <strong>{entidad}</strong>?
        </p>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2 hover:bg-gray-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg ${confirmColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
