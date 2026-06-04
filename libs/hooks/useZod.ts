import { useState } from "react";
import { z, ZodObject, ZodRawShape } from "zod";

type UseZodValidationProps<T extends ZodRawShape> = {
  schema: ZodObject<T>;
};

export const useZodValidation = <T extends ZodRawShape>({
  schema,
}: UseZodValidationProps<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    fieldName: keyof z.infer<ZodObject<T>>,
    value: unknown
  ) => {
    const fieldSchema:any = schema.shape[fieldName as string];

    if (!fieldSchema) return;

    const result = fieldSchema?.safeParse(value);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message ?? "";

      setErrors((prev) => ({
        ...prev,
        [fieldName as string]: errorMessage,
      }));
    } else {
      setErrors((prev) => {
        const { [fieldName as string]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (data: z.infer<ZodObject<T>>): boolean => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const errorMap: Record<string, string> = {};

      Object.entries(fieldErrors).forEach(([key, errors]) => {
        if ((errors as [any])?.length) {
          errorMap[key] = (errors as [any])[0];
        }
      });

      setErrors(errorMap);
      return false;
    }

    setErrors({});
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (
    fieldName: keyof z.infer<ZodObject<T>>
  ) => {
    setErrors((prev) => {
      const { [fieldName as string]: _, ...rest } = prev;
      return rest;
    });
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
  };
};