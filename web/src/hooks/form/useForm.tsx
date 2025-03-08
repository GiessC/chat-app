import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { useForm as useReactHookForm, UseFormProps as UseReactHookFormProps } from "react-hook-form";

export function useForm<TSchema extends z.ZodTypeAny, TFormValues extends FieldValues = z.infer<TSchema>> ({
  schema,
  ...options
}: UseFormProps<TSchema>) {

  return useReactHookForm<TFormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    reValidateMode: "onChange",
    ...options
  });
}

export interface UseFormProps<TSchema extends z.ZodTypeAny, TFormValues extends FieldValues = z.infer<TSchema>> extends Omit<UseReactHookFormProps<TFormValues>, 'resolver' | 'schema' | 'mode' | 'revalidateMode'> {
  schema: TSchema;
}