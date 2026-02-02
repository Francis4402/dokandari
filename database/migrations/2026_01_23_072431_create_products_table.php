<?php

use App\Models\Store;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('store_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('images');
            $table->string('slug')->nullable();
            $table->string('category');
            $table->string('subcategory');
            $table->integer('quantity')->default(1);
            $table->string('regular_price');
            $table->string('sale_price')->nullable();
            $table->mediumText('description');
            $table->enum('product_type', ['top-selling', 'trending', 'featured', 'regular'])
                  ->default('regular');
            $table->boolean('inStock')->default(true);
            $table->decimal('rating')->default(0);
            $table->string('review_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
