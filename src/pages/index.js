import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.title = "Gestión Académica - Login";
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
