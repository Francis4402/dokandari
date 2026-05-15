import { Orders, User } from '@/types'
import { Link } from '@inertiajs/react'
import FormatPrice from '@/Pages/utils/FormatePrice';

interface RecentOrdersProps {
    orders: Orders[];
    user: User;
}

const RecentOrders = ({ orders, user }: RecentOrdersProps) => {

    const filteredOrders = () => {

        if (user.role === 'admin' || user.role === 'superadmin') {
            return orders;
        }


        if (user.role === 'agent' || user.role === 'deliveryman' || user.role === 'user') {
            return orders.filter(order => order.user_id === user.id.toString());
        }


        return orders.filter(order => order.user_id === user.id.toString());
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentMethodColor = (method: string) => {
        switch (method?.toLowerCase()) {
            case 'credit_card':
            case 'credit card':
            case 'card':
                return 'bg-purple-100 text-purple-800';
            case 'paypal':
                return 'bg-blue-100 text-blue-800';
            case 'cash':
            case 'cash_on_delivery':
            case 'cod':
                return 'bg-green-100 text-green-800';
            case 'bank_transfer':
                return 'bg-indigo-100 text-indigo-800';
            case 'mobile_banking':
            case 'bkash':
            case 'nagad':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getOrderStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'returned':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const displayedOrders = filteredOrders();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {displayedOrders.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        displayedOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                                        {order.id.slice(0, 8)}...
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {order.order_number || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.recipient_name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.recipient_phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">
                                        <FormatPrice price={order.total} />
                                    </div>
                                    {order.amount_to_collect > 0 && (
                                        <div className="text-xs text-gray-500">
                                            Collect: <FormatPrice price={order.amount_to_collect} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.payment_status)}`}>
                                        {order.payment_status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(order.order_status)}`}>
                                        {order.order_status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(order.payment_method)}`}>
                                        {order.payment_method?.replace(/_/g, ' ') || 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default RecentOrders
