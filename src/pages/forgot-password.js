import { useState } from 'react';
import Link from 'next/link';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica para enviar el email de recuperación de contraseña
    try {
      setMessage('Se ha enviado un correo con las instrucciones para restablecer la contraseña.');
    } catch (error) {
      setMessage('Hubo un error, por favor intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h1>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Enviar instrucciones
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" legacyBehavior>
            <a className="text-gray-500 hover:underline">Regresar al login</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
