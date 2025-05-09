<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $table = 'offices';

    protected $fillable = [
        'office_acronym',   // Unique code for the office
        'office_name',   // Name of the office
    ];
}