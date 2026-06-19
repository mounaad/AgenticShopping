import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['Tous', 'Electronique', 'Mode', 'Maison', 'Sport', 'Beaute'];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Tous');
    const [loading, setLoading] = useState(true);
    const { cartCount } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
            setFiltered(data);
        } catch (err) {
            console.error('Erreur chargement produits', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) {
            setFiltered(products);
            return;
        }
        try {
            const data = await productService.search(search);
            setFiltered(data);
        } catch (err) {
            console.error('Erreur recherche', err);
        }
    };

    const handleCategory = async (cat) => {
        setCategory(cat);
        if (cat === 'Tous') {
            setFiltered(products);
            return;
        }
        try {
            const data = await productService.getByCategory(cat);
            setFiltered(data);
        } catch (err) {
            console.error('Erreur categorie', err);
        }
    };

    return (
        <div className="min-h-screen bg-beige-50">
            <Navbar cartCount={cartCount} />

            <main className="max-w-6xl mx-auto px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
                        Catalogue
                    </h1>
                    <p className="text-sm text-dark-600 mt-1">
                        {filtered.length} produit{filtered.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Recherche */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="flex-1 border border-beige-300 bg-white px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
                    />
                    <button
                        type="submit"
                        className="bg-dark-900 text-beige-50 px-6 py-3 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors"
                    >
                        Rechercher
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(''); setFiltered(products); }}
                            className="border border-beige-300 text-dark-600 px-4 py-3 text-sm hover:border-dark-900 transition-colors"
                        >
                            Effacer
                        </button>
                    )}
                </form>

                {/* Categories */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={`text-xs px-4 py-2 uppercase tracking-wider border transition-colors ${
                                category === cat
                                    ? 'bg-dark-900 text-beige-50 border-dark-900'
                                    : 'bg-white text-dark-600 border-beige-300 hover:border-dark-900'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Produits */}
                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-sm text-dark-600 uppercase tracking-wider">
                            Chargement...
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-sm text-dark-600 uppercase tracking-wider">
                            Aucun produit trouve
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filtered.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}


// import { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import ProductCard from '../components/ProductCard';
// import { useCart } from '../context/CartContext';
//
// const CATEGORIES = ['Tous', 'Electronique', 'Mode', 'Maison', 'Sport', 'Beaute'];
//
// // Données fictives
// const FAKE_PRODUCTS = [
//     { id: '1', name: 'Ecouteurs sans fil', category: 'Electronique', price: 350 },
//     { id: '2', name: 'Sac en cuir', category: 'Mode', price: 480 },
//     { id: '3', name: 'Lampe de bureau', category: 'Maison', price: 120 },
//     { id: '4', name: 'Tapis de yoga', category: 'Sport', price: 200 },
//     { id: '5', name: 'Montre classique', category: 'Mode', price: 650 },
//     { id: '6', name: 'Cafetiere', category: 'Maison', price: 280 },
//     { id: '7', name: 'Livre de cuisine', category: 'Maison', price: 90 },
//     { id: '8', name: 'Creme hydratante', category: 'Beaute', price: 150 },
// ];
//
// export default function Home() {
//     const [products, setProducts] = useState(FAKE_PRODUCTS);
//     const [filtered, setFiltered] = useState(FAKE_PRODUCTS);
//     const [search, setSearch] = useState('');
//     const [category, setCategory] = useState('Tous');
//     const { cartCount } = useCart();
//
//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (!search.trim()) {
//             setFiltered(products);
//             return;
//         }
//         const result = products.filter(p =>
//             p.name.toLowerCase().includes(search.toLowerCase())
//         );
//         setFiltered(result);
//     };
//
//     const handleCategory = (cat) => {
//         setCategory(cat);
//         if (cat === 'Tous') {
//             setFiltered(products);
//             return;
//         }
//         const result = products.filter(p => p.category === cat);
//         setFiltered(result);
//     };
//
//     return (
//         <div className="min-h-screen bg-beige-50">
//             <Navbar cartCount={cartCount} />
//
//             <main className="max-w-6xl mx-auto px-8 py-10">
//
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-2xl font-light text-dark-900 uppercase tracking-widest">
//                         Catalogue
//                     </h1>
//                     <p className="text-sm text-dark-600 mt-1">
//                         {filtered.length} produit{filtered.length > 1 ? 's' : ''}
//                     </p>
//                 </div>
//
//                 {/* Recherche */}
//                 <form onSubmit={handleSearch} className="flex gap-3 mb-8">
//                     <input
//                         type="text"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Rechercher un produit..."
//                         className="flex-1 border border-beige-300 bg-white px-4 py-3 text-sm text-dark-900 focus:outline-none focus:border-dark-900 transition-colors"
//                     />
//                     <button
//                         type="submit"
//                         className="bg-dark-900 text-beige-50 px-6 py-3 text-sm uppercase tracking-wider hover:bg-dark-700 transition-colors"
//                     >
//                         Rechercher
//                     </button>
//                     {search && (
//                         <button
//                             type="button"
//                             onClick={() => { setSearch(''); setFiltered(products); }}
//                             className="border border-beige-300 text-dark-600 px-4 py-3 text-sm hover:border-dark-900 transition-colors"
//                         >
//                             Effacer
//                         </button>
//                     )}
//                 </form>
//
//                 {/* Categories */}
//                 <div className="flex gap-3 mb-8 flex-wrap">
//                     {CATEGORIES.map(cat => (
//                         <button
//                             key={cat}
//                             onClick={() => handleCategory(cat)}
//                             className={`text-xs px-4 py-2 uppercase tracking-wider border transition-colors ${
//                                 category === cat
//                                     ? 'bg-dark-900 text-beige-50 border-dark-900'
//                                     : 'bg-white text-dark-600 border-beige-300 hover:border-dark-900'
//                             }`}
//                         >
//                             {cat}
//                         </button>
//                     ))}
//                 </div>
//
//                 {/* Produits */}
//                 {filtered.length === 0 ? (
//                     <div className="text-center py-20">
//                         <p className="text-sm text-dark-600 uppercase tracking-wider">
//                             Aucun produit trouve
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                         {filtered.map(product => (
//                             <ProductCard key={product.id} product={product} />
//                         ))}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }