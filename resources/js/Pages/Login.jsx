import { Head, Link, useForm } from '@inertiajs/react';
import '../../css/Register.css';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

 
    const [errorMessage, setErrorMessage] = useState('');
    console.log('Data:', data);
    console.log('Errors:', errors);

    const submitHandler = (e) => {
        e.preventDefault();

      post(route('login'), {
            onError: (err) => {
                if (err.message) {
                    setErrorMessage(err.message); 
                }
            },
            onFinish: () => {
                reset('password');
                setErrorMessage(''); 
            },
        });

    };

    // useEffect(()=>{

    // },[])

    return (
        <>
            <Head title=" PRA | Login Page" />
            <div className="container mx-auto animate-fadeIn">
                <div className="py-4 mb-5 bg-gray-500 text-white text-center reset">
                    <p className="text-2xl font">Password Reset Application</p>
                </div>
                <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>
                <form onSubmit={submitHandler} className="space-y-6 form-container">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            isFocused={true}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="input-field"
                        />
                        <InputError message={errors.email} className="text-red-500 text-sm mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="input-field"
                        />
                        <InputError message={errors.password} className="text-red-500 text-sm mt-3" />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
                    )}
                    <div className="text-center">
                        <PrimaryButton type="submit" className="submit-button" disabled={processing}>
                            {processing ? 'Processing...' : 'Login'}
                        </PrimaryButton>
                    </div>
                    <div className="flex justify-between mt-3 font-bold">
                        <Link href={route('register')}>Don't have an account? Register</Link>
                        <Link href={route('forgot-password.form')} className="text-blue-600 links">
                            Forget Password?
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
