import { createContext } from 'react';

export const AuthContext = createContext<IAuthContext>({
  signIn: async () => {
    throw new Error('AuthContext.signIn is not implemented');
  },
});

export interface IAuthContext {
  signIn: (email: string, password: string) => Promise<void>;
}