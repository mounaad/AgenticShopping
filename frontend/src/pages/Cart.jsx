// src/pages/Cart.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Cart() {
    const { cart, cartCount, removeFromCart, clearCart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const total = cart?.items?.reduce(
        (sum, item) => sum + item.price * item.quantity, 0) || 0;

    const handleOrder = async () => {
        if (!cart?.items?.length) return;
        setLoading(true);
        setError('');
        try {
            await api.post(
                `/api/orders/${user.id}/place`,
                null,
                { params: { paymentMethod } }
            );
            await clearCart();
            navigate('/orders');
        } catch (err) {
            setError('Erreur lors de la commande');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50">
            <Navbar cartCount={cartCount} />

            <main className="max-w-3xl mx-auto px-8 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
                        Panier
                    </h1>
                    <p className="text-sm text-dark-600 mt-1">
                        {cart?.items?.length || 0} article{cart?.items?.length > 1 ? 's' : ''}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {!cart?.items?.length ? (
                    <div className="text-center py-20 border border-beige-200 bg-white">
                        <p className="text-sm text-dark-600 uppercase tracking-wider mb-4">
                            Votre panier est vide
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs bg-dark-900 text-beige-50 px-6 py-3 uppercase tracking-wider hover:bg-dark-700 transition-colors"
                        >
                            Voir le catalogue
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                        {/* Items */}
                        <div className="bg-white border border-beige-200">
                            {cart.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between px-6 py-4 ${
                                        index < cart.items.length - 1 ? 'border-b border-beige-200' : ''
                                    }`}
                                >
                                    <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-dark-900">
                      {item.productName}
                    </span>
                                        <span className="text-xs text-dark-600">
                      Quantite : {item.quantity}
                    </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                    <span className="text-sm font-medium text-dark-900">
                      {item.price * item.quantity} dh
                    </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-dark-600 hover:text-dark-900 uppercase tracking-wider underline underline-offset-2"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="bg-white border border-beige-200 px-6 py-4 flex justify-between items-center">
              <span className="text-sm uppercase tracking-wider text-dark-600">
                Total
              </span>
                            <span className="text-lg font-medium text-dark-900">
                {total} dh
              </span>
                        </div>

                        {/* Paiement */}
                        <div className="bg-white border border-beige-200 px-6 py-5">
                            <p className="text-xs uppercase tracking-wider text-dark-600 mb-4">
                                Mode de paiement
                            </p>
                            <div className="flex flex-col gap-3">
                                {[
                                    { value: 'CASH_ON_DELIVERY', label: 'Paiement a la livraison' },
                                    { value: 'ONLINE', label: 'Paiement en ligne (Stripe)' },
                                ].map(({ value, label }) => (
                                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={value}
                                            checked={paymentMethod === value}
                                            onChange={() => setPaymentMethod(value)}
                                            className="accent-dark-900"
                                        />
                                        <span className="text-sm text-dark-900">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Bouton commander */}
                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            className="w-full bg-dark-900 text-beige-50 py-4 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Commande en cours...' : 'Commander maintenant'}
                        </button>

                        <button
                            onClick={clearCart}
                            className="text-xs text-center text-dark-600 underline underline-offset-2 hover:text-dark-900"
                        >
                            Vider le panier
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}