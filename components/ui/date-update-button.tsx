"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { createDateFromLocalInput, formatForDateTimeLocal } from "@/utils/utils";
import { Button } from "@/components/ui/button";

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
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDateChange = async (date: Date | null) => {
    if (!date) return;

    setIsUpdating(true);
    try {
      // Convert to ISO string for database storage (will be in UTC)
      const { error } = await asyncUpdateFn(date.toISOString());

      if (error) {
        console.error("Failed to update date:", error);
      } else {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
        setTempDate(null);
      }
    } catch (error) {
      console.error("Error updating date:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setTempDate(null);
      return;
    }
    
    // Create date from local datetime input and store as temp
    const date = createDateFromLocalInput(value);
    setTempDate(date);
  };

  const handleConfirm = () => {
    if (tempDate) {
      handleDateChange(tempDate);
    }
  };

  const handleCancel = () => {
    setIsDatePickerOpen(false);
    setTempDate(null);
  };

  const handleOpenPicker = () => {
    setIsDatePickerOpen(true);
    // Initialize temp date with current selected date
    setTempDate(selectedDate);
  };

  return (
    <div>
      <button
        onClick={handleOpenPicker}
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
            
            {/* Show current value in local time for reference */}
            {selectedDate && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Current:</strong> {format(selectedDate, "PPpp")}
              </div>
            )}
            
            <input
              type="datetime-local"
              defaultValue={
                selectedDate ? formatForDateTimeLocal(selectedDate) : ""
              }
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdating}
            />
            
            {/* Show preview of new date if different from current */}
            {tempDate && tempDate.getTime() !== selectedDate?.getTime() && (
              <div className="text-sm text-blue-600 mt-2">
                <strong>New:</strong> {format(tempDate, "PPpp")}
              </div>
            )}
            
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleConfirm}
                disabled={isUpdating || !tempDate}
              >
                {isUpdating ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}