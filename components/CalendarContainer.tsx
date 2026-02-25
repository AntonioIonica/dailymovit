"use client";

import "@/app/Calendar.css";
import Calendar from "react-calendar";
import { DateValue } from "@/app/movs/[id]/page";
import { Workouts } from "@/app/movs/[id]/page";

const CalendarContainer = ({
  dateValue,
  setDateValue,
  workoutsData,
  calSize = "smallCal",
}: {
  dateValue: DateValue;
  setDateValue: React.Dispatch<React.SetStateAction<DateValue>>;
  workoutsData: Workouts;
  calSize: "smallCal" | "largeCal";
}) => {
  return (
    <div>
      <Calendar
        onChange={setDateValue}
        value={dateValue}
        className={`text-md h-full w-full ${calSize}`}
        defaultValue={new Date()}
        calendarType="gregory"
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          // Check if there are any workouts in a day to mark it
          const hasWorkout = workoutsData?.some((workout) => {
            const workoutDate = new Date(workout.completed_at);

            // Comparing by parsing to the same date type
            return workoutDate.toDateString() === date.toDateString();
          });

          return hasWorkout ? "workout_day" : "";
        }}
      />
    </div>
  );
};

export default CalendarContainer;
