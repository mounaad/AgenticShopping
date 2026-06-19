import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(form);
            navigate('/login');
        } catch (err) {
            setError('Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50 flex items-center justify-center">
            <div className="w-full max-w-md">

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-light tracking-widest text-dark-900 uppercase">
                        AgenticShopping
                    </h1>
                </div>

                <div className="bg-white border border-beige-200 p-8">
                    <h2 className="text-lg font-medium text-dark-900 mb-6">
                        Créer un compte
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { key: 'fullName', label: 'Nom complet', type: 'text', placeholder: 'A Test' },
                            { key: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
                            { key: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
                            { key: 'phone', label: 'Téléphone', type: 'tel', placeholder: '0600000000' },
                        ].map(({ key, label, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-xs font-medium text-dark-600 uppercase tracking-wider mb-1">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full border border-beige-300 bg-beige-50 px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                                    placeholder={placeholder}
                                    required={key !== 'phone'}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-900 text-beige-50 py-3 text-sm font-medium uppercase tracking-wider hover:bg-dark-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Inscription...' : "S'inscrire"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-dark-600 mt-6">
                        Déjà un compte ?{' '}
                        <Link to="/login" className="text-dark-900 underline underline-offset-2">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}