import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Amplify } from 'aws-amplify';
import { config } from './config/config.ts';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.USER_POOL_ID,
      userPoolClientId: config.USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true
        },
        preferred_username: {
          required: true,
        }
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireUppercase: true,
        requireSpecialCharacters: true,
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
