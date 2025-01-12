<?php

use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

// Route for Registration:
Route::get('/register', [RegistrationController::class, 'create'])->name('register');
Route::post('/register', [RegistrationController::class, 'store']);

// Route for Login:
Route::get('/login', [RegistrationController::class, 'showLoginForm'])->name('login'); 
Route::post('/login', [RegistrationController::class, 'login']); 

// Route for Forgot Password:
Route::get('/forgot-password', [RegistrationController::class, 'showLinkRequestForm'])->name('forgot-password.form');
Route::post('/forgot-password', [RegistrationController::class, 'sendResetLinkEmail'])->name('forgot-password.send');

// Route for OTP Verification:
Route::get('/otp-verify', [RegistrationController::class, 'showOtpVerificationForm'])->name('otp.verify.form');
Route::post('/otp-verify', [RegistrationController::class, 'verifyOtp'])->name('otp.verify');

// Route for Reset Password:
Route::get('/reset-password/{token}', [RegistrationController::class, 'showResetForm'])->name('reset-password.form');
Route::post('/reset-password', [RegistrationController::class, 'reset'])->name('reset-password.update');

// Route for Home:
Route::middleware(['auth'])->get('/home', [RegistrationController::class, 'home'])->name('home');

// Route for Logout:
Route::post('/logout', [RegistrationController::class, 'logout'])->name('logout');
