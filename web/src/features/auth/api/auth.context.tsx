import { createContext } from 'react';
import { z } from 'zod';

export const AuthContext = createContext<IAuthContext>({
  signIn: async () => {
    throw new Error('AuthContext.signIn is not implemented');
  },
});

export interface IAuthContext {
  signIn: (email: string, password: string) => Promise<void>;
}

export const signInSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type SignInRequest = z.infer<typeof signInSchema>;
