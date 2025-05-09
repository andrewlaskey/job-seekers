"use client";

import { Interview } from "@/types/applications.types";
import EditableNotes from "../ui/editable-notes";
import { useState } from "react";
import { updateInterviewNotes } from "@/actions/interviewActions";

interface InterviewNotesProps {
  interview: Interview;
}

export default function InterviewNotes({ interview }: InterviewNotesProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const onUpdate = async (editedNotes: string | null) => {
    setIsUpdating(true);
    try {
      const { error } = await updateInterviewNotes(interview.id, editedNotes);

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
    <div className="mt-2">
      <EditableNotes
        notes={interview.notes}
        title="Notes"
        onUpdate={onUpdate}
        disabled={isUpdating}
      />
    </div>
  );
}
