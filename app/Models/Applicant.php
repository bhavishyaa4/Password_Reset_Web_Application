<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;

class Applicant extends Authenticatable implements MustVerifyEmail
{
    //
    use  HasFactory;

    protected $table = 'applicant';

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'number'
    ];
    public $timestamps = true;

    protected $hidden= [
        'password',
        'remember_token', 
    ];
}
