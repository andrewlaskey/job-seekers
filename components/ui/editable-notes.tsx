import React, { useState } from 'react';
import { FileText, Edit2, Check, X } from 'lucide-react';

interface EditableNotesProps {
    notes: string | null;
    title: string;
    onUpdate: (editedNotes: string | null) => void;
    disabled: boolean;
}

export default function EditableNotes({ notes, title = "Notes", onUpdate, disabled = false }: EditableNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedNotes(notes); // Reset to original value when starting edit
  };

  // Handle save changes
  const handleSave = () => {
    onUpdate(editedNotes);
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setEditedNotes(notes); // Reset to original value
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-gray-400 mr-2" />
          {title}
        </div>
        
        {!isEditing && !disabled && (
          <button 
            onClick={handleEditClick}
            className="text-primary hover:text-accent flex items-center text-sm"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </h2>

      {isEditing ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <textarea
            value={editedNotes || ''}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="w-full min-h-32 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Add your notes here..."
            autoFocus
          />
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={handleCancel}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-accent flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">
            {notes || 'No notes available.'}
          </p>
        </div>
      )}
    </div>
  );
};