import { FieldValues, FormProviderProps, SubmitHandler } from 'react-hook-form';
import { Form as BaseForm } from '../base/ui/form';

export default function Form<TFormValues extends FieldValues>({ className, onSubmit, children, ...form }: FormProps<TFormValues>) {
  return (
    <BaseForm {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </BaseForm>
  );
}

interface FormProps<TFormValues extends FieldValues> extends FormProviderProps<TFormValues> {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
}