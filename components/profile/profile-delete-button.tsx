"use client";

import DeleteButton from "../ui/delete-button";

interface ProfileDeleteButtonProps {
  userId: string;
}

export default function ProfileDeleteButton({
  userId,
}: ProfileDeleteButtonProps) {
  const deleteAction = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
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
    <DeleteButton text="Delete Account" redirectPath="/" asyncDeleteAction={deleteAction} />
  );
}
