"use client";
import { useState } from "react";
import { z } from "zod";
// ecosystems,
const LoginSchema = z.object({
    email: z.string().email().min(1, { message: "Hobbies is required" }),
    password: z.string().min(4, { message: "password is required" })
});
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        const result = LoginSchema.safeParse(formData);

        try {
            if (!result.success) {
                // Proceed with form submission
                console.log("hi:", formData, result.error.flatten())
                // setErrors(result.error.formErrors.fieldErrors);
                setErrors(result.error.flatten());
            } else {
                // Handle validation errors
                console.log("success", result.data);
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


            <div className="inner">
                <form onSubmit={handleLogin}>


                    <p> <input className="in" onChange={changeHandler} type="email" name="email" placeholder="Type your Email" value={formData.email} /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.email ? (
                        <span className="text-red-500">{errors.fieldErrors['email']}</span>
                    ) : null}


                    <p><input className="in" onChange={changeHandler} type="password" name="password" placeholder="Type your Password" value={formData.password} /><i className="fa-solid fa-lock"></i></p>
                    {errors?.fieldErrors?.password ? (
                        <span className="text-red-500">{errors.fieldErrors['password']}</span>
                    ) : null}

                    <p>Already have an account <a href="#">Forget Password?</a></p>

                    <p><input className="btn" type="submit" value="Submit" />&nbsp;<input className="btn" type="reset" value="Reset" /></p>
                </form>
            </div>
        </div>
    )
}

export default Login;