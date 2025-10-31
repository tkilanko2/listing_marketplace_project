import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimeSlot } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableSlots: TimeSlot[];
}

export function Calendar({ selectedDate, onDateSelect, availableSlots }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-[#EDD9FF] rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#3D1560]" />
        </button>
        <h2 className="text-lg font-semibold text-[#1B1C20]">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-[#EDD9FF] rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#3D1560]" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {padding.map((_, index) => (
          <div key={`padding-${index}`} className="h-10" />
        ))}
        
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const hasSlots = availableSlots.some(
            slot => slot.start.toDateString() === date.toDateString()
          );
          
          return (
            <button
              key={day}
              onClick={() => onDateSelect(date)}
              className={`h-10 flex items-center justify-center rounded-full
                ${date.toDateString() === selectedDate.toDateString()
                  ? 'bg-[#3D1560] text-white'
                  : hasSlots
                  ? 'hover:bg-[#EDD9FF] text-[#383A47]'
                  : 'text-[#CDCED8]'
                }`}
              disabled={!hasSlots}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}