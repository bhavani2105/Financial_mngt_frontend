import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-500",
  bgColor = "bg-blue-50",
  change = null,
  changeColor = "text-green-600",
  trend = "up", // 'up' or 'down'
  loading = false,
  onClick = null,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const renderChangeIndicator = () => {
    if (!change) return null;

    const ChangeIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;

    return (
      <div className={`flex items-center text-sm ${changeColor}`}>
        <ChangeIcon
          className={`w-4 h-4 mr-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
        />
        <span>{change}</span>
      </div>
    );
  };

  return (
    <div
      className={`card p-6 hover:shadow-md transition-shadow duration-200 ${onClick ? "cursor-pointer hover:border-primary-300" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {renderChangeIndicator()}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="mt-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
