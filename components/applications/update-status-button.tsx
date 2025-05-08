'use client';

import { useState } from 'react';
import { ApplicationStatus } from "@/types/applications.types";
import ApplicationStatusBadge from "./application-status";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { updateApplicationStatus } from '@/actions/applicationActions';
import { Check, X } from 'lucide-react';

export interface UpdateStatusButtonProps {
  applicationId: number;
  currentStatus: ApplicationStatus;
}

export default function UpdateStatusButton({
  applicationId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  const statuses = Object.values(ApplicationStatus);

  const handleStatusSelect = (newStatus: ApplicationStatus) => {
    setPendingStatus(newStatus);
  }

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    
    setIsLoading(true);
    try {
      const result = await updateApplicationStatus(applicationId, pendingStatus);
      
      if (result.error) {
        console.error(result.error);
        // You might want to show a toast or error message here
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
      setPendingStatus(null);
    }
  }

  const handleCancel = () => {
    setPendingStatus(null);
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
        <div className={isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
          <ApplicationStatusBadge 
            status={currentStatus} 
          />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select new status</DropdownMenuLabel>
          {statuses
            .filter((status) => status !== currentStatus)
            .map((status) => (
              <DropdownMenuItem 
                key={status} 
                className="flex items-center justify-between gap-2"
                onSelect={(e) => {
                  e.preventDefault(); // Prevent dropdown from closing
                  handleStatusSelect(status);
                }}
                disabled={isLoading}
              >
                <ApplicationStatusBadge status={status} />
                {pendingStatus === status && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm();
                      }}
                      className="rounded-full bg-green-500 hover:bg-green-600 text-white p-1 transition-colors"
                      disabled={isLoading}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                      className="rounded-full bg-red-500 hover:bg-red-600 text-white p-1 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

