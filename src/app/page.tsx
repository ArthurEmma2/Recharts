"use client";

import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select, TextField } from "@mui/material"; // Import TextField for the amount input
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";

import VestingChart from "./component/vestingChat";

import dayjs, { Dayjs } from "dayjs";

interface Interval {
  value: number;
  label: string;
}

const intervals: Interval[] = [
  { value: 1000, label: "Second" },
  { value: 1000 * 60, label: "Minute" },
  { value: 1000 * 60 * 60, label: "Hour" },
  { value: 1000 * 60 * 60 * 24, label: "Daily" },
  { value: 1000 * 60 * 60 * 24 * 7, label: "Weekly" },
  { value: 1000 * 60 * 60 * 24 * 14, label: "Biweekly" },
  { value: 1000 * 60 * 60 * 24 * 30, label: "Monthly" },
  { value: 1000 * 60 * 60 * 24 * 90, label: "Quarterly" },
  { value: 1000 * 60 * 60 * 24 * 365, label: "Yearly" },
];

const now = dayjs();

function Page() {
  // Default values
  const defaultStartDate = now.toDate();
  const defaultStartTime = now.toDate();
  const defaultEndDate = now.add(2, "day").toDate();
  const defaultEndTime = dayjs(defaultEndDate).hour(18).minute(0).toDate();

  // State initializations
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [startTime, setStartTime] = useState<Date | null>(defaultStartTime);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [endTime, setEndTime] = useState<Date | null>(defaultEndTime);
  const [unlockSchedule, setUnlockSchedule] = useState<number>(1000);
  const [amount, setAmount] = useState<number | undefined>(1);

  // Functions to handle changes
  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue ? newValue.toDate() : null);
  };

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue ? newValue.toDate() : null);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue ? newValue.toDate() : null);
  };

  const handleEndTimeChange = (newValue: Dayjs | null) => {
    setEndTime(newValue ? newValue.toDate() : null);
  };

  // Handle amount input change
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Validate input to accept only numbers
    if (/^\d*$/.test(inputValue)) {
      setAmount(inputValue === "" ? undefined : parseInt(inputValue));
    }
  };

  // Log values for debugging
  console.log("startDate:", startDate);
  console.log("startTime:", startTime);
  console.log("endDate:", endDate);
  console.log("endTime:", endTime);
  console.log("unlockSchedule:", unlockSchedule);
  console.log("amount:", amount); // Log the amount value
  useEffect(()=>{
    console.log("unlockSchedule:", unlockSchedule);
  },[unlockSchedule])

  const handleChangeSchedule = (e:any) =>{
    // console.log("startDate?.toString()",dayjs(startDate).format("YYYY-MM-DD"));
    // console.log("startTime?.toString()",dayjs(startTime).format("HH:mm:ss"));
    console.log("value",e.target.value);
    // const start = dayjs(dayjs(startDate).format("YYYY-MM-DD") + " " + dayjs(startTime).format("HH:mm:ss")).valueOf()
    // console.log("start",start);
    // const end = start + e.target.value
    // console.log("end",end);
    // setEndDate(dayjs(end).toDate())
    // setEndTime(dayjs(end).toDate())
    setUnlockSchedule(e.target.value)
    // setEndTime()
  }

  return (
    <div className="px-32 mx-auto flex flex-col items-center justify-center my-32">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Start Time and Date */}
        <div className="py-2">
          <p className="font-bold text-base text-white">Start Time and Date</p>
        </div>
        <div className="flex gap-4">
          <div>
            <FormControl
              variant="filled"
              className="2xl:w-[380px] md:w-[295px]"
              sx={{ backgroundColor: "white" }}
            >
              <DatePicker
                value={dayjs(startDate)}
                onChange={handleStartDateChange}
              />
            </FormControl>
          </div>
          <FormControl
            variant="filled"
            className="2xl:w-[380px] md:w-[295px]"
            sx={{ backgroundColor: "white" }}
          >
            <TimePicker
              views={["hours", "minutes"]}
              value={startTime ? dayjs(startTime) : null}
              onChange={handleStartTimeChange}
            />
          </FormControl>
        </div>

        {/* End Time and Date */}
        <div className="pt-6">
          <div className="py-2">
            <p className="font-bold text-base text-white">End Time and Date</p>
          </div>
          <div className="flex gap-4">
            <div>
              <FormControl
                variant="filled"
                className="2xl:w-[380px] md:w-[295px]"
                sx={{ backgroundColor: "white" }}
                
              >
                <DatePicker
                  value={endDate ? dayjs(endDate) : null}
                  onChange={handleEndDateChange}
                />
              </FormControl>
            </div>
            <FormControl
              variant="filled"
              className="2xl:w-[380px] md:w-[295px]"
              sx={{ backgroundColor: "white" }}
            >
              <TimePicker
                views={["hours", "minutes"]}
                value={endTime ? dayjs(endTime) : null}
                onChange={handleEndTimeChange}
              />
            </FormControl>
          </div>
        </div>

        {/* Unlock Schedule */}
        <div className="pt-6">
          <p className="font-bold text-base mb-2 text-white">Unlock Schedule</p>
          <FormControl
            className="2xl:w-[775px] md:w-[600px]"
            sx={{ backgroundColor: "white" }}
          >
            <Select
              value={unlockSchedule}
              onChange={handleChangeSchedule}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {intervals.map((interval) => (
                <MenuItem
                  className="capitalize"
                  key={interval.value}
                  value={interval.value}
                >
                  {interval.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Amount Input */}
        <div className="pt-6">
          <p className="font-bold text-base mb-2 text-white">Amount</p>
          <TextField
            type="number"
            variant="filled"
            value={amount ?? ""}
            onChange={handleAmountChange}
            sx={{ backgroundColor: "white" }}
          />
        </div>

        {/* Vesting Chart */}
        <VestingChart
        unlockSchedule={unlockSchedule}
          startTime={
            startDate && startTime
              ? new Date(
                  startDate.getFullYear(),
                  startDate.getMonth(),
                  startDate.getDate(),
                  startTime.getHours(),
                  startTime.getMinutes()
                ).getTime()
              : 0
          }
          endTime={
            endDate && endTime
              ? new Date(
                  endDate.getFullYear(),
                  endDate.getMonth(),
                  endDate.getDate(),
                  endTime.getHours(),
                  endTime.getMinutes()
                ).getTime()
              : 0
          }
          amount={amount} // Pass the amount to the VestingChart component
          width="80%"
          height={250}
        />
      </LocalizationProvider>
    </div>
  );
}

export default Page;
