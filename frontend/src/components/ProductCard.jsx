import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white border border-beige-200 p-5 flex flex-col gap-3 hover:border-dark-700 transition-colors">

            {/* Image placeholder */}
            <div className="bg-beige-100 h-48 w-full flex items-center justify-center">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs text-dark-600 uppercase tracking-wider">
            {product.category || 'Produit'}
          </span>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-dark-900 line-clamp-2">
                    {product.name}
                </h3>
                {product.category && (
                    <span className="text-xs text-dark-600 uppercase tracking-wider">
            {product.category}
          </span>
                )}
            </div>

            {/* Prix + Bouton */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-beige-200">
        <span className="text-base font-medium text-dark-900">
          {product.price} dh
        </span>
                <button
                    onClick={() => addToCart(product.id, product.name, product.price)}
                    className="text-xs bg-dark-900 text-beige-50 px-4 py-2 uppercase tracking-wider hover:bg-dark-700 transition-colors"
                >
                    Ajouter
                </button>
            </div>
        </div>
    );
}