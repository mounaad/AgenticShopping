import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(form.email, form.password);
            if (user.role === 'ADMIN') navigate('/admin');
            else navigate('/home');  // ← /home au lieu de /
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50 flex items-center justify-center">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-light tracking-widest text-dark-900 uppercase">
                        AgenticShopping
                    </h1>
                    <p className="text-sm text-dark-600 mt-2 font-light">
                        Votre assistant shopping intelligent
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-beige-200 p-8">
                    <h2 className="text-lg font-medium text-dark-900 mb-6">
                        Connexion
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-dark-600 uppercase tracking-wider mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-beige-300 bg-beige-50 px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-dark-600 uppercase tracking-wider mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-beige-300 bg-beige-50 px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-900 text-beige-50 py-3 text-sm font-medium uppercase tracking-wider hover:bg-dark-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-dark-600 mt-6">
                        Pas de compte ?{' '}
                        <Link to="/register" className="text-dark-900 underline underline-offset-2">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}