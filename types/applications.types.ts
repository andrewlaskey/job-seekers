import type { Database } from './database.types';

export enum ApplicationStatus {
    FOUND = 'FOUND',
    APPLIED = 'APPLIED',
    REJECTED = 'REJECTED',
    INTERVIEWING = 'INTERVIEWING',
    OFFER = 'OFFER',
    ARCHIVED = 'ARCHIVED',
    EXPIRED = 'EXPIRED'
}

export type Application = Database['public']['Tables']['applications']['Row'] & {
    status: ApplicationStatus;
  };
  
  export type ApplicationInsert = Omit<Database['public']['Tables']['applications']['Insert'], 'status'> & {
    status: ApplicationStatus;
  };

  export type ApplicationUpdate = Omit<Database['public']['Tables']['applications']['Update'], 'status'> & {
    status: ApplicationStatus;
  };

export type ApplicationInsertFormData = {
    title: string;
    company: string;
    url: string;
    notes: string;
}

export type Interview = Database['public']['Tables']['interviews']['Row'];

export type InterviewJoinApplications = Interview & {
  applications: Partial<Application>;
}