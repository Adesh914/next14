"use client"
import $ from "jquery";
import { useEffect, useState } from "react";
import { z } from "zod"
const registerSchema = z.object({
    firstName: z.string().min(3, { message: "Must be 3 or more character long." }),
    lastName: z.string().min(2, { message: "Must be 3 or more character long." }),
    emailId: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(3, "Password is too short.")
});
const Register = () => {
    const [formdata, setFormdata] = useState({ firstName: '', lastName: '', emailId: '', password: '' });
    const [errors, setErrors] = useState();
    useEffect(() => {
        // console.log($('[type="email"]').val("adesh.mvc@gmail.com"))
        // $("#registerEmail").off().on("change", function () {
        //     console.log($(this).val())
        // })
    }, [])

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
        console.log(register)
        try {
            if (!register.success) {
                setErrors(register.error.flatten());
            } else {
                console.log("success:", register.data);
            }

        } catch (err) {
            console.log("Error:", err);
        }
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
                    <p><input className="in" type="email" onChange={changeHandler} name="emailId" id="registerEmail" value={formdata.emailId} placeholder="Type your Email" /><i className="fa-solid fa-user"></i></p>
                    {errors?.fieldErrors?.emailId ? (
                        <span className="text-red-500">{errors.fieldErrors['emailId']}</span>
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