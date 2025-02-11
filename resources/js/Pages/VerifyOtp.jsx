import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";
import "../../css/Register.css";

export default function VerifyOtp({ email, message }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        otp: "",
        email: email,
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    console.log('Errors:', errors);
    console.log('Data:', data);

    useEffect(() => {
        document.getElementById("otp-0").focus();
    }, []);

    const handleOtpChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
            setData("otp", newOtp.join(""));
        }
    };

    const handleBackspace = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const otpValue = otp.join("");

        if (!otpValue) {
            setErrorMessage("Please enter the OTP.");
            return;
        }

        setErrorMessage("");
        setData("otp", otpValue);

        post(route("otp.verify"), {
            onError: (err) => {
                if (err.message) {
                    setErrorMessage(err.message);
                }
            },
            onFinish: () => {
                reset("otp");
                setOtp(["", "", "", "", "", ""]);
            },
            onSuccess: () => {
                console.log("OTP Verified.");
            },
        });
    };

    const resendOtp = () => {
        if (!email) {
            setErrorMessage("Email is required.");
            return;
        }
        setResendDisabled(true);
        post(route("forgot-password.send"), {
            data: { email },
            onSuccess: () => {
                console.log("OTP Resent");
                setTimeout(() => {
                    setResendDisabled(false);
                }, 10000);
            },
        });
    };

    return (
        <>
            <Head title="PRA | Verify OTP Page" />
            <div className="container mx-auto animate-fadeIn">
                <div className="py-4 mb-5 bg-gray-500 text-white text-center">
                    <p className="text-2xl">Password Reset Application</p>
                </div>
                <h2 className="text-2xl font-bold mt-5 mb-5 text-center">Verify OTP</h2>
                {message && (
                    <div className="text-center mb-4 text-green-500">
                        {message}
                    </div>
                )}
                <form onSubmit={submitHandler} className="space-y-6 form-container">
                    <div>
                        <InputLabel htmlFor="otp" value="OTP" className="text-center mt-2" />
                        <div className="flex gap-2 justify-center mt-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={digit}
                                    className="w-12 h-12 border text-center text-xl"
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleBackspace(index, e)}
                                />
                            ))}
                        </div>
                        {errorMessage && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}
                        <InputError message={errors.otp} className="text-red-500 text-sm mt-2 text-center" />
                    </div>
                    <div className="text-center">
                        <PrimaryButton className="submit-button" disabled={processing}>
                            {processing ? "Verifying..." : "Verify OTP"}
                        </PrimaryButton>
                        <PrimaryButton
                            type="button"
                            className="submit-button ml-5"
                            onClick={resendOtp}
                            disabled={resendDisabled}
                        >
                            {resendDisabled ? "Resend OTP in 10 seconds" : "Resend OTP"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </>
    );
}
