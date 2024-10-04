import Link from 'next/link';

const Layout = ({ children }) => {
    return (
        <div>
            <nav className="bg-blue-500 p-4">
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            Login
                        </Link>
                    </li>
                    {/* Agrega más enlaces según necesites */}
                </ul>
            </nav>
            <main>{children}</main>
            <footer className="bg-gray-200 p-4 text-center">
                © 2024 Tu Empresa
            </footer>
        </div>
    );
};

export default Layout;
