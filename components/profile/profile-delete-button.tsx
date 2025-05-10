"use client";

import { createClient } from "@/utils/supabase/client";
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

      const supabase = createClient();
      await supabase.auth.signOut();
    
      // Force a full page refresh to clear any cached state
      window.location.href = "/";

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <DeleteButton text="Delete Account" redirectPath="/" asyncDeleteAction={deleteAction} />
  );
}
