import { addDays, format, subDays, getDay } from "date-fns";
import { ApplicationWithInterviews } from "@/types/applications.types";
import { formatDateShort } from "@/utils/utils";

interface ActivityGraphProps {
  applications: ApplicationWithInterviews[] | undefined;
}

interface ActivityCounter {
  interviews: number;
  applications: number;
}

interface DayData {
  date: string;
  activity: ActivityCounter;
  dayOfWeek: number;
}

function generateLast90DaysData(): DayData[] {
  const result: DayData[] = [];
  const today = new Date();
  const startDay = subDays(today, 90);

  for (let i = 1; i <= 90; i++) {
    const date = addDays(startDay, i);
    const dateString = format(date, "MM/dd/yyyy");
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    
    result.push({
      date: dateString,
      activity: { interviews: 0, applications: 0 },
      dayOfWeek
    });
  }

  return result;
}

function organizeIntoWeeks(days: DayData[]): DayData[][] {
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  // Fill in empty days at the beginning of the first week if needed
  if (days.length > 0) {
    const firstDayOfWeek = days[0].dayOfWeek;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        activity: { interviews: 0, applications: 0 },
        dayOfWeek: i
      });
    }
  }

  days.forEach((day) => {
    currentWeek.push(day);
    
    // If we've completed a week (7 days) or it's Saturday (day 6), start a new week
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Fill in the last week if it's incomplete
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      date: '',
      activity: { interviews: 0, applications: 0 },
      dayOfWeek: currentWeek.length
    });
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function backgroundColorClass(activity: ActivityCounter, isEmpty: boolean = false) {
  if (isEmpty) {
    return "bg-transparent";
  }

  if (activity.interviews > 0) {
    return "bg-xanthous";
  }

  if (activity.applications === 1) {
    return "bg-persian_green-800";
  } else if (activity.applications === 2) {
    return "bg-persian_green-700";
  } else if (activity.applications === 3) {
    return "bg-persian_green-600";
  } else if (activity.applications === 4) {
    return "bg-persian_green-500";
  } else if (activity.applications >= 5) {
    return "bg-persian_green-400";
  }

  return "bg-gray-100";
}

export default function ActivityGraph({ applications }: ActivityGraphProps) {
  const activityByDate = applications?.reduce((dates, application) => {
    if (application.applied_at) {
      const key = formatDateShort(application.applied_at);

      if (dates.has(key)) {
        const item = dates.get(key);

        if (item) {
          item.applications++;
        }
      } else {
        dates.set(key, { interviews: 0, applications: 1 });
      }
    }

    if (application.interviews && application.interviews.length > 0) {
      application.interviews.forEach((interview) => {
        if (interview.scheduled_at) {
          const key = formatDateShort(interview.scheduled_at);

          if (dates.has(key)) {
            const item = dates.get(key);

            if (item) {
              item.interviews++;
            }
          } else {
            dates.set(key, { interviews: 1, applications: 0 });
          }
        }
      });
    }

    return dates;
  }, new Map<string, { applications: number; interviews: number }>());

  const past90DaysData = generateLast90DaysData();

  // Merge activity data with the 90-day structure
  past90DaysData.forEach((dayData) => {
    const activity = activityByDate?.get(dayData.date);
    if (activity) {
      dayData.activity = activity;
    }
  });

  const weeks = organizeIntoWeeks(past90DaysData);

  return (
    <div className="py-8">
      <div className="flex gap-1 sm:gap-2 justify-center">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1 sm:gap-2">
            {week.map((day, dayIndex) => {
              const isEmpty = day.date === '';
              return (
                <div 
                  key={`${weekIndex}-${dayIndex}`} 
                  className={`group relative size-5 sm:size-6 md:w-8 md:h-5 lg:w-10 lg:h-5 shrink ${backgroundColorClass(day.activity, isEmpty)} rounded-sm md:rounded lg:rounded-md`}
                >
                  {!isEmpty && (
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 whitespace-nowrap z-10 rounded-md shadow-lg">
                      <p className="font-semibold">{day.date}</p>
                      <p>Applications: {day.activity.applications}</p>
                      <p>Interviews: {day.activity.interviews}</p>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};