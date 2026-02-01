
import { FaShoppingCart } from 'react-icons/fa'

const Addtocartactionbutton = () => {
  return (
    <button
        onClick={(e) => e.stopPropagation()}
        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors"
        aria-label="Add to cart"
    >
        <FaShoppingCart className="w-4 h-4 text-gray-600" />
    </button>
  )
}

export default Addtocartactionbutton
