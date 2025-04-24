import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Card, Typography, ButtonGroup, Button, CircularProgress } from '@mui/material';
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Appointment } from '../../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
  onDateSelect?: (info: DateSelectArg) => void;
  loading?: boolean;
}

export default function CalendarView({
  appointments = [],
  onEdit,
  onDateRangeChange,
  onDateSelect,
  loading = false
}: CalendarViewProps) {
  const [view, setView] = useState<'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'>('timeGridWeek');
  const calendarRef = useRef<FullCalendar>(null);
  const [currentRange, setCurrentRange] = useState<{start: Date, end: Date} | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  
  // Store reference to calendar API after initialization
  useEffect(() => {
    if (calendarRef.current && !calendarApi) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarRef, calendarApi]);
  
  // Update calendar view when view state changes
  useEffect(() => {
    if (calendarApi) {
      try {
        // Hold onto current date when switching views
        const currentDate = calendarApi.getDate();
        calendarApi.changeView(view);
        calendarApi.gotoDate(currentDate);
      } catch (error) {
        console.error("Error changing calendar view:", error);
      }
    }
  }, [view, calendarApi]);

  // Format customer name to first name + last initial for privacy
  const formatCustomerName = (fullName: string): string => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0) + '.';
    return `${firstName} ${lastInitial}`;
  };

  // Map appointments to FullCalendar events with debug logging
  const events: EventInput[] = Array.isArray(appointments) ? appointments.map(appointment => {
    // Ensure dates are properly parsed
    const startDate = new Date(appointment.start);
    const endDate = new Date(appointment.end);
    // Debug log to check for events near midnight or spanning days
    if (startDate.getHours() >= 22 || endDate.getDate() !== startDate.getDate()) {
      console.log(`Potential spillover event: ${appointment.service.name} starts ${startDate.toISOString()} ends ${endDate.toISOString()}`);
    }
    console.log(`Event mapped: ${appointment.service.name} on ${startDate.toISOString()} to ${endDate.toISOString()}`);
    return {
      id: appointment.id,
      title: `${appointment.service.name} - ${formatCustomerName(appointment.customer.name)}`,
      start: startDate,
      end: endDate,
      backgroundColor: getEventColor(appointment.status),
      borderColor: getEventColor(appointment.status),
      textColor: 'white',
      extendedProps: {
        appointment: appointment
      }
    };
  }) : [];

  // Log when events are updated
  useEffect(() => {
    console.log(`Total events passed to FullCalendar: ${events.length}`);
  }, [events]);

  // Get color for event based on status
  function getEventColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#3D1560';
      case 'pending':
        return '#DF678C';
      case 'completed':
        return '#4CAF50';
      case 'canceled':
        return '#70727F'; // Slightly darker gray for better visibility
      default:
        return '#9B53D9';
    }
  }

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointmentData = clickInfo.event.extendedProps.appointment as Appointment;
    onEdit(appointmentData);
  };

  // Handle date range change
  const handleDatesSet = (dateInfo: any) => {
    // Store current range locally
    const newStart = new Date(dateInfo.start);
    const newEnd = new Date(dateInfo.end);
    
    // Log date range for debugging
    console.log(`Calendar date range set: ${newStart.toISOString()} to ${newEnd.toISOString()}`);
    console.log(`Current view: ${dateInfo.view.type}`);
    
    // Check for any events in this date range
    const eventsInRange = events.filter(event => {
      const eventStart = new Date(event.start as string);
      const eventEnd = new Date(event.end as string);
      return eventStart >= newStart && eventStart <= newEnd;
    });
    
    console.log(`Events in current date range: ${eventsInRange.length}`);
    if (eventsInRange.length > 0) {
      eventsInRange.forEach(event => {
        console.log(`Event in range: ${event.title}, start: ${new Date(event.start as string).toISOString()}`);
      });
    } else {
      console.log('No events found in the current date range');
    }
    
    setCurrentRange({ 
      start: newStart, 
      end: newEnd 
    });
    
    // Only trigger parent callback if range has actually changed
    if (onDateRangeChange) {
      onDateRangeChange(newStart, newEnd);
    }
  };

  // Handle date or 'more' link click in month view to switch to daily view
  const handleDateClick = (info: any) => {
    console.log(`Date clicked: ${info.date.toISOString()}`);
    
    // Log appointments for this date
    const clickedDate = info.date;
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.start as string);
      return eventDate.getFullYear() === clickedDate.getFullYear() &&
             eventDate.getMonth() === clickedDate.getMonth() &&
             eventDate.getDate() === clickedDate.getDate();
    });
    
    console.log(`Events on clicked date (${clickedDate.toDateString()}): ${dateEvents.length}`);
    dateEvents.forEach(event => {
      console.log(`Event on clicked date: ${event.title}, start: ${new Date(event.start as string).toISOString()}`);
    });
    
    if (calendarApi) {
      calendarApi.changeView('timeGridDay');
      calendarApi.gotoDate(info.date);
      setView('timeGridDay');
    }
  };

  return (
    <Card sx={{ p: 2, border: '1px solid #CDCED8', borderRadius: 1, position: 'relative', minHeight: '600px', overflow: 'visible' }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 10
        }}>
          <CircularProgress sx={{ color: '#3D1560' }} />
        </Box>
      )}
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="#1B1C20">
          Calendar View
        </Typography>
        
        <ButtonGroup variant="outlined" size="small" aria-label="calendar view options">
          <Button 
            onClick={() => setView('timeGridDay')}
            sx={{ 
              backgroundColor: view === 'timeGridDay' ? '#EDD9FF' : 'transparent',
              color: view === 'timeGridDay' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              },
              '&.Mui-selected': {
                backgroundColor: '#3D1560',
                color: 'white'
              }
            }}
          >
            Day
          </Button>
          <Button 
            onClick={() => setView('timeGridWeek')}
            sx={{ 
              backgroundColor: view === 'timeGridWeek' ? '#EDD9FF' : 'transparent',
              color: view === 'timeGridWeek' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              },
              '&.Mui-selected': {
                backgroundColor: '#3D1560',
                color: 'white'
              }
            }}
          >
            Week
          </Button>
          <Button 
            onClick={() => setView('dayGridMonth')}
            sx={{ 
              backgroundColor: view === 'dayGridMonth' ? '#EDD9FF' : 'transparent',
              color: view === 'dayGridMonth' ? '#3D1560' : '#70727F', 
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              },
              '&.Mui-selected': {
                backgroundColor: '#3D1560',
                color: 'white'
              }
            }}
          >
            Month
          </Button>
        </ButtonGroup>
      </Box>
      
      <Box sx={{ 
        height: '100%',
        '.fc': {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          height: '100%', // Ensure fullcalendar takes full height
        },
        '.fc-view-harness': {
          minHeight: '500px', // Ensure the calendar grid always has minimum height
        },
        '.fc .fc-button-primary': {
          backgroundColor: '#3D1560',
          borderColor: '#3D1560',
        },
        '.fc .fc-button-primary:hover': {
          backgroundColor: '#6D26AB',
        },
        '.fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active': {
          backgroundColor: '#6D26AB',
          borderColor: '#6D26AB',
        },
        '.fc-daygrid-day.fc-day-today': {
          backgroundColor: '#EDD9FF',
        },
        '.fc-timegrid-col.fc-day-today': {
          backgroundColor: '#EDD9FF',
        },
        '.fc-col-header-cell': {
          padding: '8px 0',
        },
        '.fc-event': {
          cursor: 'pointer',
          padding: '2px 4px',
          borderRadius: '3px',
          fontSize: '0.85em', // Ensure text is readable
          overflow: 'hidden', // Handle overflow text
          textOverflow: 'ellipsis', // Handle overflow text
          whiteSpace: 'normal', // Allow text wrapping
        },
        '.fc-event:hover': {
          opacity: 0.9,
        },
        '.fc-event-title': {
          fontWeight: 500,
          whiteSpace: 'normal',
          overflow: 'visible', // Ensure title is visible
        },
        '.fc-event-time': {
          fontWeight: 600,
          display: 'block', // Ensure time is always displayed
          overflow: 'visible', // Ensure time is visible
        },
        // Style empty time grid slots to ensure they're always visible
        '.fc-timegrid-slot': {
          height: '2em',
          borderColor: '#E8E9ED'
        },
        // Style empty day grid cells
        '.fc-daygrid-day': {
          minHeight: '5em',
          backgroundColor: '#FFFFFF',
          height: '100px', // Fixed height for consistent day cells in month view
          boxSizing: 'border-box'
        },
        // Ensure day cells maintain consistent size
        '.fc-daygrid-day-frame': {
          height: '100%',
          overflow: 'hidden'
        },
        '.fc-daygrid-day-events': {
          maxHeight: '80px', // Increased to allow more events to be visible
          overflow: 'hidden'
        },
        '.fc-daygrid-more-link': {
          color: '#3D1560',
          fontWeight: 'bold',
          cursor: 'pointer'
        }
      }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          selectable={!!onDateSelect}
          select={onDateSelect}
          dateClick={handleDateClick} // Handle clicks on dates or 'more' link
          height="auto"
          contentHeight="500px" // Increased to ensure events are visible
          scrollTime="08:00:00"
          slotMinTime="00:00:00" // Expanded range to ensure all events are visible
          slotMaxTime="24:00:00" // Expanded range to ensure all events are visible
          allDaySlot={false}
          nowIndicator={true}
          showNonCurrentDates={true} // Ensure all dates are displayed
          fixedWeekCount={false} // More flexible week display
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          views={{
            timeGridWeek: {
              scrollTimeReset: false,
              eventMinHeight: 20, // Ensure events have minimum height to be visible
              slotEventOverlap: false, // Prevent overlap hiding events
              expandRows: true // Expand rows to show all events
            },
            timeGridDay: {
              scrollTimeReset: false, // Ensure scroll position is maintained
              eventMinHeight: 20, // Ensure events have minimum height to be visible
              slotEventOverlap: false, // Prevent overlap hiding events
              expandRows: true, // Expand rows to show all events
              slotDuration: '00:15:00', // Smaller slot duration to fit more events
              slotLabelInterval: '01:00:00', // Label every hour
              dayCount: 1, // Ensure only one day is shown
              dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } // Better day format
            },
            dayGridMonth: {
              eventLimit: false, // Show all events in month view without limit
              eventMaxHeight: 20, // Slightly increased to ensure visibility but prevent spillover
              dayMaxEvents: true, // Limit number of events shown per day, with a 'more' link
              dayMaxEventRows: 3, // Increased to 3 event rows per day before showing 'more'
              fixedWeekCount: false // Ensure month view shows only relevant weeks
            }
          }}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          eventDisplay="block" // Ensure events are displayed as blocks with full details
          displayEventEnd={true} // Show end time for events
          eventDurationEditable={false} // Prevent events from being resized to avoid spillover
          eventDidMount={(info) => {
            console.log(`Event mounted: ${info.event.title} on ${new Date(info.event.start as Date).toDateString()}`);
            
            // Add a tooltip with full event details on hover
            const appointment = info.event.extendedProps.appointment as Appointment;
            const start = new Date(appointment.start);
            const end = new Date(appointment.end);
            const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
            const tooltipText = `${info.event.title}\nTime: ${info.timeText}\nDuration: ${duration} min${appointment.location ? `\nLocation: ${appointment.location}` : ''}`;
            info.el.setAttribute('title', tooltipText);
          }}
          eventContent={(arg) => {
            // Custom rendering with minimal details in month view for readability
            const isMonthView = arg.view.type === 'dayGridMonth';
            const appointment = arg.event.extendedProps.appointment as Appointment;
            const start = new Date(appointment.start);
            const end = new Date(appointment.end);
            const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Calculate duration in minutes
            
            // Log that we're rendering this event in this view
            console.log(`Rendering event content for: ${arg.event.title} in ${arg.view.type} view`);
            
            return (
              <div style={{ overflow: 'visible', whiteSpace: 'normal' }}>
                <strong>{arg.timeText}</strong>
                <div>{arg.event.title}</div>
                {!isMonthView && (
                  <>
                    <div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>Duration: {duration} min</div>
                    {appointment.location && <div style={{ fontSize: '0.8em' }}>Location: {appointment.location}</div>}
                  </>
                )}
              </div>
            );
          }}
        />
      </Box>
    </Card>
  );
} 