import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ExternalLink } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string; // Formatted string, e.g., "1,234" or "$15,789.50"
  trendPercentage?: number; // e.g., 5.6 for +5.6%, -2.1 for -2.1%
  trendDirection?: 'up' | 'down' | 'neutral'; // To help with color/icon
  trendComparisonPeriod?: string; // e.g., "vs. last week"
  // sparklineData?: number[]; // Array of numbers for the sparkline - Placeholder for now
  reportLink?: string; // URL for the "View Report" link
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trendPercentage,
  trendDirection,
  trendComparisonPeriod,
  reportLink,
}) => {
  let trendIcon = null;
  let trendColor = 'text-gray-500';

  if (trendDirection === 'up') {
    trendIcon = <ArrowUpRight size={16} className="mr-1" />;
    trendColor = 'text-green-500';
  } else if (trendDirection === 'down') {
    trendIcon = <ArrowDownRight size={16} className="mr-1" />;
    trendColor = 'text-red-500';
  } else if (trendDirection === 'neutral') {
    trendIcon = <Minus size={16} className="mr-1" />;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        {trendPercentage !== undefined && trendDirection && (
          <div className={`flex items-center text-xs ${trendColor} mb-2`}>
            {trendIcon}
            <span>{trendPercentage.toFixed(1)}%</span>
            {trendComparisonPeriod && <span className="ml-1 text-gray-400">{trendComparisonPeriod}</span>}
          </div>
        )}
      </div>
      {/* Placeholder for Sparkline Chart */}
      {/* {sparklineData && <div className="mt-auto h-8 bg-gray-100 rounded">Sparkline here</div>} */}
      {reportLink && (
        <a
          href={reportLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-xs text-blue-600 hover:text-blue-800 flex items-center pt-2"
        >
          View Report <ExternalLink size={12} className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default KPICard;

