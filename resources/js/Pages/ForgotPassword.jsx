import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";
import "../../css/Register.css";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    console.log('Errors:', errors);
    console.log('Data:', data);

    const submitHandler = (e) => {
        e.preventDefault();
        post(route("forgot-password.send"), {
            onError: (err) => {
                if (err.message) {
                    setErrorMessage(err.message);
                }
            },
            onFinish: () => {
                reset("email");
                setErrorMessage("");
            },
        });
    };

    return (
        <>
            <Head title="PRA | Forgot Password Page" />
            <div className="container mx-auto animate-fadeIn">
                <div className="py-4 mb-5 bg-gray-500 text-white text-center">
                    <p className="text-2xl">Password Reset Application</p>
                </div>
                <h2 className="text-2xl font-bold mb-5 text-center">Forgot Password</h2>
                <form onSubmit={submitHandler} className="space-y-6 form-container">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            className="input-field"
                            autoComplete="email"
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="text-red-500 text-sm mt-2" />
                    </div>
                    {errorMessage && <p className="text-red-500 text-center text-sm">{errorMessage}</p>}
                    <div className="text-center">
                        <PrimaryButton className="submit-button" disabled={processing}>
                            {processing ? "Processing..." : "Send Reset Link"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}
