import Link from 'next/link';

const ForgotPasswordLink = () => {
  return (
    <div className="text-center mt-4">
      <Link href="/forgot-password">
        <a className="text-blue-500 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;
