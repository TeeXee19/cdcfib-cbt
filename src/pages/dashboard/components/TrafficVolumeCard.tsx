import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMovementCountsQuery } from "../../../hooks/dashboard.hooks";
import { MovementMonthlyCounts } from "../../../types/apiResponse";
import LineChart from "../../../components/molecules/LineChart";

const TrafficVolumeCard: React.FC = () => {



  // Default range: last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const [startDate, setStartDate] = useState<Date | null>(sixMonthsAgo);
  const [endDate, setEndDate] = useState<Date | null>(now);

  const { data, isLoading, error } = useMovementCountsQuery(startDate, endDate);
  if (isLoading && !data) {
    return (
      <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-boxdark">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-boxdark">
        <p className="text-red-500">Failed to load traffic data</p>
      </div>
    );
  }

  // Helper: convert month string to Date
  // const parseMonth = (monthStr: string) => {
  //   const parts = monthStr.split(/[-\s]/);
  //   if (parts.length === 2 && parts[0].length === 4) {
  //     // format YYYY-MM
  //     return new Date(`${parts[0]}-${parts[1]}-01`);
  //   } else {
  //     return new Date(monthStr);
  //   }
  // };

  // Enforce max 6 months range
  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const maxEnd = new Date(date);
    maxEnd.setMonth(date.getMonth() + 5); // 6 months inclusive
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    const minStart = new Date(date);
    minStart.setMonth(date.getMonth() - 5); // 6 months inclusive
    setEndDate(date);
    console.log(date)
  };

  // Filter monthly data by date range
  const filterByDateRange = (counts: { month: string; count: number }[]) => {
    return counts
    // .filter((m) => {
    //   const monthDate = parseMonth(m.month);
    //   return (
    //     startDate !== null &&
    //     endDate !== null &&
    //     monthDate >= startDate &&
    //     monthDate <= endDate
    //   );
    // });
  };

  const labels =
    data && data.length > 0 && startDate && endDate
      ? filterByDateRange(data[0].monthlyCounts).map((m) => m.month)
      : [];

  const arrivals =
    data
      ?.find((d: MovementMonthlyCounts) => d.movementDirectionId === "Entry")
      ?.monthlyCounts && startDate && endDate
      ? filterByDateRange(
        data.find(
          (d: MovementMonthlyCounts) => d.movementDirectionId === "Entry"
        )!.monthlyCounts
      ).map((m) => m.count)
      : [];

  const departures =
    data
      ?.find((d: MovementMonthlyCounts) => d.movementDirectionId === "Exit")
      ?.monthlyCounts && startDate && endDate
      ? filterByDateRange(
        data.find(
          (d: MovementMonthlyCounts) => d.movementDirectionId === "Exit"
        )!.monthlyCounts
      ).map((m) => m.count)
      : [];

  console.log('pulled data', arrivals)

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-boxdark">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Traffic Volume
        </h3>

        {/* Date Range Picker with Calendar */}
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            // startDate={startDate}
            // endDate={endDate}
            dateFormat="dd MMM yyyy"
            className="px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-white"
          />
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            // startDate={startDate}
            // endDate={endDate}
            // minDate={startDate || undefined}
            dateFormat="dd MMM yyyy"
            className="px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Chart */}
      <LineChart
        labels={labels}
        datasets={[
          { label: "Arrivals", data: arrivals },
          { label: "Departures", data: departures },
        ]}
        showLegend
      />
    </div>
  );
};

export default TrafficVolumeCard;
