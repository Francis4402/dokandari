import { Dialog, Transition } from '@headlessui/react';
import { FaTrash } from 'react-icons/fa';

interface clearCartProps {
    isOpen: boolean
    confirmClearCart: () => void
}

const ClearCartDialog = ({isOpen, confirmClearCart}: clearCartProps) => {
  return (
    <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={close}>
            <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md p-6 text-left align-middle shadow-xl transition-all border border-white/20">
                    <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <FaTrash className="h-6 w-6 text-red-600" />
                    </div>
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                    >
                        Clear Shopping Cart
                    </Dialog.Title>
                    </div>

                    <div className="mt-2">
                    <p className="text-sm text-gray-600">
                        You're about to remove all items from your cart.
                        This action cannot be undone.
                    </p>
                    </div>

                    <div className="mt-6 flex space-x-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 flex-1 transition-colors"
                        onClick={close}
                    >
                        Keep Items
                    </button>

                    <button
                        type="button"
                        className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 flex-1 transition-colors items-center"
                        onClick={confirmClearCart}
                    >
                        <FaTrash className="h-4 w-4 mr-2" />
                        Clear Cart
                    </button>
                    </div>
                </Dialog.Panel>
                </Transition.Child>
            </div>
            </div>
        </Dialog>
    </Transition>
  )
}

export default ClearCartDialog
