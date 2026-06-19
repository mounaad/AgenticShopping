import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const TABS = ['Produits', 'Commandes', 'Utilisateurs'];

const STATUS_LABELS = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmee',
    SHIPPED: 'Expediee',
    DELIVERED: 'Livree',
    CANCELLED: 'Annulee',
};

export default function AdminDashboard() {
    const [tab, setTab] = useState('Produits');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { cartCount } = useCart();

    // Form nouveau produit
    const [form, setForm] = useState({
        name: '', price: '', category: '', description: '', stock: ''
    });
    const [formSuccess, setFormSuccess] = useState('');

    useEffect(() => {
        if (tab === 'Produits') loadProducts();
        if (tab === 'Commandes') loadOrders();
        if (tab === 'Utilisateurs') loadUsers();
    }, [tab]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/products', {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
            });
            setFormSuccess('Produit ajoute avec succes');
            setForm({ name: '', price: '', category: '', description: '', stock: '' });
            loadProducts();
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            loadProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, null, { params: { status } });
            loadOrders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50">
            <Navbar cartCount={cartCount} />

            <main className="max-w-6xl mx-auto px-8 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
                        Dashboard Admin
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Produits', value: products.length },
                        { label: 'Commandes', value: orders.length },
                        { label: 'Utilisateurs', value: users.length },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white border border-beige-200 px-6 py-5">
                            <p className="text-xs uppercase tracking-wider text-dark-600 mb-1">{label}</p>
                            <p className="text-2xl font-light text-dark-900">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-beige-200">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-3 text-xs uppercase tracking-wider transition-colors ${
                                tab === t
                                    ? 'border-b-2 border-dark-900 text-dark-900'
                                    : 'text-dark-600 hover:text-dark-900'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-sm text-dark-600 animate-pulse">Chargement...</p>
                ) : (
                    <>
                        {/* Tab Produits */}
                        {tab === 'Produits' && (
                            <div className="flex flex-col gap-6">

                                {/* Formulaire ajout */}
                                <div className="bg-white border border-beige-200 p-6">
                                    <h2 className="text-sm font-medium uppercase tracking-wider text-dark-900 mb-4">
                                        Ajouter un produit
                                    </h2>
                                    {formSuccess && (
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                                            {formSuccess}
                                        </div>
                                    )}
                                    <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'name', label: 'Nom', type: 'text' },
                                            { key: 'price', label: 'Prix (dh)', type: 'number' },
                                            { key: 'category', label: 'Categorie', type: 'text' },
                                            { key: 'stock', label: 'Stock', type: 'number' },
                                        ].map(({ key, label, type }) => (
                                            <div key={key}>
                                                <label className="block text-xs uppercase tracking-wider text-dark-600 mb-1">
                                                    {label}
                                                </label>
                                                <input
                                                    type={type}
                                                    value={form[key]}
                                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                                    className="w-full border border-beige-300 bg-beige-50 px-4 py-2 text-sm text-dark-900 focus:outline-none focus:border-dark-900"
                                                    required
                                                />
                                            </div>
                                        ))}
                                        <div className="col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-dark-600 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                className="w-full border border-beige-300 bg-beige-50 px-4 py-2 text-sm text-dark-900 focus:outline-none focus:border-dark-900 h-20 resize-none"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <button
                                                type="submit"
                                                className="bg-dark-900 text-beige-50 px-6 py-2 text-xs uppercase tracking-wider hover:bg-dark-700 transition-colors"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Liste produits */}
                                <div className="bg-white border border-beige-200">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b border-beige-200">
                                            {['Nom', 'Categorie', 'Prix', 'Stock', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-6 py-3 text-xs uppercase tracking-wider text-dark-600">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((p, i) => (
                                            <tr key={p.id} className={i < products.length - 1 ? 'border-b border-beige-200' : ''}>
                                                <td className="px-6 py-3 text-dark-900">{p.name}</td>
                                                <td className="px-6 py-3 text-dark-600 text-xs uppercase">{p.category}</td>
                                                <td className="px-6 py-3 text-dark-900">{p.price} dh</td>
                                                <td className="px-6 py-3 text-dark-600">{p.stock}</td>
                                                <td className="px-6 py-3">
                                                    <button
                                                        onClick={() => handleDeleteProduct(p.id)}
                                                        className="text-xs text-red-600 uppercase tracking-wider underline underline-offset-2 hover:text-red-800"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab Commandes */}
                        {tab === 'Commandes' && (
                            <div className="bg-white border border-beige-200">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-beige-200">
                                        {['ID', 'User', 'Total', 'Statut', 'Date', 'Changer statut'].map(h => (
                                            <th key={h} className="text-left px-6 py-3 text-xs uppercase tracking-wider text-dark-600">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((o, i) => (
                                        <tr key={o.id} className={i < orders.length - 1 ? 'border-b border-beige-200' : ''}>
                                            <td className="px-6 py-3 text-dark-600 text-xs">#{o.id.slice(0, 8)}</td>
                                            <td className="px-6 py-3 text-dark-900 text-xs">{o.userId?.slice(0, 8)}</td>
                                            <td className="px-6 py-3 text-dark-900">{o.totalAmount} dh</td>
                                            <td className="px-6 py-3">
                          <span className="text-xs uppercase tracking-wider text-dark-600">
                            {STATUS_LABELS[o.status]}
                          </span>
                                            </td>
                                            <td className="px-6 py-3 text-dark-600 text-xs">
                                                {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-3">
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                                    className="text-xs border border-beige-300 bg-beige-50 px-2 py-1 text-dark-900 focus:outline-none focus:border-dark-900"
                                                >
                                                    {Object.keys(STATUS_LABELS).map(s => (
                                                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Tab Utilisateurs */}
                        {tab === 'Utilisateurs' && (
                            <div className="bg-white border border-beige-200">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-beige-200">
                                        {['Nom', 'Email', 'Role', 'Telephone', 'Date'].map(h => (
                                            <th key={h} className="text-left px-6 py-3 text-xs uppercase tracking-wider text-dark-600">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id} className={i < users.length - 1 ? 'border-b border-beige-200' : ''}>
                                            <td className="px-6 py-3 text-dark-900">{u.fullName}</td>
                                            <td className="px-6 py-3 text-dark-600 text-xs">{u.email}</td>
                                            <td className="px-6 py-3">
                          <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                              u.role === 'ADMIN'
                                  ? 'border-dark-900 text-dark-900'
                                  : 'border-beige-300 text-dark-600'
                          }`}>
                            {u.role}
                          </span>
                                            </td>
                                            <td className="px-6 py-3 text-dark-600 text-xs">{u.phone || '—'}</td>
                                            <td className="px-6 py-3 text-dark-600 text-xs">
                                                {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}