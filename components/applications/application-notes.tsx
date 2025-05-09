"use client";

import { Application } from "@/types/applications.types";
import EditableNotes from "../ui/editable-notes";
import { updateApplicationNotes } from "@/actions/applicationActions";
import { useState } from "react";

interface ApplicationNotesProps {
  application: Application;
}

export default function ApplicationNotes({
  application,
}: ApplicationNotesProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const onUpdate = async (editedNotes: string | null) => {
    setIsUpdating(true);
    try {
      const { error } = await updateApplicationNotes(
        application.id,
        editedNotes
      );

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <EditableNotes
      notes={application.notes}
      title="Notes"
      onUpdate={onUpdate}
      disabled={isUpdating}
    />
  );
}
