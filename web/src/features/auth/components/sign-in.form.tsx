import { useForm } from "@/hooks/form/useForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/ui/form";
import { Input } from "@/components/base/ui/input";
import { Button } from "@/components/base/ui/button";
import { useContext } from "react";
import { AuthContext, SignInRequest, signInSchema } from "../api/auth.context";
import Form from "@/components/ui/Form";

export default function SignInForm() {
  const { signIn } = useContext(AuthContext);

  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(request: SignInRequest) {
    await signIn(request.email, request.password);
  }

  return (
    <Form onSubmit={onSubmit} {...form}>
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder='Email' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input placeholder='Password' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type='submit'>Sign in</Button>
    </Form>
  )
}