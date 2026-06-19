// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const STATUS_LABELS = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmee',
    SHIPPED: 'Expediee',
    DELIVERED: 'Livree',
    CANCELLED: 'Annulee',
};

const STATUS_COLORS = {
    PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
    CONFIRMED: 'text-blue-700 bg-blue-50 border-blue-200',
    SHIPPED: 'text-purple-700 bg-purple-50 border-purple-200',
    DELIVERED: 'text-green-700 bg-green-50 border-green-200',
    CANCELLED: 'text-red-700 bg-red-50 border-red-200',
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const { user } = useAuth();
    const { cartCount } = useCart();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await api.get(`/api/orders/user/${user.id}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Erreur chargement commandes', err);
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
                        Mes Commandes
                    </h1>
                    <p className="text-sm text-dark-600 mt-1">
                        {orders.length} commande{orders.length > 1 ? 's' : ''}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-sm text-dark-600 uppercase tracking-wider animate-pulse">
                            Chargement...
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 border border-beige-200 bg-white">
                        <p className="text-sm text-dark-600 uppercase tracking-wider">
                            Aucune commande
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="bg-white border border-beige-200"
                            >
                                {/* Header commande */}
                                <div
                                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-beige-50 transition-colors"
                                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                >
                                    <div className="flex flex-col gap-1">
                    <span className="text-xs text-dark-600 uppercase tracking-wider">
                      Commande #{order.id.slice(0, 8)}
                    </span>
                                        <span className="text-sm font-medium text-dark-900">
                      {order.totalAmount} dh
                    </span>
                                        <span className="text-xs text-dark-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 border uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                                        <span className="text-dark-600 text-xs">
                      {expanded === order.id ? 'Fermer' : 'Details'}
                    </span>
                                    </div>
                                </div>

                                {/* Details commande */}
                                {expanded === order.id && (
                                    <div className="border-t border-beige-200 px-6 py-4">
                                        <p className="text-xs uppercase tracking-wider text-dark-600 mb-3">
                                            Articles
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {order.items?.map(item => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm text-dark-900"
                                                >
                                                    <span>{item.productName} x{item.quantity}</span>
                                                    <span>{item.price * item.quantity} dh</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-beige-200 flex justify-between text-sm">
                                            <span className="text-dark-600 uppercase tracking-wider text-xs">Total</span>
                                            <span className="font-medium text-dark-900">{order.totalAmount} dh</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}