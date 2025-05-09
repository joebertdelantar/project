<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acceptance extends Model
{
    protected $table = 'acceptances';

    protected $fillable = [
        'item_id',
        'fund_id',
        'category_id',
        'office_id',
        'user_id',
        'RIS_number',
        'SSMI_date',
        'acceptance_date',
        'qty',
        'unit_price',
        'total_price',
        // for issuance section
        'issuance_date',
        'issuance_qty',
        'issuance_unit_price',
        'issuance_total_price',
        'balance',
        'status',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function fund()
    {
        return $this->belongsTo(Fund::class, 'fund_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    
}
