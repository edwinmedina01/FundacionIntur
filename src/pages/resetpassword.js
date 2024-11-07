import { useEffect } from 'react';
import ResetPassword from '../components/resetpassword'; // Asegúrate de que la ruta sea correcta

export default function ResetPasswordPage() {
  useEffect(() => {
    // Cambiar el título del documento
    document.title = 'Restablecer Contraseña';
  }, []); // El array vacío significa que esto solo se ejecutará una vez al montar el componente

  return (
    <div>
      <ResetPassword />
    </div>
  );
}
