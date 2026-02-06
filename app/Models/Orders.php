<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
