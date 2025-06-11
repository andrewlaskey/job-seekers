"use client";

import { ApplicationWithInterviews } from "@/types/applications.types";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface InterviewSourceChartProps {
  applications: ApplicationWithInterviews[];
}

export default function InterviewSourceChart({
  applications,
}: InterviewSourceChartProps) {
  const chartData = useMemo(() => {
    const sources = applications.reduce((acc, application) => {
      if (
        application.url &&
        application.interviews &&
        application.interviews.length > 0
      ) {
        try {
          const url = new URL(application.url);
          const domain = url.hostname;
          const item = acc.get(domain);

          if (item) {
            acc.set(domain, item + application.interviews.length);
          } else {
            acc.set(domain, 1);
          }
        } catch (e) {
          // ignore
        }
      }
      return acc;
    }, new Map<string, number>());

    return Array.from(sources).map(([domain, interviews]) => ({
      domain,
      interviews,
    }));
  }, [applications]);

  return (
    <div>
      <h4 className="font-bold text-md text-center">Interviews by Source</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={800} height={300} data={chartData}>
          <XAxis dataKey="domain" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="interviews" fill="#ffbf46" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
