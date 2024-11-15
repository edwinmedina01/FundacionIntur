// pages/_app.js

 import '../styles/global.css'
import { AuthProvider } from '../context/AuthContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Importa los estilos de nprogress
import { useEffect } from 'react';
import { useRouter } from 'next/router';
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Iniciar nprogress en el cambio de ruta
    const handleStart = () => NProgress.start();
    // Finalizar nprogress cuando la ruta se carga o si hay un error
    const handleStop = () => NProgress.done();

    // Suscribirse a los eventos de enrutamiento de Next.js
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    // Limpia los eventos al desmontar el componente
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default MyApp
