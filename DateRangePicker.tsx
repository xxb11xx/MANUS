import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYesterday, endOfYesterday } from 'date-fns';

interface DateRangePickerProps {
  onRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

interface PredefinedRange {
  label: string;
  getRange: () => { start: Date; end: Date };
}

const predefinedRanges: PredefinedRange[] = [
  { label: 'Today', getRange: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Yesterday', getRange: () => ({ start: startOfYesterday(), end: endOfYesterday() }) },
  { label: 'Last 7 Days', getRange: () => ({ start: subDays(new Date(), 6), end: new Date() }) },
  { label: 'Last 30 Days', getRange: () => ({ start: subDays(new Date(), 29), end: new Date() }) },
  {
    label: 'This Month',
    getRange: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }), // Or new Date() if you want up to today
  },
  {
    label: 'Last Month',
    getRange: () => ({
      start: startOfMonth(subDays(startOfMonth(new Date()), 1)),
      end: endOfMonth(subDays(startOfMonth(new Date()), 1)),
    }),
  },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onRangeChange, initialStartDate = null, initialEndDate = null }) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPredefinedLabel, setSelectedPredefinedLabel] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleApply = () => {
    onRangeChange(startDate, endDate);
    setIsOpen(false);
  };

  const handlePredefinedRangeSelect = (range: PredefinedRange) => {
    const { start, end } = range.getRange();
    setStartDate(start);
    setEndDate(end);
    setSelectedPredefinedLabel(range.label);
    // Optionally apply immediately or wait for explicit apply button click
    // onRangeChange(start, end); 
    // setIsOpen(false);
  };

  const displayFormat = "MMM dd, yyyy";
  let displayValue = 'Select Date Range';
  if (selectedPredefinedLabel && startDate && endDate) {
    if (predefinedRanges.find(r => r.label === selectedPredefinedLabel && 
        r.getRange().start.toDateString() === startDate.toDateString() && 
        r.getRange().end.toDateString() === endDate.toDateString())) {
        displayValue = selectedPredefinedLabel;
    } else if (startDate && endDate) {
        displayValue = `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`;
    } else if (startDate) {
        displayValue = format(startDate, displayFormat);
    }
  } else if (startDate && endDate) {
    displayValue = `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`;
  } else if (startDate) {
    displayValue = format(startDate, displayFormat);
  }
  
  // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 min-w-[250px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Calendar className="mr-2 h-5 w-5 text-gray-400" />
          <span className="flex-grow text-left">{displayValue}</span>
          <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 p-4 flex flex-col md:flex-row">
          <div className="md:pr-4 mb-4 md:mb-0">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Predefined Ranges</h4>
            <div className="space-y-1">
              {predefinedRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  className={`block w-full text-left px-3 py-1.5 text-sm rounded-md ${selectedPredefinedLabel === range.label ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => handlePredefinedRangeSelect(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-4">
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
                setSelectedPredefinedLabel(null); // Clear predefined label if custom range selected
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
            />
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                    setStartDate(initialStartDate);
                    setEndDate(initialEndDate);
                    setSelectedPredefinedLabel(null);
                    setIsOpen(false);
                    onRangeChange(initialStartDate, initialEndDate); // Reset to initial
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Basic CSS for react-datepicker if not globally available or to ensure styling */}
      <style jsx global>{`
        .react-datepicker-wrapper {
          display: block;
        }
        .react-datepicker__header {
          background-color: #f3f4f6; /* Tailwind gray-100 */
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
          background-color: #4f46e5; /* Tailwind indigo-600 */
          color: white;
        }
        .react-datepicker__day--keyboard-selected {
            background-color: #6366f1; /* Tailwind indigo-500 */
            color: white;
        }
        .react-datepicker__day:hover {
            background-color: #e0e7ff; /* Tailwind indigo-100 */
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;

