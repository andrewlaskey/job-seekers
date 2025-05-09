"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ApplicationStatus,
  ApplicationWithInterviews,
} from "@/types/applications.types";
import { Rectangle, ResponsiveContainer, Sankey, Tooltip } from "recharts";

interface ApplicationSankeyProps {
  applications: ApplicationWithInterviews[];
}

type SankeyNode = {
  name: ApplicationStatus | string;
  color?: string;
};

type SankeyLink = {
  source: number;
  target: number;
  value: number;
};

type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
};

type TooltipData = {
  isNode: boolean;
  nodeName?: string;
  sourceName?: string;
  targetName?: string;
  value?: number;
  position: { x: number; y: number };
};

const STATUS_COLORS = {
  [ApplicationStatus.FOUND]: "#ffbf46",
  [ApplicationStatus.APPLIED]: "#00a5cf",
  [ApplicationStatus.INTERVIEWING]: "#7ae582",
  [ApplicationStatus.REJECTED]: "#cb807d",
  [ApplicationStatus.EXPIRED]: "#1f2937",
  [ApplicationStatus.ARCHIVED]: "#1f2937",
  [ApplicationStatus.OFFER]: "#25a18e",
  Interview: "#7ae582",
};

function prepareDataForSankey(
  applications: ApplicationWithInterviews[]
): SankeyData {
  // Use the ApplicationStatus enum values for states, but remove INTERVIEWING
  const states = [
    ApplicationStatus.FOUND,
    ApplicationStatus.APPLIED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.OFFER,
    ApplicationStatus.EXPIRED,
    ApplicationStatus.ARCHIVED,
  ];

  // Create nodes with colors
  const nodes: SankeyNode[] = [];
  // Basic states
  states.forEach((state) => {
    nodes.push({
      name: state,
      color: STATUS_COLORS[state],
    });
  });

  // Add interview round nodes (up to the maximum found in data)
  const maxInterviews = applications.reduce((max, app) => {
    return Math.max(max, app.interviews ? app.interviews.length : 0);
  }, 0);

  for (let i = 1; i <= maxInterviews; i++) {
    nodes.push({
      name: `Interview ${i}`,
      color: STATUS_COLORS["Interview"],
    });
  }

  // Create links
  const links: SankeyLink[] = [];

  // Count transitions between states
  const transitions: Record<string, number> = {};

  applications.forEach((app) => {
    // Get the application status as an ApplicationStatus enum value
    // Default to lowercase if it doesn't match (for backward compatibility)
    const appStatus = (app.status?.toUpperCase() as ApplicationStatus) || null;

    // FOUND -> APPLIED
    if (app.found_at && app.applied_at) {
      const key = `${ApplicationStatus.FOUND}-${ApplicationStatus.APPLIED}`;
      transitions[key] = (transitions[key] || 0) + 1;
    }

    // FOUND -> EXPIRED (if not applied)
    if (
      app.found_at &&
      !app.applied_at &&
      appStatus === ApplicationStatus.EXPIRED
    ) {
      const key = `${ApplicationStatus.FOUND}-${ApplicationStatus.EXPIRED}`;
      transitions[key] = (transitions[key] || 0) + 1;
    }

    // FOUND -> ARCHIVED (if not applied and archived)
    if (
      app.found_at &&
      !app.applied_at &&
      appStatus === ApplicationStatus.ARCHIVED
    ) {
      const key = `${ApplicationStatus.FOUND}-${ApplicationStatus.ARCHIVED}`;
      transitions[key] = (transitions[key] || 0) + 1;
    }

    // Interview-related transitions
    if (app.interviews && app.interviews.length > 0) {
      // APPLIED -> Interview 1 (direct link to first interview)
      if (app.applied_at) {
        const key = `${ApplicationStatus.APPLIED}-Interview 1`;
        transitions[key] = (transitions[key] || 0) + 1;
      }

      // Interview progression (Interview 1 -> Interview 2, etc.)
      for (let i = 1; i < app.interviews.length; i++) {
        const key = `Interview ${i}-Interview ${i + 1}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }

      // Last interview -> Final state
      const lastInterviewIndex = app.interviews.length;
      if (app.rejected_at) {
        const key = `Interview ${lastInterviewIndex}-${ApplicationStatus.REJECTED}`;
        transitions[key] = (transitions[key] || 0) + 1;
      } else if (appStatus === ApplicationStatus.OFFER) {
        const key = `Interview ${lastInterviewIndex}-${ApplicationStatus.OFFER}`;
        transitions[key] = (transitions[key] || 0) + 1;
      } else if (appStatus === ApplicationStatus.ARCHIVED) {
        const key = `Interview ${lastInterviewIndex}-${ApplicationStatus.ARCHIVED}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }
    } else {
      // Direct transitions for applications without interviews

      // APPLIED -> REJECTED (if rejected without interviews)
      if (app.applied_at && app.rejected_at) {
        const key = `${ApplicationStatus.APPLIED}-${ApplicationStatus.REJECTED}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }

      // APPLIED -> OFFER (direct offer without interviews)
      if (app.applied_at && appStatus === ApplicationStatus.OFFER) {
        const key = `${ApplicationStatus.APPLIED}-${ApplicationStatus.OFFER}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }

      // APPLIED -> ARCHIVED (if archived without interviews)
      if (app.applied_at && appStatus === ApplicationStatus.ARCHIVED) {
        const key = `${ApplicationStatus.APPLIED}-${ApplicationStatus.ARCHIVED}`;
        transitions[key] = (transitions[key] || 0) + 1;
      }
    }
  });

  // Convert transitions to links
  Object.keys(transitions).forEach((key) => {
    const [source, target] = key.split("-");
    const sourceIndex = nodes.findIndex((node) => node.name === source);
    const targetIndex = nodes.findIndex((node) => node.name === target);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      links.push({
        source: sourceIndex,
        target: targetIndex,
        value: transitions[key],
      });
    }
  });

  return { nodes, links };
}

