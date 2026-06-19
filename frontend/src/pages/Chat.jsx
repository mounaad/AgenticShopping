import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'agent',
            content: autoMode
                ? 'Mode automatique actif. Decrivez votre besoin et je m\'occupe de tout.'
                : 'Bonjour, je suis votre assistant shopping. Comment puis-je vous aider ?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoMode, setAutoMode] = useState(false);
    const { user } = useAuth();
    const { cartCount, fetchCart } = useCart();
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Quand l'user change de mode → message d'info
    const handleToggleMode = () => {
        const newMode = !autoMode;
        setAutoMode(newMode);
        setMessages(prev => [...prev, {
            role: 'agent',
            content: newMode
                ? 'Mode automatique active. Je vais chercher, ajouter au panier et commander automatiquement selon vos instructions.'
                : 'Mode manuel active. Je vous proposerai des options et attendrai votre confirmation avant chaque action.'
        }]);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await api.post('/api/agent/chat', {
                userId: user.id,
                message: userMessage,
                autoMode: autoMode
            });

            setMessages(prev => [...prev, {
                role: 'agent',
                content: response.data.message,
                action: response.data.action,
                data: response.data.data
            }]);

            // Si l'agent a modifié le panier → rafraichir le compteur
            if (response.data.action === 'ADD_TO_CART' ||
                response.data.action === 'PLACE_ORDER') {
                fetchCart();
            }

        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'agent',
                content: 'Une erreur est survenue. Veuillez reessayer.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Confirmation manuelle d'une action proposée par l'agent
    const handleConfirmAction = async (action, data) => {
        setLoading(true);
        try {
            let confirmMessage = '';

            if (action === 'CONFIRM_ADD_TO_CART') {
                await api.post(`/api/cart/${user.id}/add`, null, {
                    params: {
                        productId: data.productId,
                        productName: data.productName,
                        price: data.price,
                        quantity: 1
                    }
                });
                fetchCart();
                confirmMessage = `"${data.productName}" a ete ajoute a votre panier.`;
            }

            if (action === 'CONFIRM_ORDER') {
                await api.post(`/api/orders/${user.id}/place`, null, {
                    params: { paymentMethod: data.paymentMethod || 'CASH_ON_DELIVERY' }
                });
                fetchCart();
                confirmMessage = 'Votre commande a ete passee avec succes.';
            }

            setMessages(prev => [...prev, {
                role: 'agent',
                content: confirmMessage
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'agent',
                content: 'Erreur lors de l\'action. Veuillez reessayer.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearConversation = async () => {
        try {
            await api.delete(`/api/agent/memory/${user.id}`);
            setMessages([{
                role: 'agent',
                content: 'Conversation effacee. Comment puis-je vous aider ?'
            }]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50 flex flex-col">
            <Navbar cartCount={cartCount} />

            <main className="flex-1 max-w-3xl w-full mx-auto px-8 py-10 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
                            Assistant
                        </h1>
                        <p className="text-sm text-dark-600 mt-1">
                            {autoMode
                                ? 'Mode automatique — l\'agent agit seul'
                                : 'Mode manuel — vous validez chaque action'
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-5">

                        {/* Toggle mode */}
                        <div className="flex items-center gap-2">
              <span className="text-xs text-dark-600 uppercase tracking-wider">
                {autoMode ? 'Auto' : 'Manuel'}
              </span>
                            <button
                                onClick={handleToggleMode}
                                className={`w-10 h-5 rounded-full transition-colors relative ${
                                    autoMode ? 'bg-dark-900' : 'bg-beige-300'
                                }`}
                            >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoMode ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
                            </button>
                        </div>

                        <button
                            onClick={clearConversation}
                            className="text-xs text-dark-600 uppercase tracking-wider underline underline-offset-2 hover:text-dark-900"
                        >
                            Effacer
                        </button>
                    </div>
                </div>

                {/* Mode indicator */}
                <div className={`mb-4 px-4 py-2 text-xs uppercase tracking-wider border ${
                    autoMode
                        ? 'bg-dark-900 text-beige-50 border-dark-900'
                        : 'bg-white text-dark-600 border-beige-200'
                }`}>
                    {autoMode
                        ? 'Mode automatique — l\'agent va chercher, ajouter au panier et commander'
                        : 'Mode manuel — l\'agent propose, vous confirmez chaque etape'
                    }
                </div>

                {/* Messages */}
                <div className="flex-1 bg-white border border-beige-200 p-6 overflow-y-auto flex flex-col gap-4 min-h-96">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${
                            msg.role === 'user' ? 'items-end' : 'items-start'
                        }`}>

                            {/* Bulle message */}
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user'
                                    ? 'bg-dark-900 text-beige-50'
                                    : 'bg-beige-100 text-dark-900 border border-beige-200'
                            }`}>
                                {msg.content}
                            </div>

                            {/* Boutons de confirmation (mode manuel) */}
                            {msg.role === 'agent' && !autoMode && msg.action && (
                                <div className="mt-2 flex gap-2">
                                    {msg.action === 'PROPOSE_ADD_TO_CART' && (
                                        <>
                                            <button
                                                onClick={() => handleConfirmAction('CONFIRM_ADD_TO_CART', msg.data)}
                                                className="text-xs bg-dark-900 text-beige-50 px-4 py-2 uppercase tracking-wider hover:bg-dark-700 transition-colors"
                                            >
                                                Confirmer ajout
                                            </button>
                                            <button
                                                onClick={() => setMessages(prev => [...prev, {
                                                    role: 'agent', content: 'Action annulee. Que souhaitez-vous faire ?'
                                                }])}
                                                className="text-xs border border-beige-300 text-dark-600 px-4 py-2 uppercase tracking-wider hover:border-dark-900"
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    )}

                                    {msg.action === 'PROPOSE_ORDER' && (
                                        <>
                                            <button
                                                onClick={() => handleConfirmAction('CONFIRM_ORDER', msg.data)}
                                                className="text-xs bg-dark-900 text-beige-50 px-4 py-2 uppercase tracking-wider hover:bg-dark-700 transition-colors"
                                            >
                                                Confirmer commande
                                            </button>
                                            <button
                                                onClick={() => setMessages(prev => [...prev, {
                                                    role: 'agent', content: 'Commande annulee. Souhaitez-vous modifier votre panier ?'
                                                }])}
                                                className="text-xs border border-beige-300 text-dark-600 px-4 py-2 uppercase tracking-wider hover:border-dark-900"
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-beige-100 border border-beige-200 px-4 py-3 text-sm text-dark-600">
                                <span className="animate-pulse">En cours de reflexion...</span>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="flex gap-3 mt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={autoMode
                            ? 'Ex: Commande le meilleur casque audio sous 400 dh'
                            : 'Ex: Je cherche un cadeau pour ma mere, budget 500 dh'
                        }
                        className="flex-1 border border-beige-300 bg-white px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-dark-900 text-beige-50 px-6 py-3 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors disabled:opacity-50"
                    >
                        Envoyer
                    </button>
                </form>

                {/* Suggestions selon le mode */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {(autoMode ? [
                        'Commande le meilleur produit electronique sous 300 dh',
                        'Achete un cadeau pour 500 dh livraison a domicile',
                        'Commande automatiquement le produit le moins cher en sport',
                    ] : [
                        'Je cherche un cadeau 500 dh',
                        'Montre-moi les produits electroniques',
                        'Qu\'est-ce que tu me recommandes ?',
                    ]).map(s => (
                        <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="text-xs border border-beige-300 text-dark-600 px-3 py-1 hover:border-dark-900 hover:text-dark-900 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}