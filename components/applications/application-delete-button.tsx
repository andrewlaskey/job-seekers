"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteApplicationButtonProps {
  applicationId: number;
}

export default function DeleteApplicationButton({
  applicationId,
}: DeleteApplicationButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      // Redirect back to applications list
      router.push("/applications");
      router.refresh();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div>
      {!isConfirming && (
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Application
        </Button>
      )}
      {isConfirming && (
        <div className="flex items-center gap-1 border-destructive border-2 rounded-md px-4 py-2">
            <Trash className="h-4 w-4 mr-2" />
            <span className="text-sm text-gray-600">Are you sure?</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
            className="rounded-full bg-green-500 hover:bg-green-600 text-white p-1 transition-colors"
            disabled={isDeleting}
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            className="rounded-full bg-red-500 hover:bg-red-600 text-white p-1 transition-colors"
            disabled={isDeleting}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {isDeleting && (
        <div className="flex items-center gap-1 border-destructive border-2 rounded-md px-4 py-2">
            <Trash className="h-4 w-4 mr-2" />
            Deleting...
        </div>
      )}
    </div>
  );
}
