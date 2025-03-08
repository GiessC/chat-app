import { z } from "zod";
import { useForm } from "@/hooks/form/useForm";
import Form from "@/components/ui/Form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/base/ui/form";
import { Input } from "@/components/base/ui/input";
import { Button } from "@/components/base/ui/button";

const signInSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignInRequest = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(request: SignInRequest) {
    console.log(request);
  }

  return (
    <Form onSubmit={onSubmit} {...form}>
      <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder='Username' {...field} />
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