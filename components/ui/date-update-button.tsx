"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface DateUpdateButtonProps {
  currentDate: string | null;
  asyncUpdateFn: (
    date: string
  ) => Promise<{ success?: boolean; error?: string }>;
}

export default function DateUpdateButton({
  currentDate,
  asyncUpdateFn,
}: DateUpdateButtonProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    currentDate ? new Date(currentDate) : null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDateChange = async (date: Date | null) => {
    if (!date) return;

    setIsUpdating(true);
    try {
      const { error } = await asyncUpdateFn(date.toISOString());

      if (error) {
        console.error("Failed to update interview date:", error);
      } else {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
      }
    } catch (error) {
      console.error("Error updating interview date:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div>
      <button
        onClick={() => setIsDatePickerOpen(true)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="change date"
        disabled={isUpdating}
      >
        <Calendar className="h-4 w-4 text-gray-500" />
      </button>

      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Select New Date</h3>
            <input
              type="datetime-local"
              defaultValue={
                selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : ""
              }
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleDateChange(date);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdating}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isUpdating}
              >
                Cancel
              </button>
              {isUpdating && (
                <span className="px-4 py-2 text-sm font-medium text-gray-500">
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
