import { CartItem } from '@/types'
import { FaShoppingCart } from 'react-icons/fa'
import { useStore } from '../state/cartStore'

const AddtoCartButton = ({product}: {product: CartItem}) => {

    const addtoCart = useStore((state) => state.addToCart)

  return (
    <button
        onClick={(e) => {
            e.stopPropagation()
            addtoCart(product)
        }}
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
