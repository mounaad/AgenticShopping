import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount = 0 }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-beige-200 px-8 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-light tracking-widest text-dark-900 uppercase">
                    AgenticShopping
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-sm text-dark-600 hover:text-dark-900 uppercase tracking-wider transition-colors"
                    >
                        Catalogue
                    </Link>

                    <Link
                        to="/chat"
                        className="text-sm text-dark-600 hover:text-dark-900 uppercase tracking-wider transition-colors"
                    >
                        Assistant
                    </Link>

                    <Link
                        to="/orders"
                        className="text-sm text-dark-600 hover:text-dark-900 uppercase tracking-wider transition-colors"
                    >
                        Commandes
                    </Link>

                    <Link
                        to="/profile"
                        className="text-sm text-dark-600 hover:text-dark-900 uppercase tracking-wider transition-colors"
                    >
                        Profil
                    </Link>

                    {user?.role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className="text-sm text-dark-600 hover:text-dark-900 uppercase tracking-wider transition-colors"
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">

                    {/* Panier */}
                    <Link to="/cart" className="relative text-sm text-dark-900 uppercase tracking-wider">
                        Panier
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-4 bg-dark-900 text-beige-50 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
                        )}
                    </Link>

                    {/* User */}
                    <div className="flex items-center gap-4">
            <span className="text-sm text-dark-600">
              {user?.fullName?.split(' ')[0]}
            </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-dark-600 hover:text-dark-900 uppercase tracking-wider underline underline-offset-2 transition-colors"
                        >
                            Deconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}