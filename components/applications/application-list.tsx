"use client";

import { Application, ApplicationStatus } from "@/types/applications.types";
import ApplicationCard from "./appllication-card";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ApplicationListProps {
  applications?: Application[];
}

export default function ApplicationList({
  applications,
}: ApplicationListProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredList = useMemo(() => {
    if (applications) {
      let filtered = applications;

      if (statusFilter && statusFilter.length) {
        filtered = applications.filter((app) => app.status === statusFilter);
      }

      if (isSearchActive && searchText && searchText.length) {
        const lowered = searchText.toLowerCase();
        filtered = filtered.filter(
          (app) =>
            app.company?.toLowerCase().includes(lowered) ||
            app.title?.toLowerCase().includes(lowered)
        );
      }

      return filtered;
    }

    return [];
  }, [applications, statusFilter, isSearchActive]);

  const onStatusSelectChange = (newStatus: ApplicationStatus | "") => {
    setStatusFilter(newStatus);
  };

  const handleSearchTextChange = (searchStr: string) => {
    setSearchText(searchStr);
  };

  const clearStatusFilter = () => {
    setStatusFilter(null);
  };

  const filterBySearch = () => {
    setIsSearchActive(true);
  };

  const clearSearchFilter = () => {
    setSearchText(null);
    setIsSearchActive(false);
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex py-8 gap-2">
          <select
            onChange={(e) =>
              onStatusSelectChange(e.target.value as ApplicationStatus)
            }
            className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <option value="">-- Filter by status --</option>
            <option value={ApplicationStatus.APPLIED}>
              {ApplicationStatus.APPLIED}
            </option>
            <option value={ApplicationStatus.FOUND}>
              {ApplicationStatus.FOUND}
            </option>
            <option value={ApplicationStatus.INTERVIEWING}>
              {ApplicationStatus.INTERVIEWING}
            </option>
            <option value={ApplicationStatus.REJECTED}>
              {ApplicationStatus.REJECTED}
            </option>
            <option value={ApplicationStatus.ARCHIVED}>
              {ApplicationStatus.ARCHIVED}
            </option>
            <option value={ApplicationStatus.EXPIRED}>
              {ApplicationStatus.EXPIRED}
            </option>
            <option value={ApplicationStatus.OFFER}>
              {ApplicationStatus.OFFER}
            </option>
          </select>
          {statusFilter && statusFilter.length > 0 && (
            <Button variant="outline" onClick={clearStatusFilter}>
              Clear
            </Button>
          )}
        </div>
        <div className="flex py-8 gap-2">
          <Input
            value={searchText || ""}
            placeholder="Filter by title or company"
            onChange={(e) => handleSearchTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                filterBySearch();
              } else if (e.key === "Escape") {
                clearSearchFilter();
              }
            }}
          />
          {isSearchActive ? (
            <Button variant="outline" onClick={clearSearchFilter}>
              Clear
            </Button>
          ) : (
            <Button variant="outline" onClick={filterBySearch}>
              Search
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm py-4">
        Showing {filteredList.length} of{" "}
        {applications ? applications.length : 0}
      </div>
      {filteredList.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="space-y-4 p-4">
            {filteredList.map((application) => (
              <ApplicationCard application={application} key={application.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            It's tough out there, but you got this!
          </p>
        </div>
      )}
    </div>
  );
}
