// components/SummaryCards.tsx
// import React from "react";
import { useCardCountsQuery } from "../../../hooks/dashboard.hooks";
import { formatNumber } from "../../../helpers/utils";
import { ArrowUpIcon, ArrowDownIcon,  } from "lucide-react";

const SummaryCards = () => {
  const { data: cardCounts } = useCardCountsQuery();
  const totalTraffic = cardCounts?.reduce((sum, item) => sum + item.count, 0);

  const summaryCards = [
    {
      label: "Total Arrivals",
      color: "#50C878",
      icon: <ArrowDownIcon className="w-6 h-6 text-[#50C878]" />,
      data: cardCounts?.find(c => c.movementDirectionId === "Entry")?.count || 0,
      miniBars: [60, 80, 100, 90, 120],
    },
    {
      label: "Total Departures",
      color: "#3B82F6",
      icon: <ArrowUpIcon className="w-6 h-6 text-[#3B82F6]" />,
      data: cardCounts?.find(c => c.movementDirectionId === "Exit")?.count || 0,
      miniBars: [50, 70, 90, 85, 100],
    },
    {
      label: "Total Traffic Volume",
      color: "#F59E0B",
      icon: <ArrowUpIcon className="w-6 h-6 text-[#F59E0B]" />,
      data: totalTraffic || 0,
      miniBars: [110, 130, 140, 125, 150],
    },
    {
      label: "Suspicious Alerts",
      color: "#f2524a",
       icon: <ArrowUpIcon className="w-6 h-6 text-[#f2524a]" />,
      data: totalTraffic || 0,
      miniBars: [10, 15, 20, 18, 22],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-[#1C2434] p-2 rounded-lg shadow-lg flex flex-col  hover:scale-105 transition-transform border-b-4"
          style={{ borderBottomColor: card.color }}
        >
          <div className="flex items-center gap-2 ">
            {card.icon}
            <h3 className="text-lg text-white font-semibold">{card.label}</h3>
          </div>
         <div className="flex flex-row items-center w-full justify-between gap-4">
             <p className="font-bold text-2xl text-white">{formatNumber(card.data)}</p>

          {/* Mini bar chart */}
          <div className="flex gap-1 w-full justify-end items-end h-6">
            {card.miniBars.map((val, idx) => (
              <div
                key={idx}
                className="rounded-sm"
                style={{
                  height: `${val / Math.max(...card.miniBars) * 100}%`,
                  width: "6px",
                  backgroundColor: card.color,
                }}
              ></div>
            ))}
          </div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
