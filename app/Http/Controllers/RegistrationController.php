<?php
namespace App\Http\Controllers;

use App\Models\Applicant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Mail\SendOTP;


class RegistrationController extends Controller
{
    public function create(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Please fill in the registration details.',
                'status' => 400,
                'success' => true,
            ]);
        }
        return Inertia::render('Register');
    }

    public function store(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'name' => 'required|string|max:50',
            'username' => 'required|string|max:50|unique:applicant',
            'email' => 'required|email|max:50|unique:applicant',
            'password' => 'required|string|min:5|confirmed',
            'number' => 'required|numeric|digits:10',
        ]);

        if ($validator->fails()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed, please check your input.',
                    'status' => 'error',
                ]);
            }

            return back()->withErrors($validator)->withInput();
        }

        $applicant = Applicant::create([
            'name' => $req->name,
            'username' => $req->username,
            'email' => $req->email,
            'password' => Hash::make($req->password),
            'number' => $req->number,
        ]);

        auth()->login($applicant);

        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Registration successful, welcome!',
                'status' => 'success',
                'success' => true,
            ]);
        }

        return redirect()->route('login');
    }

    public function login(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'errors' => $validator->errors()->toArray(),
                    'message' => 'Validation failed, check your credentials',
                    'status' => 'error',
                ]);
            }
            return Inertia::render('Login', [
                'errors' => $validator->errors()->toArray(),
                'data' => $req->only('email'),
            ]);
        }

        $applicant = Applicant::where('email', $req->email)->first();
        if (!$applicant) {
            if ($req->wantsJson()) {
                return response()->json([
                    'message' => 'No records of email address found in database.',
                    'success' => false,
                    'status' => 'error',
                    'errors' => [
                        'email' => 'No records of email address found in the database'
                    ],
                ]);
            }
            return Inertia::render('Login', [
                'message' => 'No records of email address found in database.',
                'success' => false,
                'status' => 'error',
                'errors' => [
                    'email' => 'No records of email address found in database'
                ],
                'data' => $req->only('email'),
            ]);
        }

        if (!Hash::check($req->password, $applicant->password)) {
            if ($req->wantsJson()) {
                return response()->json([
                    'message' => 'Incorrect password for the email.',
                    'status' => 'error',
                    'success' => false,
                    'errors' => [
                        'password' => 'Incorrect password for the email.'
                    ],
                ]);
            }
            return Inertia::render('Login', [
                'message' => 'Incorrect password for the email.',
                'success' => false,
                'status' => 'error',
                'errors' => [
                    'password' => 'Incorrect password for the email.'
                ],
                'data' => $req->only('email'),
            ]);
        }
        auth()->login($applicant);
        $req->session()->regenerate();

        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Welcome to the Home Page.',
                'success' => true,
                'status' => 'success',
            ]);
        }
        return redirect()->route('home');
    }

    public function showLoginForm(Request $request)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Please enter your login details.',
                'status' => 'success',
            ]);
        }

        return Inertia::render('Login');
    }

    public function home(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Welcome to the Home Page!',
                'status' => 'success',
                'name' => $user->name,
            ]);
        }

        return Inertia::render('Home', [
            'name' => $user->name,
        ]);
    }

    public function logout(Request $req)
    {
        Auth::logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'You have logged-out successfully',
                'status' => 200,
                'success' => true,
            ]);
        }
        return redirect()->route('login');
    }

    public function showLinkRequestForm(Request $req)
    {
        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Please enter your email address to receive the OTP',
                'status' => 'success',
                'code' => 200,
            ]);
        }
        return Inertia::render('ForgotPassword', [
            'message' => 'Please enter your email address to receive the OTP',
            'status' => 'success',
            'code' => 200,
        ]);
    }

    public function sendResetLinkEmail(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'email' => 'required|email|exists:applicant,email',
        ]);

        if ($validator->fails()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed, check your input',
                    'status' => 'error',
                    'code' => 400,
                ]);
            }
            
            return back()->withErrors($validator)->withInput();
        }

        $otp = rand(100000, 999999); 
        $expiry = Carbon::now()->addMinutes(10); 

        DB::table('password_resets')->updateOrInsert(
            ['email' => $req->email],
            ['otp' => $otp, 'expires_at' => $expiry]
        );
        Mail::to($req->email)->send(new \App\Mail\SendOTP($otp));
        session(['email' => $req->email]);

        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'We have sent an OTP to your email',
                'status' => 'success',
                'code' => 200,
                'email' => $req->email,
            ]);
        }

        return redirect()->route('otp.verify.form', ['email' => $req->email])->with('message', 'OTP has been sent to your email address.');;
    }

    public function showOtpVerificationForm(Request $req)
    {
        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Please enter the OTP sent to your email',
                'status' => 'success',
                'code' => 201,
            ]);
        }
    
        $email = $req->query('email') ?? session('email');
    
        if (!$email) {
            return redirect()->route('forgot-password')->withErrors([
                'email' => 'Email is required to verify OTP',
            ]);
        }
    
        return Inertia::render('VerifyOtp', [
            'email' => $email, 
            'message' => 'OTP has been sent to your Email Address.',
            'status' => 'success',
            'code' => 201,
        ]);
    }
    
    public function verifyOtp(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'otp' => 'required|numeric|digits:6',
        ]);
    
        if ($validator->fails()) {
            if($req->wantsJson()){
                return response()->json([
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed, check your OTP',
                    'status' => 'error',
                    'code' => 400,
                ]);
            }
            return back()->withErrors($validator)->withInput();
        }
    
        $email = $req->query('email') ?? session('email');
        
        if (!$email) {
            if ($req->wantsJson()) {
                return response()->json([
                    'message' => 'Email not found in session',
                    'status' => 'error',
                    'code' => 400,
                ]);
            }
            return back()->withErrors(['email' => 'Email is required for OTP verification.']);
        }
    
        $resetRecord = DB::table('password_resets')->where('email', $email)->first();
    
        if (!$resetRecord || $resetRecord->otp != $req->otp || Carbon::parse($resetRecord->expires_at)->isPast()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'message' => 'Invalid or Expired OTP',
                    'status' => 'error',
                    'code' => 400,
                ]);
            }
            return back()->withErrors([
                'otp' => 'Invalid or Expired OTP.'
            ]);
        }
    
        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'OTP Verified successfully.',
                'status' => 'success',
                'redirect_url' => route('reset-password.form', ['token' => $resetRecord->otp]),
            ]);
        }
    
        return redirect()->route('reset-password.form', ['token' => $resetRecord->otp]);
    }

    public function showResetForm(Request $req, $token = null)
    {
        $resetRecord = DB::table('password_resets')->where('otp', $token)->first();
    
        if (!$resetRecord || Carbon::parse($resetRecord->expires_at)->isPast()) {
            return redirect()->route('forgot-password')->withErrors([
                'token' => 'The reset link has expired or is invalid.',
            ]);
        }
    
        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Please enter your new password.',
                'status' => 'success',
                'code' => 200,
                'token' => $token,
            ]);
        }

        return Inertia::render('ResetPassword', [
            'message' => 'Please enter your new password.',
            'status' => 'success',
            'code' => 201,
            'token' => $token,
        ]);
    }

    public function reset(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'otp' => 'required|numeric|digits:6',
            'password' => 'required|string|min:5|confirmed',
        ]);

        if ($validator->fails()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'errors' => $validator->errors(),
                    'message' => 'Validation failed, check your input.',
                    'status' => 'error'
                ]);
            }
            return back()->withErrors($validator)->withInput();
        }

        $resetRecord = DB::table('password_resets')->where('otp', $req->otp)->first();
        if (!$resetRecord || Carbon::parse($resetRecord->expires_at)->isPast()) {
            if ($req->wantsJson()) {
                return response()->json([
                    'message' => 'Invalid or Expired OTP.',
                    'status' => 'error',
                ]);
            }
            return back()->withErrors([
                'otp' => 'Invalid or Expired OTP.'
            ]);
        }

        $user = Applicant::where('email', $resetRecord->email)->first();
        $user->password = Hash::make($req->password);
        $user->save();

        DB::table('password_resets')->where('email', $resetRecord->email)->delete();

        if ($req->wantsJson()) {
            return response()->json([
                'message' => 'Your password has been reset successfully.',
                'status' => 'success',
                'code' => 201,
            ]);
        }
        return Inertia::render('Login', [
            'message' => 'Your password has been reset successfully.',
            'status' => 'success',
            'code' => 201,
        ]);
    }
}
