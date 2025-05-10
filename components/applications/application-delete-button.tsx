"use client";

import DeleteButton from "../ui/delete-button";

interface DeleteApplicationButtonProps {
  applicationId: number;
}

export default function DeleteApplicationButton({
  applicationId,
}: DeleteApplicationButtonProps) {
  const deleteAction = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <DeleteButton
      text="Delete Application"
      redirectPath="/applications"
      asyncDeleteAction={deleteAction}
    />
  );
}
