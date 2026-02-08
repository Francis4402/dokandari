<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $user_id
 * @property string $store_id
 * @property string $store_name
 * @property string $customer_name
 * @property string $customer_email
 * @property string $customer_phone
 * @property string $customer_address
 * @property string $order_number
 * @property float $subtotal
 * @property float $shipping
 * @property float $tax
 * @property float $discount
 * @property float $total
 * @property string $payment_method
 * @property string $payment_status
 * @property string $order_status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Orders extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

}
