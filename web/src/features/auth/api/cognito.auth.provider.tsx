import { PropsWithChildren } from "react";
import { AuthContext } from "./auth.context";
import {
  AuthError as CognitoAuthError,
  signIn as signIntoCognito,
} from 'aws-amplify/auth';
import MustConfirmEmailError from '../types/errors/must-confirm-email.error';
import { AuthError } from '../types/errors/auth.error';
import { InvalidCredentialsError } from '../types/errors/invalid-credentials.error';

export default function CognitoAuthProvider({ children }: PropsWithChildren) {
  async function signIn(email: string, password: string): Promise<void> {
    try {
      const response = await signIntoCognito({
        username: email,
        password,
      });
      if (response.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
        throw new MustConfirmEmailError();
      }
      if (!response.isSignedIn) {
        throw new Error('Response returned that user is not signed in.');
      }
    } catch (error: unknown) {
      if (
        error instanceof CognitoAuthError &&
        error.name === 'UserNotConfirmedException'
      ) {
        throw new MustConfirmEmailError();
      }
      if (
        error instanceof CognitoAuthError &&
        error.name === 'UserNotFoundException'
      ) {
        throw new InvalidCredentialsError('Email or password is incorrect.');
      }
      if (error instanceof MustConfirmEmailError) {
        throw error;
      }
      console.error('Unknown error encountered during sign in:', error);
      throw new AuthError(
        'Failed to sign-in for an unknown reason.',
        error instanceof Error ? error : undefined,
      );
    }
  }

  const contextValue = {
    signIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}