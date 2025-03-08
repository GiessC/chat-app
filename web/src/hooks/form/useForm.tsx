import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn, UseFormReturn as UseReactHookFormReturn } from "react-hook-form";
import { z } from "zod";
import { useForm as useReactHookForm, UseFormProps as UseReactHookFormProps } from "react-hook-form";

export function useForm<TSchema extends z.ZodTypeAny, TFormValues extends FieldValues = z.infer<TSchema>> ({
  schema,
  ...options
}: UseFormProps<TSchema>): UseFormReturn<TFormValues> {
  const result = useReactHookForm<TFormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    reValidateMode: "onChange",
    ...options
  });

  const registerWithoutRef: UseFormRegister<TFormValues> = (name: FieldPath<TFormValues>, options?: RegisterOptions<TFormValues, FieldPath<TFormValues>>) => {
    const registerReturn = result.register(
      name,
      options
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref, ...rest } = registerReturn;
    return rest;
  }

  return {
    ...result,
    registerWithoutRef
  };
}

export interface UseFormProps<TSchema extends z.ZodTypeAny, TFormValues extends FieldValues = z.infer<TSchema>> extends Omit<UseReactHookFormProps<TFormValues>, 'resolver' | 'schema' | 'mode' | 'revalidateMode'> {
  schema: TSchema;
}

export interface UseFormReturn<TFormValues extends FieldValues> extends UseReactHookFormReturn<TFormValues> {
  registerWithoutRef: UseFormRegister<TFormValues, FieldPath<TFormValues>>;
}

type UseFormRegister<TFormValues extends FieldValues, TFieldName extends FieldPath<TFormValues> = FieldPath<TFormValues>> = (name: TFieldName) => Omit<UseFormRegisterReturn<TFieldName>, 'ref'>;
