import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";
import "../../css/Register.css";

export default function ResetPassword({ token }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
        password_confirmation: "",
        otp: token,
    });
    const [errorMessage, setErrorMessage] = useState("");
    console.log('Errors:', errors);
    console.log('Data:', data);

    const submitHandler = (e) => {
        e.preventDefault();
        post(route("reset-password.update"), {
            onError: (err) => {
                if (err.message) {
                    setErrorMessage(err.message);
                }
            },
            onFinish: () => {
                reset();
                setErrorMessage("");
            },
        });
    };

    return (
        <>
            <Head title="PRA | Reset Password Page" />
            <div className="container mx-auto animate-fadeIn">
                <div className="py-4 mb-5 bg-gray-500 text-white text-center">
                    <p className="text-2xl">Password Reset Application</p>
                </div>
                <h2 className="text-2xl font-bold mt-5 mb-5 text-center">Reset Password</h2>
                <form onSubmit={submitHandler} className="space-y-6 form-container">
                    <div>
                        <InputLabel htmlFor="password" value="New Password" />
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={data.password}
                            className="input-field"
                            autoComplete="password"
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        <InputError message={errors.password} className="text-red-500 text-sm mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="input-field"
                            autoComplete="password_confirmation"
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="text-red-500 text-sm mt-2"
                        />
                    </div>
                    {errorMessage && <p className="text-red-500 text-center text-sm">{errorMessage}</p>}
                    <div className="text-center">
                        <PrimaryButton className="submit-button" disabled={processing}>
                            {processing ? "Processing..." : "Reset Password"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}
