import { CartItem, storeType } from '@/types'
import { FaShoppingCart } from 'react-icons/fa'
import { toast } from 'sonner'
import { useStore } from '../state/cartStore'

interface addButtonProps {
    product: CartItem,
    store?: storeType | null
}

const AddtoCartButton = ({ product, store }: addButtonProps) => {

    const addtoCart = useStore((state) => state.addToCart)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Resolve store from prop first, fallback to product.store
        const resolvedStore = store ?? product.store;

        if (!resolvedStore || !resolvedStore.id) {
            toast.error('Store information is unavailable');
            return;
        }

        addtoCart(product, resolvedStore);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                product.inStock && product.quantity > 0
                    ? 'border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 group-hover:border-blue-400 group-hover:text-blue-700 hover:bg-blue-50'
                    : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!product.inStock || product.quantity <= 0}
        >
            <FaShoppingCart className="w-4 h-4" />
            {product.inStock && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
    )
}

export default AddtoCartButton
