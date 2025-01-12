import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../css/Register.css'; 
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        number: '', 
    });

    const [errorMessage, setErrorMessage] = useState('');
    console.log('Data:', data);
    console.log('Errors:', errors);

    const submitHandler = (e) => {
        e.preventDefault();
        
        post(route('register'), {
            onError: (err) => {
                if(err.message){
                    setErrorMessage(err.message);
                }
            },
            onFinish: () => {
                reset('pasword','password_confirmation');
                setErrorMessage('');
            }
        });
    };

    return (
        <>
            <Head title="PRA | Register Page" />

            <div className="container mx-auto animate-fadeIn">
                <div className="py-4 mb-5 bg-gray-500 text-white text-center reset">
                    <p className="text-2xl font">Password Reset Application</p>
                </div>

                <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>

                <form onSubmit={submitHandler} className="space-y-6 form-container">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="input-field"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="text-red-500 text-sm mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            className="input-field"
                            autoComplete="username"
                            onChange={(e) => setData('username', e.target.value)}
                        />
                        <InputError message={errors.username} className="text-red-500 text-sm mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="input-field"
                            autoComplete="email"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="text-red-500 text-sm mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="number" value="Phone Number" />
                        <TextInput
                            id="number"
                            type="text"
                            name="number"
                            value={data.number}
                            className="input-field"
                            autoComplete="phone"
                            onChange={(e) => setData('number', e.target.value)}
                        />
                        <InputError message={errors.number} className="text-red-500 text-sm mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="text-red-500 text-sm mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                        <InputError message={errors.password_confirmation} className="text-red-500 text-sm mt-2" />
                    </div>
                            {
                                errorMessage && (
                                    <p className="text-blue-500 text-center text-sm">{errorMessage}</p>
                                )
                            }
                    <div className="text-center">
                        <PrimaryButton className="submit-button" disabled={processing}>
                            {processing ? 'Processing...' : 'Register'}
                        </PrimaryButton>
                    </div>

                    <div className="text-center mt-3 font-bold">
                        <Link href={route('login')}>Already have an account? Click to login</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
