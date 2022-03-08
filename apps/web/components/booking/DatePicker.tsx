import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { EventType, PeriodType } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import dayjsBusinessTime from "dayjs-business-time";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { memoize } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import classNames from "@lib/classNames";
import { timeZone } from "@lib/clock";
import { weekdayNames } from "@lib/core/i18n/weekday";
import { doWorkAsync } from "@lib/doWorkAsync";
import { useLocale } from "@lib/hooks/useLocale";
import getSlots from "@lib/slots";
import { WorkingHours } from "@lib/types/schedule";

import Loader from "@components/Loader";

dayjs.extend(dayjsBusinessTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type DatePickerProps = {
  weekStart: string;
  onDatePicked: (pickedDate: Dayjs) => void;
  workingHours: WorkingHours[];
  eventLength: number;
  date: Dayjs | null;
  periodType: PeriodType;
  periodStartDate: Date | null;
  periodEndDate: Date | null;
  periodDays: number | null;
  periodCountCalendarDays: boolean | null;
  minimumBookingNotice: number;
};

function isOutOfBounds(
  time: dayjs.ConfigType,
  {
    periodType,
    periodDays,
    periodCountCalendarDays,
    periodStartDate,
    periodEndDate,
  }: Pick<
    EventType,
    "periodType" | "periodDays" | "periodCountCalendarDays" | "periodStartDate" | "periodEndDate"
  >
) {
  const date = dayjs(time);

  switch (periodType) {
    case PeriodType.ROLLING: {
      const periodRollingEndDay = periodCountCalendarDays
        ? dayjs().utcOffset(date.utcOffset()).add(periodDays!, "days").endOf("day")
        : dayjs().utcOffset(date.utcOffset()).addBusinessTime(periodDays!, "days").endOf("day");
      return date.endOf("day").isAfter(periodRollingEndDay);
    }

    case PeriodType.RANGE: {
      const periodRangeStartDay = dayjs(periodStartDate).utcOffset(date.utcOffset()).endOf("day");
      const periodRangeEndDay = dayjs(periodEndDate).utcOffset(date.utcOffset()).endOf("day");
      return date.endOf("day").isBefore(periodRangeStartDay) || date.endOf("day").isAfter(periodRangeEndDay);
    }

    case PeriodType.UNLIMITED:
    default:
      return false;
  }
}

function DatePicker({
  weekStart,
  onDatePicked,
  workingHours,
  eventLength,
  date,
  periodType = PeriodType.UNLIMITED,
  periodStartDate,
  periodEndDate,
  periodDays,
  periodCountCalendarDays,
  minimumBookingNotice,
}: DatePickerProps): JSX.Element {
  const { i18n } = useLocale();
  const [browsingDate, setBrowsingDate] = useState<Dayjs | null>(date);

  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [isFirstMonth, setIsFirstMonth] = useState<boolean>(false);
  const [daysFromState, setDays] = useState<
    | {
        disabled: Boolean;
        date: number;
      }[]
    | null
  >(null);
  useEffect(() => {
    if (!browsingDate || (date && browsingDate.utcOffset() !== date?.utcOffset())) {
      setBrowsingDate(date || dayjs().tz(timeZone()));
    }
  }, [date, browsingDate]);

  useEffect(() => {
    if (browsingDate) {
      setMonth(browsingDate.toDate().toLocaleString(i18n.language, { month: "long" }));
      setYear(browsingDate.format("YYYY"));
      setIsFirstMonth(browsingDate.startOf("month").isBefore(dayjs()));
      setDays(null);
    }
  }, [browsingDate, i18n.language]);

  const isDisabled = (
    day: number,
    {
      browsingDate,
      periodType,
      periodStartDate,
      periodEndDate,
      periodCountCalendarDays,
      periodDays,
      eventLength,
      minimumBookingNotice,
      workingHours,
    }
  ) => {
    const date = browsingDate.startOf("day").date(day);
    return (
      isOutOfBounds(date, {
        periodType,
        periodStartDate,
        periodEndDate,
        periodCountCalendarDays,
        periodDays,
      }) ||
      !getSlots({
        inviteeDate: date,
        frequency: eventLength,
        minimumBookingNotice,
        workingHours,
      }).length
    );
  };

  const isDisabledRef = useRef(
    memoize(isDisabled, (day, { browsingDate }) => {
      // Make a composite cache key
      return day + "_" + browsingDate.toString();
    })
  );

  const days = (() => {
    if (!browsingDate) {
      return [];
    }
    if (daysFromState) {
      return daysFromState;
    }
    // Create placeholder elements for empty days in first week
    let weekdayOfFirst = browsingDate.date(1).day();
    if (weekStart === "Monday") {
      weekdayOfFirst -= 1;
      if (weekdayOfFirst < 0) weekdayOfFirst = 6;
    }

    const days = Array(weekdayOfFirst).fill(null);

    const isDisabledMemoized = isDisabledRef.current;

    const daysInMonth = browsingDate.daysInMonth();
    const daysInitialOffset = days.length;

    // Build UI with All dates disabled
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        disabled: true,
        date: i,
      });
    }

    // Update dates with their availability
    doWorkAsync({
      batch: 1,
      name: "DatePicker",
      length: daysInMonth,
      callback: (i: number, isLast) => {
        let day = i + 1;
        days[daysInitialOffset + i] = {
          disabled: isDisabledMemoized(day, {
            browsingDate,
            periodType,
            periodStartDate,
            periodEndDate,
            periodCountCalendarDays,
            periodDays,
            eventLength,
            minimumBookingNotice,
            workingHours,
          }),
          date: day,
        };
      },
      batchDone: () => {
        setDays([...days]);
      },
    });

    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })();

  if (!browsingDate) {
    return <Loader />;
  }

  // Handle month changes
  const incrementMonth = () => {
    setBrowsingDate(browsingDate?.add(1, "month"));
  };

  const decrementMonth = () => {
    setBrowsingDate(browsingDate?.subtract(1, "month"));
  };

  return (
    <div
      className={
        "mt-8 sm:mt-0 sm:min-w-[455px] " +
        (date
          ? "w-full sm:w-1/2 sm:border-r sm:pl-4 sm:pr-6 sm:dark:border-gray-800 md:w-1/3 "
          : "w-full sm:pl-4")
      }>
      <div className="mb-4 flex text-xl font-light text-gray-600">
        <span className="w-1/2 text-gray-600 dark:text-white">
          <strong className="text-gray-900 dark:text-white">{month}</strong>{" "}
          <span className="text-gray-500">{year}</span>
        </span>
        <div className="w-1/2 text-right text-gray-600 dark:text-gray-400">
          <button
            onClick={decrementMonth}
            className={classNames(
              "group p-1 ltr:mr-2 rtl:ml-2",
              isFirstMonth && "text-gray-400 dark:text-gray-600"
            )}
            disabled={isFirstMonth}
            data-testid="decrementMonth">
            <ChevronLeftIcon className="h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
          </button>
          <button className="group p-1" onClick={incrementMonth} data-testid="incrementMonth">
            <ChevronRightIcon className="h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 border-t border-b text-center dark:border-gray-800 sm:border-0">
        {weekdayNames(i18n.language, weekStart === "Sunday" ? 0 : 1, "short").map((weekDay) => (
          <div key={weekDay} className="my-4 text-xs uppercase tracking-widest text-gray-500">
            {weekDay}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, idx) => (
          <div
            key={day === null ? `e-${idx}` : `day-${day.date}`}
            style={{
              paddingTop: "100%",
            }}
            className="relative w-full">
            {day === null ? (
              <div key={`e-${idx}`} />
            ) : (
              <button
                onClick={() => onDatePicked(browsingDate.date(day.date))}
                disabled={day.disabled}
                className={classNames(
                  "absolute top-0 left-0 right-0 bottom-0 mx-auto w-full rounded-sm text-center",
                  "hover:border-brand hover:border dark:hover:border-white",
                  day.disabled ? "cursor-default font-light text-gray-400 hover:border-0" : "font-medium",
                  date && date.isSame(browsingDate.date(day.date), "day")
                    ? "bg-brand text-brandcontrast dark:bg-darkmodebrand dark:text-darkmodebrandcontrast"
                    : !day.disabled
                    ? " bg-gray-100 dark:bg-gray-600 dark:text-white"
                    : ""
                )}
                data-testid="day"
                data-disabled={day.disabled}>
                {day.date}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatePicker;
