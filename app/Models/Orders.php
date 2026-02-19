<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // IDs
        'user_id',
        'store_id',
        'product_id', // Added from schema

        // Order Identifiers
        'merchant_order_id', // Added from schema
        'order_number',

        // Sender Info (from store)
        'sender_name', // Added from schema
        'sender_phone', // Added from schema
        'sender_email',
        // Recipient Information
        'recipient_name',
        'recipient_email',
        'recipient_phone',
        'recipient_address',
        'recipient_city', // Added from schema
        'recipient_zone', // Added from schema
        'recipient_area', // Added from schema

        // Pathao Settings
        'delivery_type',
        'item_type',
        'special_instruction',

        // Order Details
        'item_quantity',
        'item_weight',
        'amount_to_collect',
        'item_description',
        'store_name',

        // Financial
        'subtotal',
        'delivery_charge',
        'total',

        // Discount/Coupon
        'coupon_code',
        'discount_amount',

        // Tracking
        'tracking_number',
        'shipping_method',

        // Status
        'payment_method',
        'payment_status',
        'order_status',

        // Additional
        'notes',
        'items',

        // Pathao response tracking (optional)
        'pathao_order_id',
        'pathao_consignment_id',
        'pathao_response',
    ];

    protected $casts = [
        // Decimal amounts
        'subtotal' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_to_collect' => 'decimal:2',
        'discount_amount' => 'decimal:2',

        // Integers
        'recipient_city' => 'integer',
        'recipient_zone' => 'integer',
        'recipient_area' => 'integer',
        'item_quantity' => 'integer',
        'item_weight' => 'integer', // In schema it's integer
        'delivery_type' => 'integer',
        'item_type' => 'integer',

        // JSON
        'pathao_response' => 'array',
        'items' => 'array',

        // Dates
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Default attribute values.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'payment_method' => 'cash_on_delivery',
        'payment_status' => 'pending',
        'order_status' => 'pending',
        'delivery_charge' => 0,
        'delivery_type' => 48,
        'item_type' => 2,
        'discount_amount' => 0,
    ];

    /**
     * Get the order items for this order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_id', 'id');
    }

    /**
     * Get the store that owns this order.
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    /**
     * Get the user that owns this order.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get the product for this order (first product).
     */
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'id');
    }

    /**
     * Scope a query to only include orders with specific order status.
     */
    public function scopeOrderStatus($query, string $status)
    {
        return $query->where('order_status', $status);
    }

    /**
     * Scope a query to only include orders with specific payment status.
     */
    public function scopePaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope a query to only include Pathao orders.
     */
    public function scopePathao($query)
    {
        return $query->where('shipping_method', 'pathao');
    }

    /**
     * Scope a query to only include orders within date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Check if order is using Pathao shipping.
     */
    public function isPathao(): bool
    {
        return $this->shipping_method === 'pathao';
    }

    /**
     * Check if order is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Check if order is pending.
     */
    public function isPending(): bool
    {
        return $this->order_status === 'pending';
    }

    /**
     * Check if order is processing.
     */
    public function isProcessing(): bool
    {
        return $this->order_status === 'processing';
    }

    /**
     * Check if order is shipped.
     */
    public function isShipped(): bool
    {
        return $this->order_status === 'shipped';
    }

    /**
     * Check if order is delivered.
     */
    public function isDelivered(): bool
    {
        return $this->order_status === 'delivered';
    }

    /**
     * Check if order is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->order_status === 'cancelled';
    }

    /**
     * Get the full shipping address.
     */
    public function getFullAddressAttribute(): string
    {
        return $this->recipient_address;
    }

    /**
     * Get the tracking URL for Pathao orders.
     */
    public function getPathaoTrackingUrlAttribute(): ?string
    {
        if (!$this->pathao_consignment_id) {
            return null;
        }
        return 'https://pathao.com/track/' . $this->pathao_consignment_id;
    }

    /**
     * Check if order is eligible for Pathao shipping.
     */
    public function isPathaoEligible(): bool
    {
        return $this->recipient_city &&
               $this->recipient_zone &&
               $this->recipient_area &&
               $this->recipient_address &&
               $this->recipient_phone;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = static::generateOrderNumber();
            }
        });
    }

    /**
     * Generate a unique order number.
     */
    protected static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('YmdHis');
        $random = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        return $prefix . '-' . $timestamp . '-' . $random;
    }
}
