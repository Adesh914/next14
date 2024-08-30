"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
// ecosystems,
const LoginSchema = z.object({
    UserName: z.string().email().min(1, { message: "Hobbies is required" }),
    Password: z.string().min(4, { message: "password is required" })
});
const Login = () => {
    const [formData, setFormData] = useState({ UserName: "", Password: "" });
    const [errors, setErrors] = useState({});
    const [respError, setRespError] = useState(``);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const handleLogin = async (e) => {
        e.preventDefault();
        const result = LoginSchema.safeParse(formData);
        try {
            if (!result.success) {
                // Proceed with form submission
                console.log("hi:", formData, result.error.flatten())
                // setErrors(result.error.formErrors.fieldErrors);
                setErrors(result.error.flatten());
            } else {
                const formData = new FormData(e.currentTarget);
                // Handle validation errors
                console.log("success", result.data, e.currentTarget);
                const res = await signIn("credentials", {
                    email: formData.get("UserName"),
                    password: formData.get("Password"),
                    redirect: false,
                });
                if (res?.error) {
                    setRespError(res.error)
                };
                if (!res?.error) {
                    return router.push("/admin");
                };
            }
        } catch (e) {
            console.log("error:", e)
        }

    }

    const changeHandler = (e) => {
        console.log(e.target.value)
        setFormData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        })
    }
    return (
        <div className="outer">
            <h1>Login Form</h1>

            {respError}
            <div className="inner">
                <form onSubmit={handleLogin}>


                    <p> <input className="in" onChange={changeHandler} type="email" name="UserName" placeholder="Type your Email" value={formData.email} /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.UserName ? (
                        <span className="text-red-500">{errors.fieldErrors['UserName']}</span>
                    ) : null}


                    <p><input className="in" onChange={changeHandler} type="password" name="Password" placeholder="Type your Password" value={formData.password} /><i className="fa-solid fa-lock"></i></p>
                    {errors?.fieldErrors?.Password ? (
                        <span className="text-red-500">{errors.fieldErrors['Password']}</span>
                    ) : null}

                    <p>Already have an account <a href="#">Forget Password?</a></p>

                    <p><input className="btn" type="submit" value="Submit" />&nbsp;<input className="btn" type="reset" value="Reset" /></p>
                </form>
            </div>
        </div>
    )
}

export default Login;