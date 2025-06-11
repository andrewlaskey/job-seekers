"use client";

import { ApplicationWithInterviews } from "@/types/applications.types";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FoundVsInterviewsChartProps {
  applications: ApplicationWithInterviews[];
}

// Define the chart data type
interface ChartDataPoint {
  domain: string;
  found: number;
  interviews: number;
}

// Define the Recharts tooltip payload type
interface TooltipPayload {
  value: number;
  name: string;
  dataKey: string;
  payload: ChartDataPoint;
}

export default function FoundVsInterviewsChart({
  applications,
}: FoundVsInterviewsChartProps) {
  const chartData = useMemo(() => {
    const sources = applications.reduce((acc, application) => {
      if (application.url) {
        try {
          const url = new URL(application.url);
          const domain = url.hostname;
          const item = acc.get(domain);
          const interviewCount =
            application.interviews && application.interviews.length > 0
              ? application.interviews.length
              : 0;

          if (item) {
            item.found++;
            item.interviews += interviewCount;
          } else {
            acc.set(domain, {
              found: 1,
              interviews: interviewCount,
            });
          }
        } catch (e) {
          // ignore
        }
      }
      return acc;
    }, new Map<string, { interviews: number; found: number }>());

    return Array.from(sources).map(([domain, value]) => ({
      domain,
      ...value,
    }));
  }, [applications]);

  const CustomToolTip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload; // This contains the full data point
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-semibold">{data.domain}</p>
          <p>Found: {data.found}</p>
          <p>Interviews: {data.interviews}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h4 className="font-bold text-md text-center">
        Found vs Interviews by Source
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={chartData}>
          <CartesianGrid />
          <XAxis type="number" dataKey="found" name="Found" />
          <YAxis type="number" dataKey="interviews" name="Interviews" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<CustomToolTip />}
          />
          <Scatter fill="#7ae582" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
