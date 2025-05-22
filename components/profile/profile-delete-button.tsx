"use client";

import { deleteUserAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";

interface ProfileDeleteButtonProps {
  userId: string;
}

export default function ProfileDeleteButton({
  userId,
}: ProfileDeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showConfirmation) {
    return (
      <button
        onClick={() => setShowConfirmation(true)}
        className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        Delete Account
      </button>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div>
        <h3 className="text-lg font-medium text-red-900">
          Are you absolutely sure?
        </h3>
        <p className="mt-1 text-sm text-red-700">
          This action cannot be undone. This will permanently delete your account,
          all your job applications, interviews, and remove all associated data from our servers.
        </p>
      </div>
      
      <div className="flex gap-3">
        <form>
          <SubmitButton
            formAction={deleteUserAction}
            pendingText="Deleting..."
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Yes, delete my account
          </SubmitButton>
        </form>
        
        <button
          onClick={() => setShowConfirmation(false)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}