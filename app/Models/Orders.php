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
        // User and Store
        'user_id',
        'store_id',
        'store_name',

        // Customer Information (who placed the order)
        'customer_name',        // ✅ ADDED
        'customer_phone',       // ✅ ADDED
        'customer_email',

        // Recipient Information (who receives the order)
        'recipient_name',
        'recipient_phone',
        'recipient_phone_alt',
        'recipient_address',

        // Order Details
        'order_number',
        'item_quantity',
        'item_weight',
        'item_description',

        // Financial
        'subtotal',
        'delivery_charge',
        'cod_charge',
        'total_charge',
        'total',
        'amount_to_collect',

        // Discount/Coupon
        'coupon_code',          // ✅ ADDED
        'discount_amount',      // ✅ ADDED

        // Payment
        'payment_method',
        'payment_status',

        // Order Status
        'order_status',

        // Shipping
        'shipping_method',      // ✅ ADDED
        'tracking_number',      // ✅ ADDED

        // Pathao Specific
        'pathao_city_id',
        'pathao_city_name',
        'pathao_zone_id',
        'pathao_zone_name',
        'pathao_area_id',
        'pathao_area_name',
        'pathao_order_id',
        'pathao_consignment_id',
        'pathao_order_status',
        'pathao_response',
        'delivery_type',
        'item_type',
        'special_instruction',

        // Additional
        'notes',
        'estimated_delivery',
        'shipped_at',
        'delivered_at',
        'items',
    ];


    protected $casts = [
        // Decimal amounts
        'subtotal' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_to_collect' => 'decimal:2',
        'cod_charge' => 'decimal:2',
        'total_charge' => 'decimal:2',
        'item_weight' => 'decimal:2',
        'discount_amount' => 'decimal:2',

        // Integers
        'item_quantity' => 'integer',
        'pathao_city_id' => 'integer',
        'pathao_zone_id' => 'integer',
        'pathao_area_id' => 'integer',
        'delivery_type' => 'integer',
        'item_type' => 'integer',

        // JSON
        'pathao_response' => 'array',
        'items' => 'array',

        // Dates
        'estimated_delivery' => 'date:Y-m-d',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    protected $dates = [
        'estimated_delivery',
        'shipped_at',
        'delivered_at',
        'created_at',
        'updated_at',
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
        'item_weight' => 0.50,
        'delivery_charge' => 0,
        'delivery_type' => 48,
        'item_type' => 2,
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
     * Scope a query to only include orders with specific shipping method.
     */
    public function scopeOrderStatus($query, string $status)
    {
        return $query->where('order_status', $status);
    }

    /**
     * Scope a query to only include Pathao orders.
     */
    public function scopePaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope a query to only include standard shipping orders.
     */
    public function scopePathao($query)
    {
        return $query->whereNotNull('pathao_order_id');
    }

    /**
     * Scope a query to only include orders with specific status.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include orders with specific payment status.
     */
    public function isPathao()
    {
        return !is_null($this->pathao_order_id);
    }

    /**
     * Check if order is using Pathao shipping.
     */
    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Check if order is using standard shipping.
     */
    public function isStandard(): bool
    {
        return $this->shipping_method === 'standard';
    }

    /**
     * Check if order is paid.
     */
    public function isPending()
    {
        return $this->order_status === 'pending';
    }

    /**
     * Check if order is pending.
     */
    public function isProcessing()
    {
        return $this->order_status === 'processing';
    }

    /**
     * Check if order is processing.
     */
    public function isShipped()
    {
        return $this->order_status === 'shipped';
    }

    /**
     * Check if order is shipped.
     */
    public function isDelivered()
    {
        return $this->order_status === 'delivered';
    }

    /**
     * Check if order is delivered.
     */
    public function isCancelled()
    {
        return $this->order_status === 'cancelled';
    }


    /**
     * Get the full shipping address for Pathao.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [
            $this->recipient_address,
            $this->pathao_area_name,
            $this->pathao_zone_name,
            $this->pathao_city_name
        ];

        return implode(', ', array_filter($parts));
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
     * Calculate order total with all charges.
     */
    public function calculateTotal(): float
    {
        return (float) $this->subtotal + (float) $this->delivery_charge;
    }

    /**
     * Boot the model.
     */
    public function isPathaoEligible(): bool
    {
        return $this->pathao_city_id &&
               $this->pathao_zone_id &&
               $this->pathao_area_id &&
               $this->recipient_address &&
               $this->recipient_phone;
    }

    public function getCodChargePercentage(): ?float
    {
        if (!$this->amount_to_collect || $this->amount_to_collect <= 0) {
            return null;
        }

        return ($this->cod_charge / $this->amount_to_collect) * 100;
    }

    protected static function boot()
    {
        parent::boot();


        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = static::generateOrderNumber();
            }
        });


        static::updating(function ($order) {
            if ($order->isDirty('order_status')) {
                switch ($order->order_status) {
                    case 'shipped':
                        if (empty($order->shipped_at)) {
                            $order->shipped_at = now();
                        }
                        break;
                    case 'delivered':
                        if (empty($order->delivered_at)) {
                            $order->delivered_at = now();
                        }
                        break;
                }
            }
        });
    }

    protected static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return $prefix . '-' . $date . '-' . $random;
    }
}
