<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrderItems extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function order()
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }
}
