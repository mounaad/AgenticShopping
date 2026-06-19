import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user') || 'null')
    );

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (formData) => {
        const data = await authService.register(formData);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext, useState } from 'react';
//
// const AuthContext = createContext(null);
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(
//         JSON.parse(localStorage.getItem('user') || 'null')
//     );
//
//     const login = async (email, password) => {
//         // Utilisateur fictif pour tester le frontend
//         const fakeUser = {
//             id: 'user-123',
//             email: email,
//             fullName: 'Test User',
//             role: 'CLIENT'
//         };
//         localStorage.setItem('user', JSON.stringify(fakeUser));
//         setUser(fakeUser);
//         return fakeUser;
//     };
//
//     const register = async (formData) => {
//         return formData;
//     };
//
//     const logout = () => {
//         localStorage.removeItem('user');
//         setUser(null);
//     };
//
//     return (
//         <AuthContext.Provider value={{ user, login, register, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => useContext(AuthContext);