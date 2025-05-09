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
        Schema::create('acceptances', function (Blueprint $table) {
            $table->id();
            // get item id from items table
            $table->unsignedBigInteger('item_id');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            // get fund id from funds table
            $table->unsignedBigInteger('fund_id');
            $table->foreign('fund_id')->references('id')->on('funds')->onDelete('cascade');
            // get category id from categories table
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            // get office id from office table
            $table->unsignedBigInteger('office_id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            // get user id from users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('RIS_number')->nullable();
            // $table->date('SSMI_date')->nullable();
            $table->string('SSMI_date', 10)->nullable();
            $table->date('acceptance_date')->nullable();
            $table->integer('qty')->nullable();
            $table->decimal('unit_price', 20, 2);
            $table->decimal('total_price', 20, 2);
            // for issuance section
            $table->date('issuance_date')->nullable();
            $table->integer('issuance_qty')->nullable();
            $table->decimal('issuance_unit_price', 20, 2)->nullable();
            $table->decimal('issuance_total_price', 20, 2)->nullable();
            $table->decimal('balance', 20, 2)->nullable();
            $table->enum('status', ['Completed', 'Pending'])->default('Pending');



            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acceptances');
    }
};
