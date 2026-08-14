import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface WishlistButtonProps {
    productId: string;
    className?: string;
    iconSize?: number;
    initialWishlistState?: boolean;
}

export default function WishlistButton({
    productId,
    className = '',
    iconSize = 4,
    initialWishlistState = false
}: WishlistButtonProps) {
    const [isInWishlist, setIsInWishlist] = useState(initialWishlistState);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {

        if (!initialWishlistState) {
            checkWishlistStatus();
        }
    }, [productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch(`/wishlist/check/${productId}`);
            const data = await response.json();
            setIsInWishlist(data.isInWishlist);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isProcessing) return;

        setIsProcessing(true);

        router.post(`/wishlist/toggle/${productId}`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const page = response as any;
                const isNowInWishlist = !isInWishlist;

                setIsInWishlist(isNowInWishlist);
                toast.success(isNowInWishlist ? 'Added to wishlist!' : 'Removed from wishlist', {
                    position: 'top-right',
                });
                setIsProcessing(false);
            },
            onError: (errors) => {
                console.error('Wishlist error:', errors);
                toast.error(errors.message || 'Failed to update wishlist', {
                    position: 'top-center',
                });
                setIsProcessing(false);
            },
        });
    };

    const iconSizeClass = `w-${iconSize} h-${iconSize}`;

    return (
        <button
            onClick={toggleWishlist}
            disabled={isProcessing}
            className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            } ${className}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isProcessing ? (
                <div className={`${iconSizeClass} border-2 border-gray-300 border-t-primary rounded-full animate-spin`} />
            ) : isInWishlist ? (
                <FaHeart className={`${iconSizeClass} text-red-500`} />
            ) : (
                <FaRegHeart className={`${iconSizeClass} text-gray-600 hover:text-red-500 transition-colors`} />
            )}
        </button>
    );
}
