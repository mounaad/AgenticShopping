import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Landing() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get('/api/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Erreur chargement produits', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50">

            {/* Header public */}
            <header className="bg-white border-b border-beige-200 px-8 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-light tracking-widest text-dark-900 uppercase">
                        AgenticShopping
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm text-dark-600 uppercase tracking-wider hover:text-dark-900 transition-colors"
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-sm bg-dark-900 text-beige-50 px-5 py-2 uppercase tracking-wider hover:bg-dark-700 transition-colors"
                        >
                            S'inscrire
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-dark-900 text-beige-50 py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs uppercase tracking-widest text-beige-300 mb-4">
                        Plateforme intelligente
                    </p>
                    <h2 className="text-4xl font-light tracking-wide mb-4">
                        Votre assistant shopping
                    </h2>
                    <p className="text-beige-300 text-sm max-w-md mb-8 leading-relaxed">
                        Decrivez ce que vous cherchez en langage naturel. Notre agent IA trouve,
                        compare et commande pour vous.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-beige-50 text-dark-900 px-6 py-3 text-sm uppercase tracking-wider hover:bg-beige-200 transition-colors"
                        >
                            Commencer
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="border border-beige-300 text-beige-50 px-6 py-3 text-sm uppercase tracking-wider hover:border-beige-50 transition-colors"
                        >
                            Se connecter
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-14 px-8 border-b border-beige-200">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Assistant IA',
                            desc: 'Decrivez votre besoin en langage naturel et laissez l\'agent trouver les meilleurs produits.'
                        },
                        {
                            title: 'Mode automatique',
                            desc: 'L\'agent peut ajouter au panier et commander automatiquement selon vos preferences.'
                        },
                        {
                            title: 'Transparence totale',
                            desc: 'Chaque decision de l\'agent est expliquee et consultable dans votre historique.'
                        },
                    ].map(({ title, desc }) => (
                        <div key={title} className="border-l-2 border-dark-900 pl-5">
                            <h3 className="text-sm font-medium text-dark-900 uppercase tracking-wider mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-dark-600 leading-relaxed">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Catalogue public */}
            <section className="py-12 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-light text-dark-900 uppercase tracking-widest">
                            Nos produits
                        </h2>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs text-dark-600 uppercase tracking-wider underline underline-offset-2 hover:text-dark-900"
                        >
                            Voir tout apres connexion
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-sm text-dark-600 animate-pulse">Chargement...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {products.slice(0, 8).map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white border border-beige-200 p-5"
                                >
                                    <div className="bg-beige-100 h-40 w-full mb-3 flex items-center justify-center">
                    <span className="text-xs text-dark-600 uppercase tracking-wider">
                      {product.category || 'Produit'}
                    </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-dark-900 mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-dark-900 font-medium mb-3">
                                        {product.price} dh
                                    </p>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full text-xs border border-dark-900 text-dark-900 py-2 uppercase tracking-wider hover:bg-dark-900 hover:text-beige-50 transition-colors"
                                    >
                                        Ajouter au panier
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-beige-200 py-16 px-8 text-center">
                <h2 className="text-2xl font-light text-dark-900 uppercase tracking-widest mb-4">
                    Pret a commencer ?
                </h2>
                <p className="text-sm text-dark-600 mb-8">
                    Creez votre compte et profitez de votre assistant shopping personnel.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-dark-900 text-beige-50 px-8 py-3 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors"
                >
                    Creer un compte gratuitement
                </button>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-beige-200 px-8 py-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-light text-dark-900 uppercase tracking-widest">
            AgenticShopping
          </span>
                    <span className="text-xs text-dark-600">
            2026 — Plateforme e-commerce intelligente
          </span>
                </div>
            </footer>
        </div>
    );
}