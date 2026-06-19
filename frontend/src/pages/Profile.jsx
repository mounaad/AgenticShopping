import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function Profile() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.put(`/api/users/${user.id}`, form);
            setSuccess('Profil mis a jour avec succes');
        } catch (err) {
            setError('Erreur lors de la mise a jour');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-beige-50">
            <Navbar cartCount={cartCount} />

            <main className="max-w-xl mx-auto px-8 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
                        Mon Profil
                    </h1>
                </div>

                {/* Infos readonly */}
                <div className="bg-white border border-beige-200 p-6 mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-dark-600 mb-1">Email</p>
                            <p className="text-sm text-dark-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-dark-600 mb-1">Role</p>
                            <span className="text-xs border border-dark-900 text-dark-900 px-3 py-1 uppercase tracking-wider">
                {user?.role}
              </span>
                        </div>
                    </div>
                </div>

                {/* Formulaire modification */}
                <div className="bg-white border border-beige-200 p-6 mb-6">
                    <h2 className="text-sm font-medium text-dark-900 uppercase tracking-wider mb-5">
                        Modifier mes informations
                    </h2>

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-dark-600 uppercase tracking-wider mb-1">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                className="w-full border border-beige-300 bg-beige-50 px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-dark-600 uppercase tracking-wider mb-1">
                                Telephone
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full border border-beige-300 bg-beige-50 px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-900 text-beige-50 py-3 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Mise a jour...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>

                {/* Deconnexion */}
                <button
                    onClick={handleLogout}
                    className="w-full border border-beige-300 text-dark-600 py-3 text-sm uppercase tracking-wider hover:border-dark-900 hover:text-dark-900 transition-colors"
                >
                    Se deconnecter
                </button>
            </main>
        </div>
    );
}