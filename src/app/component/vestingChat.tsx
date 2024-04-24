import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataItem {
  time: number;
  value: number; // This represents either the absolute value or a percentage
}

interface VestingChartProps {
  startTime: number;
  endTime?: number;
  amount?: number;
  width?: string | number;
  height?: string | number;
  unlockSchedule:number;
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  amount?: number;
}> = ({ active, payload, label, amount }) => {
  if (active && payload && payload.length) {
    const date = new Date(parseInt(label!));
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const valueDisplay = amount
      ? `${payload[0].value.toFixed(2)}`
      : `${payload[0].value.toFixed(2)}%`;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "5px 10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p>{formattedDate}</p>
        <p>{valueDisplay}</p>
      </div>
    );
  }

  return null;
};

const VestingChart: React.FC<VestingChartProps> = ({
  unlockSchedule,
  startTime,
  endTime,
  amount,
  width = "70%",
  height = 300,
}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [ticks, setTicks] = useState<string[]>([]);

  const calculatedEndTime = endTime ?? startTime + 432000000;

  useEffect(() => {
    setData(generateData(startTime, calculatedEndTime, amount));
  }, [startTime, calculatedEndTime, amount]);

  const generateData = (
    startTime: number,
    endTime: number,
    amount?: number
  ): DataItem[] => {
    const duration = endTime - startTime;
    const data: DataItem[] = [];
    // const interval = determineInterval(duration);
    let interval = unlockSchedule;
    console.log("duration",duration);
    console.log("amount",amount);
    console.log("duration / interval",duration / interval);
    if(duration / interval < 1){
      data.push({ time:endTime, value:amount ?? 0 });
      return data
    }

    if(duration / interval > 2800){
      interval = determineInterval(duration);
    }

    console.log("interval",interval);
    const num = Math.round(duration / interval)

    for (let i = 0; i <= num ; i++) {
      const time = startTime + i * interval;
      const value = amount
        ? (amount / duration) * (time+0.1 - startTime)
        : (100 / duration) * (time - startTime);
        console.log("time",time);
        console.log("endTime",endTime);
        if(i === num){
          data.push({ time, value:amount??0 });
        }else{
          data.push({ time, value });
        }
      console.log("i",i);
    }

    if (data.length > 0) {
      const lastDataIndex = data.length - 1;
      data[lastDataIndex].time = endTime;
      if (!amount) {
        data[lastDataIndex].value = 100;
      }
    }

    return data;
  };

  const determineInterval = (duration: number): number => {
    if (duration <= 60000) return 1000; // less than a minute
    else if (duration <= 3600000) return 60000; // less than an hour
    else if (duration <= 604800000) return 3600000; // less than a week
    else if (duration <= 31536000000) return 604800000; // less than a year
    else return 2628000000; // monthly for durations over a year
  };

  useEffect(() => {
    setData(generateData(startTime, calculatedEndTime, amount));
  }, [startTime, calculatedEndTime, amount, unlockSchedule]);

  useEffect(() => {
    if (data.length) {
      // Convert each timestamp to a string before updating the state
      setTicks(data.map((item) => item.time.toString()));
    }
  }, [data]);

  const formatDateAndTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const uniqueDateFormatter = (timestamps: any[]) => {
    const dates = new Set();
    return timestamps.map((timestamp) => {
      const dateStr = new Date(timestamp).toLocaleDateString();
      if (!dates.has(dateStr)) {
        dates.add(dateStr);
        return formatDateAndTime(timestamp);
      }
      return formatTime(timestamp);
    });
  };

  useEffect(() => {
    if (data.length) {
      // Generate a list of formatted date and time labels without duplicates
      const formattedLabels = uniqueDateFormatter(
        data.map((item) => item.time)
      );
      setTicks(formattedLabels);
    }
  }, [data]);

  // Helper function to generate ticks for 6-hour intervals and end-of-day
  const generateTicks = (
    start: string | number | Date,
    end: string | number | Date
  ) => {
    let current = new Date(start);
    const endOfSchedule = new Date(end);
    const ticks = [];

    while (current <= endOfSchedule) {
      ticks.push(current.getTime());
      // Check if current time is 18:00, if so, add an end-of-day mark by pushing the next day
      if (current.getHours() === 18) {
        // Create a new Date object for the next day
        const nextDay = new Date(current);
        nextDay.setHours(24, 0, 0, 0); // Set to midnight (end of current day)
        ticks.push(nextDay.getTime());
      }
      current = new Date(current.setHours(current.getHours() + 6)); // Add 6 hours
    }
    return ticks;
  };

  // Generate custom ticks based on the function above
  const customTicks = generateTicks(startTime, calculatedEndTime);

  console.log("data:", data);
  console.log("ticks:", ticks);

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, left: 20, right: 10, bottom: 0 }}
      >
        <XAxis
          dataKey="time"
          ticks={customTicks}
          tickFormatter={(value: any, index: number) => {
            const timestamp = value;
            const date = new Date(timestamp);
            const isFirstTick = timestamp === customTicks[0];
            const isLastTick =
              timestamp === customTicks[customTicks.length - 1];
            const isEndOfDay = date.getHours() === 18 || isLastTick;

            // If it's the first or last tick, or the end of the day, show the date
            if (isFirstTick || isEndOfDay) {
              return date.getDate().toString(); // Ensure returning a string
            } else {
              // Otherwise, show the time
              return `${date.getHours().toString().padStart(2, "0")}:00`;
            }
          }}
        />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis
          axisLine={false}
          allowDataOverflow={true}
          tickLine={false}
          tick={{ fill: "#ccc" }}
          width={35}
          tickCount={7}
          tickFormatter={(value) => `${value}${amount ? "" : "%"}`}
          domain={[
            0,
            (dataMax: number) => (amount ? Math.max(dataMax, amount) : 100),
          ]}
        />

        <CartesianGrid vertical={false} stroke="#2c3e50" />

        <Tooltip content={<CustomTooltip amount={amount} />} />
        <Area
          type="stepAfter"
          dataKey="value"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)" // Use the gradient defined above
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VestingChart;
