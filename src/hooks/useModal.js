import { useState } from "react";

const useModal = () => {
  const [modals, setModals] = useState({});

  // 🔹 Mostrar un modal específico por su ID
  const showModal = (id) => {
    setModals((prev) => ({ ...prev, [id]: true }));
  };

  // 🔹 Ocultar un modal específico por su ID
  const closeModal = (id) => {
    setModals((prev) => ({ ...prev, [id]: false }));
  };

  return { modals, showModal, closeModal };
};

export default useModal;
