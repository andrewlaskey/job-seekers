"use client";

import { Application } from "@/types/applications.types";
import { createDateFromLocalInput } from "@/utils/utils";
import { format, isThisISOWeek, subDays } from "date-fns";
import { draw } from "radash";
import { useEffect, useState } from "react";

interface ApplicationEncouragementTextProps {
  applications: Application[];
}

const weeklyMessages = [
  "You've applied to {count} jobs this week. Great work! 👏",
  "Amazing! You've submitted {count} applications this week! 🌟",
  "{count} applications this week - you're crushing it! 💪",
  "Way to go! {count} job applications completed this week! 🎯",
  "You're on fire! {count} applications sent out this week! 🚀",
  "Fantastic progress - {count} applications this week! Keep it up! ✨",
  "{count} applications this week! Your future self will thank you! 🙌",
  "Impressive! {count} opportunities pursued this week! 📈"
];

const streakMessages = [
  "You're on a {count}-day application streak! 🔥",
  "Incredible! You've applied to jobs for {count} days straight! 🔥",
  "{count} days in a row - you're building amazing momentum! ⚡",
  "What a streak! {count} consecutive days of job hunting! 🏆",
  "{count}-day streak! Consistency is your superpower! 💫",
  "Unstoppable! {count} days of continuous progress! 🌟",
  "{count} days running - you're absolutely crushing this! 🎯",
  "{count}-day winning streak! Your dedication is inspiring! 🚀",
  "Amazing consistency! {count} days of taking action! 👏"
];

export default function ApplicationEncouragementText({
  applications,
}: ApplicationEncouragementTextProps) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let totalAppliedThisWeek = 0;
    let streakLength = 0;
    const applicationDays = new Set<string>();

    for (const app of applications) {
      if (app.applied_at) {
        const appliedAtDate = createDateFromLocalInput(app.applied_at);

        if (isThisISOWeek(appliedAtDate)) {
          totalAppliedThisWeek++;
        }

        applicationDays.add(format(appliedAtDate, "yyyy-MM-dd"));
      }
    }

    let currentDate = new Date();
    let hasApplicationToday = applicationDays.has(
      format(currentDate, "yyyy-MM-dd")
    );

    if (!hasApplicationToday) {
      currentDate = subDays(currentDate, 1);
    }

    while (applicationDays.has(format(currentDate, "yyyy-MM-dd"))) {
      streakLength++;
      currentDate = subDays(currentDate, 1);
    }

    if (totalAppliedThisWeek > 0 || streakLength > 0) {
      if (streakLength > totalAppliedThisWeek) {
        const template = draw(streakMessages) || streakMessages[0];
        setText(template.replace("{count}", streakLength.toString()));
      } else {
        const template = draw(weeklyMessages) || weeklyMessages[0];
        setText(template.replace("{count}", totalAppliedThisWeek.toString()));
      }
    }
  }, [applications]);

  return (
    <div>{text && <p className="text-lg text-gray-600 mb-4">{text}</p>}</div>
  );
}