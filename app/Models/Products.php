<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function comments()
    {
        return $this->hasMany(Comment::class, 'product_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'product_id', 'id');
    }

    public function wishlistedBy()
    {
        return $this->hasMany(Wishlist::class);
    }
}
