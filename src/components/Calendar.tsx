import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TimeSlot } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableSlots: TimeSlot[];
}

export function Calendar({ selectedDate, onDateSelect, availableSlots }: CalendarProps) {
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <CalendarIcon className="w-5 h-5 text-gray-500" />
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
          const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
          const hasSlots = availableSlots.some(
            slot => slot.start.toDateString() === date.toDateString()
          );
          
          return (
            <button
              key={day}
              onClick={() => onDateSelect(date)}
              className={`h-10 flex items-center justify-center rounded-full
                ${date.toDateString() === selectedDate.toDateString()
                  ? 'bg-blue-600 text-white'
                  : hasSlots
                  ? 'hover:bg-blue-100'
                  : 'text-gray-400'
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