export default function ApplicationSankey({
  applications,
}: ApplicationSankeyProps) {
  const sankeyData = useMemo(
    () => prepareDataForSankey(applications),
    [applications]
  );

  // Create a custom node component
  const CustomNode = (props: any) => {
    const { x, y, width, height, payload, index } = props;
    const color = payload.color || "#8884d8";

    // Calculate the sum of all incoming and outgoing links for this node
    const nodeValue = (() => {
      // For incoming links (when node is target)
      const incoming = sankeyData.links.reduce((sum, link) => {
        return link.target === index ? sum + link.value : sum;
      }, 0);

      // For outgoing links (when node is source)
      const outgoing = sankeyData.links.reduce((sum, link) => {
        return link.source === index ? sum + link.value : sum;
      }, 0);

      // For nodes with no incoming links, use outgoing
      // For intermediate nodes, use either incoming or outgoing (they should be equal)
      // For terminal nodes, use incoming
      return incoming === 0 ? outgoing : incoming;
    })();

    if (nodeValue === 0) {
        return (<></>)
    }

    return (
      <>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={0.8}
        />
        <text
          x={x + width + 10}
          y={y + height / 2}
          textAnchor="start"
          dominantBaseline="middle"
          className="text-sm font-medium"
          style={{ pointerEvents: "none" }}
        >
          {payload.name}
        </text>
        <text
          x={x + width + 10}
          y={y + height / 2 + 15}
          textAnchor="start"
          dominantBaseline="middle"
          className="text-xs"
          style={{ pointerEvents: "none" }}
        >
          {nodeValue} application{nodeValue !== 1 ? "s" : ""}
        </text>
      </>
    );
  };

  useEffect(() => {
    console.log("Sankey Data:", JSON.stringify(sankeyData));
  }, [sankeyData]);

  return (
    <div className="w-full p-4 relative">
      <ResponsiveContainer width="100%" height={360}>
        <Sankey
          data={sankeyData}
          nodeWidth={20}
          nodePadding={60}
          margin={{ top: 10, right: 100, bottom: 10, left: 30 }}
          link={{
            stroke: "#d0d0d0",
            strokeOpacity: 0.5,
          }}
          node={<CustomNode />}
        />
      </ResponsiveContainer>
    </div>
  );
}
