import { z } from "zod";

const UserLoginValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
})

export const AuthValidations = {
    UserLoginValidationSchema
}