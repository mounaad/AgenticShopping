import { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState(null);
    const { user } = useAuth();

    const addToCart = async (productId, productName, price, quantity = 1) => {
        if (!user) return;
        try {
            const response = await api.post(
                `/api/cart/${user.id}/add?productId=${productId}&productName=${encodeURIComponent(productName)}&price=${price}&quantity=${quantity}`
            );
            setCart(response.data);
            setCartCount(prev => prev + quantity);
        } catch (err) {
            console.error('Erreur ajout panier', err);
        }
    };

    const fetchCart = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/api/cart/${user.id}`);
            setCart(response.data);
            const total = response.data?.items?.reduce(
                (sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(total);
        } catch (err) {
            console.error('Erreur fetch panier', err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

// import { createContext, useContext, useState } from 'react';
//
// const CartContext = createContext(null);
//
// export const CartProvider = ({ children }) => {
//     const [cartCount, setCartCount] = useState(0);
//     const [cart, setCart] = useState({ items: [] });
//
//     const addToCart = (productId, productName, price, quantity = 1) => {
//         setCart(prev => {
//             const existing = prev.items.find(i => i.productId === productId);
//             if (existing) {
//                 return {
//                     items: prev.items.map(i =>
//                         i.productId === productId
//                             ? { ...i, quantity: i.quantity + quantity }
//                             : i
//                     )
//                 };
//             }
//             return {
//                 items: [...prev.items, { productId, productName, price, quantity }]
//             };
//         });
//         setCartCount(prev => prev + quantity);
//     };
//
//     const removeFromCart = (productId) => {
//         const item = cart.items.find(i => i.productId === productId);
//         if (item) {
//             setCartCount(prev => prev - item.quantity);
//             setCart(prev => ({
//                 items: prev.items.filter(i => i.productId !== productId)
//             }));
//         }
//     };
//
//     const clearCart = () => {
//         setCart({ items: [] });
//         setCartCount(0);
//     };
//
//     return (
//         <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
//
// export const useCart = () => useContext(CartContext);