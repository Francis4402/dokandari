import React from 'react';

interface FormatPriceProps {
    price: number;
    currency?: string;
}

const FormatPrice = ({ price, currency = 'BDT' }: FormatPriceProps) => {
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return <span>{formatPrice(price)}</span>;
};

export default FormatPrice;
