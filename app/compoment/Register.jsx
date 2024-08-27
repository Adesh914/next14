"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "@/services/user.query";
import { z } from "zod";


const registerSchema = z.object({
    firstName: z.string().min(3, { message: "Must be 3 or more character long." }),
    lastName: z.string().min(2, { message: "Must be 3 or more character long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(3, "Password is too short.")
});
const Register = () => {
    const [formdata, setFormdata] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [errors, setErrors] = useState();
    const [AddUser, { data, loading, error }] = useMutation(ADD_USER)
    // const toastId = toast.loading('Loading...');
    if (loading) return toast.loading('Waiting...', { id: 'processing_new_user' });
    if (error) toast.error(`Submission error! ${error.message}`, { id: `fail_new_user`, closeOnClick: true, });
    if (data) {

        toast.success("New user added successfully.", { id: 'new_user_success' });
        // setFormdata({ firstName: '', lastName: '', email: '', password: '' });

    }

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormdata((oldRegisterData) => {
            return {
                ...oldRegisterData,
                [name]: value
            }
        })
    }
    const RegisterSubmitHandler = (e) => {
        e.preventDefault();
        const register = registerSchema.safeParse(formdata);

        try {
            if (!register.success) {
                setErrors(register.error.flatten());
            } else {
                console.log("success:", register.data);
                const { firstName, lastName, email, password } = register.data;
                AddUser({
                    variables: {
                        "input": {
                            "email": email,
                            "first_name": firstName,
                            "last_name": lastName,
                            "password": password
                        }

                    }
                })
            }

        } catch (err) {
            console.log("Error:", err);
        }
        // RegisterSubmitHandler
    }

    return (
        <div className="outer">
            <h1>Register Form</h1>


            <div className="inner">
                <form onSubmit={RegisterSubmitHandler}>
                    <p><input className="in" type="text" onChange={changeHandler} name="firstName" value={formdata.firstName} placeholder="Type your first name" /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.firstName ? (
                        <span className="text-red-500">{errors.fieldErrors['firstName']}</span>
                    ) : null}
                    <p><input className="in" type="text" onChange={changeHandler} name="lastName" value={formdata.lastName} placeholder="Type your last name" /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.lastName ? (
                        <span className="text-red-500">{errors.fieldErrors['lastName']}</span>
                    ) : null}
                    <p><input className="in" type="email" onChange={changeHandler} name="email" id="registerEmail" value={formdata.email} placeholder="Type your Email" /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.email ? (
                        <span className="text-red-500">{errors.fieldErrors['email']}</span>
                    ) : null}
                    <p><input className="in" type="password" onChange={changeHandler} name="password" value={formdata.password} placeholder="Type your Password" /><i className="fa-solid fa-lock"></i></p>
                    {errors?.fieldErrors?.password ? (
                        <span className="text-red-500">{errors.fieldErrors['password']}</span>
                    ) : null}
                    <p><input className="btn" type="submit" value="Submit" />&nbsp;<input className="btn" type="reset" value="Reset" /></p>

                </form>
            </div>

        </div>
    )
}
export default Register;

