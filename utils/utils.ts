import { format } from "date-fns";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function formatDate(dateString: string | null) {
  if (!dateString) return 'Not set'
  return format(new Date(dateString), 'PPP')
}

export function formatDateTime(dateString: string | null) {
  if (!dateString) return 'Not scheduled'
  return format(new Date(dateString), 'PPP p')
}