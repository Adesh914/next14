"use server";

import { z } from "zod";


const registerSchema = z.object({
    firstName: z.string().min(3, { message: "Must be 3 or more character long." }),
    lastName: z.string().min(2, { message: "Must be 3 or more character long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(3, "Password is too short.")
});

export async function CreateUser(_prevState, FormData) {
    console.log("FormData:", FormData);
    const register = registerSchema.safeParse({
        firstName: FormData.get('firstName'),
        lastName: FormData.get('lastName'),
        email: FormData.get('email'),
        password: FormData.get('password')
    });
    console.log(register)
    try {


        if (register.success) {
            // save the data, send an email, etc.
            redirect("/");
        } else {
            return {
                errors: validation.error.issues,
            };
        }

    } catch (err) {
        console.log("Error:", err);
    }
}