import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    document.title = "Gestión Académica - Login";
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
