import { PropsWithChildren } from "react";
import CognitoAuthProvider from "./features/auth/api/cognito.auth.provider";

export default function Providers({ children }: PropsWithChildren) {
  return <CognitoAuthProvider>{children}</CognitoAuthProvider>;
}