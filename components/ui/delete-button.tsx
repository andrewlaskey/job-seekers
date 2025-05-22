"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  text: string;
  redirectPath: string;
  asyncDeleteAction: () => Promise<boolean>;
}

export default function DeleteButton({
  text,
  asyncDeleteAction,
  redirectPath,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);

      const actionSuccess = await asyncDeleteAction();

      if (!actionSuccess) {
        throw new Error("Failed to delete user");
      }

      router.refresh();
      router.push(redirectPath);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete");
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
          className="flex w-full sm:w-auto items-center"
        >
          <Trash className="h-4 w-4 mr-2" />
          {text}
        </Button>
      )}

      {isConfirming && !isDeleting && (
        <div className="inline-flex items-center gap-1 border-old_rose-300 border-2 rounded-md px-4 py-2 bg-old_rose-300 text-white">
          <Trash className="h-4 w-4 mr-2" />
          <span className="text-sm text-white">Are you sure?</span>
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
        <div className="inline-flex items-center gap-1 border-old_rose-300 border-2 rounded-md px-4 py-2 bg-old_rose-300 text-white">
          <Trash className="h-4 w-4 mr-2" />
          Deleting...
        </div>
      )}
    </div>
  );
}
