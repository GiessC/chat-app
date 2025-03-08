import SignIn from "./app/pages/auth/sign-in/sign-in.page";
import Providers from "./providers";

function App() {
  return (
    <Providers>
      <SignIn />
    </Providers>
  );
}

export default App;
