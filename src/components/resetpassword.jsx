import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [username, setUsername] = useState(''); // Nuevo estado para el nombre de usuario
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSuccess('');
      return;
    }

    // Lógica para enviar la solicitud al backend
    try {
      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }), // Enviar el nombre de usuario y la nueva contraseña
        credentials: 'include', // Importante para enviar cookies
      });

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        setError('');
        setShowModal(true); // Mostrar el modal de éxito
      } else {
        const data = await response.json();
        setError(data.message || 'Hubo un error al actualizar la contraseña');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error en la solicitud:', err); // Registro del error para depuración
      setError('Hubo un error con la solicitud');
      setSuccess('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      router.push('/'); // Redirigir después de cerrar el modal
    }, 500); // Esperar un breve momento antes de redirigir
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-blue-700">Restablecer Contraseña</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre de Usuario *</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ textTransform: 'uppercase' }} // Convertir a mayúsculas
            />
          </div>
          <div>
            <label className="block text-gray-700">Nueva Contraseña *</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirmar Nueva Contraseña *</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            Restablecer Contraseña
          </button>
        </form>

        {/* Modal de éxito */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="w-full max-w-sm p-8 space-y-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-center text-green-600">¡Éxito!</h3>
              <p className="text-center text-gray-700">{success}</p>
              <div className="flex justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
