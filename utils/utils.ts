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
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "Not set";
  return format(new Date(dateString), "PPP");
}

export function formatDateTime(dateString: string | null) {
  if (!dateString) return "Not scheduled";
  return format(new Date(dateString), "PPP p");
}

export function formatDateShort(dateString: string | null) {
  if (!dateString) return "Not set";
  return format(new Date(dateString), "P");
}

// Format date for datetime-local input (in local timezone)
export const formatForDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Create Date from datetime-local input (treats as local time)
export const createDateFromLocalInput = (dateTimeString: string): Date => {

  const [datePart, timePart] = dateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
};