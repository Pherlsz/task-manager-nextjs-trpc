import { TRPCClientError } from "@trpc/client";
import { t } from "@/i18n";

type ZodFlattenedError = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

/**
 * Extracts the first human-readable Zod validation message from `data.zodError`
 * instead of displaying raw serialized JSON to the user.
 */
export function extractTrpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    const zodError = (
      error.data as { zodError?: ZodFlattenedError | null } | undefined
    )?.zodError;

    if (zodError) {
      const firstFieldError = Object.values(zodError.fieldErrors ?? {})
        .flat()
        .find((msg): msg is string => Boolean(msg));
      if (firstFieldError) {
        return firstFieldError;
      }

      const firstFormError = zodError.formErrors?.find(Boolean);
      if (firstFormError) {
        return firstFormError;
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return t("errors.unexpected");
}
