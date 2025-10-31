import React, { useState, useMemo } from 'react';
import { Calendar } from './Calendar';
import { TimeSlot } from '../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface AvailabilityPreviewProps {
  availability: {
    type: 'weekdays' | 'weekends' | 'allWeek' | 'custom';
    scheduleType: 'weekly' | 'dateRange';
    customSchedule?: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
      timeRanges: Array<{
        startTime: string;
        endTime: string;
        days: string[];
      }>;
    };
    dateRanges?: Array<{
      startDate: string;
      endDate: string;
      timeSlots: Array<{
        startTime: string;
        endTime: string;
      }>;
    }>;
  };
  onModify?: () => void;
}

export const AvailabilityPreview: React.FC<AvailabilityPreviewProps> = ({ 
  availability, 
  onModify 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate time slots from availability data
  const availableSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const now = new Date();

    if (availability.scheduleType === 'weekly' && availability.customSchedule) {
      // Generate slots for next 30 days based on weekly schedule
      for (let day = 0; day < 30; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() + day);
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

        // Check if this day is available
        if (availability.customSchedule[dayName as keyof typeof availability.customSchedule]) {
          // Find time ranges for this day
          const dayTimeRanges = availability.customSchedule.timeRanges.filter(
            range => range.days.includes(dayName)
          );

          dayTimeRanges.forEach(range => {
            const [startHour, startMin] = range.startTime.split(':').map(Number);
            const [endHour, endMin] = range.endTime.split(':').map(Number);

            // Create hourly slots within the range
            for (let hour = startHour; hour < endHour; hour++) {
              const slotDate = new Date(date);
              slotDate.setHours(hour, 0, 0, 0);
              const endDate = new Date(slotDate);
              endDate.setHours(hour + 1, 0, 0, 0);

              slots.push({
                start: slotDate,
                end: endDate,
                available: true
              });
            }
          });
        }
      }
    }

    return slots;
  }, [availability]);

  return (
    <div className="bg-white border border-[#E8E9ED] rounded-lg">
      {/* Header with Modify Button */}
      <div className="p-5 border-b border-[#E8E9ED]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-[#3D1560]" />
            <h3 className="text-base font-semibold text-[#1B1C20]">Availability Schedule</h3>
          </div>
          {onModify && (
            <button
              onClick={onModify}
              className="px-4 py-1.5 text-sm font-medium text-[#3D1560] hover:text-white hover:bg-[#3D1560] border border-[#3D1560] rounded-md transition-colors"
            >
              Modify
            </button>
          )}
        </div>
        <p className="text-xs text-[#70727F]">
          Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>

      {/* Calendar & Time Slots Display (from BookingPage) */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableSlots={availableSlots}
          />
          
          <div className="space-y-3">
            <h4 className="font-medium text-[#383A47]">Available Times</h4>
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
              {availableSlots
                .filter(slot => slot.start.toDateString() === selectedDate.toDateString())
                .map((slot, index) => (
                  <div
                    key={index}
                    className="p-2 text-sm rounded-md bg-[#F8F8FA] text-[#383A47] border border-[#CDCED8]"
                  >
                    {slot.start.toLocaleTimeString('default', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                ))}
              {availableSlots.filter(slot => slot.start.toDateString() === selectedDate.toDateString()).length === 0 && (
                <div className="col-span-2 text-center py-8 text-[#70727F] text-sm">
                  No available times for this date
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

