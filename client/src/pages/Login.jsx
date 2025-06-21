import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import apiHost from '../components/utils/api';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${apiHost}/api/auth/login`, form);
            login(res.data);
            navigate('/budget-fix');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-5px shadow-custom w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 text-center bg-red-100 border border-red-300 px-3 py-2 rounded-5px">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-5px shadow-custom focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-5px shadow-custom focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-5px transition duration-200"
                >
                    Login
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">Register</a>
                </p>
            </form>
        </div>
    );
}

export default Login;