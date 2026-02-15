<?php

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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('store_name');
            $table->string('order_number')->unique();


            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();


            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->string('recipient_phone_alt')->nullable();
            $table->text('recipient_address');


            $table->unsignedBigInteger('pathao_city_id')->nullable();
            $table->string('pathao_city_name')->nullable();
            $table->unsignedBigInteger('pathao_zone_id')->nullable();
            $table->string('pathao_zone_name')->nullable();
            $table->unsignedBigInteger('pathao_area_id')->nullable();
            $table->string('pathao_area_name')->nullable();

            // Pathao Delivery Settings
            $table->unsignedTinyInteger('delivery_type')->default(48);
            $table->unsignedTinyInteger('item_type')->default(2);
            $table->text('special_instruction')->nullable();
            $table->string('item_description')->nullable();

            // Order Items & Financials
            $table->unsignedInteger('item_quantity')->default(1);
            $table->decimal('item_weight', 8, 2)->default(0.50);
            $table->decimal('amount_to_collect', 10, 2)->default(0); // For COD
            $table->decimal('subtotal', 10, 2);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('cod_charge', 10, 2)->default(0);
            $table->decimal('total_charge', 10, 2)->default(0);
            $table->decimal('total', 10, 2);

            // Discount/Coupon
            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);

            // Tracking
            $table->string('tracking_number')->nullable()->unique();
            $table->enum('shipping_method', ['standard', 'pathao'])->default('standard');

            // Pathao Tracking
            $table->string('pathao_order_id')->nullable();
            $table->string('pathao_consignment_id')->nullable();
            $table->string('pathao_order_status')->nullable();
            $table->longText('pathao_response')->nullable();

            // Order Status
            $table->enum('payment_method', ['cash_on_delivery', 'bikash'])->default('cash_on_delivery');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])->default('pending');

            // Additional Fields
            $table->text('notes')->nullable();
            $table->date('estimated_delivery')->nullable();
            $table->longText('items')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            // Indexes for performance
            $table->index('order_number');
            $table->index('tracking_number');
            $table->index('customer_email');
            $table->index('customer_phone');
            $table->index('recipient_phone');
            $table->index('pathao_consignment_id');
            $table->index('pathao_order_id');
            $table->index('order_status');
            $table->index('payment_status');
            $table->index('created_at');
            $table->index(['store_id', 'created_at']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
