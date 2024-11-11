// src/components/Notification.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Se puede agregar el proveedor para las notificaciones si no se ha añadido
import { ToastContainer } from 'react-toastify';

// Funciones para mostrar las notificaciones
export const showSuccessNotification = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
  });
};

export const showErrorNotification = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
  });
};

// El componente Notification incluirá el contenedor de Toast
const Notification = () => {
  return <ToastContainer />;
};

export default Notification;
