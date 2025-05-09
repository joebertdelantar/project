<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'category_code',
        'category_name',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'category_code', 'category_code');
    }
    public function offices()
    {
        return $this->hasMany(Office::class, 'category_code', 'category_code');
    }
}
