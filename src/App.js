import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import ReactLoading from 'react-loading';  // Importa la librería de carga
import { ToastContainer, toast } from 'react-toastify';  // Importa las notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de las notificaciones


function App() {
  const [isLoading, setIsLoading] = useState(false);  // Estado para saber si está cargando

  // Función que simula una solicitud asincrónica
  const handleRequest = async () => {
    setIsLoading(true);  // Activa el loading
    try {
      // Simulando una operación asincrónica (como una llamada API)
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve('Operación exitosa'), 2000)
      );
      toast.success(response);  // Notificación de éxito
    } catch (error) {
      toast.error('Hubo un error');  // Notificación de error
    } finally {
      setIsLoading(false);  // Detiene el loading
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
