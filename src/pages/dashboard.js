// pages/dashboard.js

import Layout from '../components/Layout';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const Dashboard = () => {
    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-green-100">
                <h1 className="text-3xl font-bold">Bienvenido al Dashboard</h1>
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies.token || '';

    try {
        jwt.verify(token, SECRET_KEY);
        return { props: {} };
    } catch (error) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
};

export default Dashboard;
