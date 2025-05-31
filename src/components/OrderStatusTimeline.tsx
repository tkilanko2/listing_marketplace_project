import React from 'react';
import { 
  Package, 
  CreditCard, 
  Clock, 
  RefreshCw, 
  Truck, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Calendar,
  PlayCircle,
  Clock3,
  Home
} from 'lucide-react';
import { OrderStatus } from '../types';

interface TimelineStep {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'current' | 'future' | 'skipped';
  description: string;
  date?: Date;
}

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  orderType: 'product' | 'service';
  orderDate: Date;
  className?: string;
}

export function OrderStatusTimeline({ currentStatus, orderType, orderDate, className = '' }: OrderStatusTimelineProps) {
  
  // Debug logging
  console.log('OrderStatusTimeline - currentStatus:', currentStatus, 'orderType:', orderType);
  
  // Define timeline steps for products
  const getProductTimeline = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'pending',
        label: 'Order Placed',
        icon: Package,
        status: 'future',
        description: 'Order received and being processed',
        date: orderDate
      },
      {
        id: 'processing',
        label: 'Processing',
        icon: RefreshCw,
        status: 'future',
        description: 'Preparing your order for shipment'
      },
      {
        id: 'shipped',
        label: 'Shipped',
        icon: Truck,
        status: 'future',
        description: 'Order is on its way to you'
      },
      {
        id: 'delivered',
        label: 'Delivered',
        icon: CheckCircle,
        status: 'future',
        description: 'Order successfully delivered'
      }
    ];

    // Define the normal flow sequence
    const flowSequence = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = flowSequence.indexOf(currentStatus);
    
    // Mark the first step as completed by default (order was placed)
    steps[0].status = 'completed';
    
    if (currentIndex >= 0) {
      // Normal flow: mark all steps up to current as completed, current as current, rest as future
      steps.forEach((step, index) => {
        if (index < currentIndex) {
          step.status = 'completed';
          // Add progressive dates for completed steps (1 day apart)
          const stepDate = new Date(orderDate);
          stepDate.setDate(orderDate.getDate() + index);
          step.date = stepDate;
        } else if (index === currentIndex) {
          step.status = 'current';
        } else {
          step.status = 'future';
        }
      });
    }

    // Handle special statuses that don't follow the normal flow
    if (currentStatus === 'cancelled') {
      // Find where cancellation happened and mark subsequent steps as skipped
      const lastCompletedIndex = steps.findIndex(step => step.status === 'current' || step.status === 'completed');
      steps.forEach((step, index) => {
        if (index > lastCompletedIndex) {
          step.status = 'skipped';
        }
      });
      
      steps.push({
        id: 'cancelled',
        label: 'Cancelled',
        icon: XCircle,
        status: 'current',
        description: 'Order has been cancelled'
      });
    } else if (currentStatus === 'returned') {
      // Returned means delivered first, then returned
      steps.forEach(step => {
        if (step.id === 'delivered') step.status = 'completed';
      });
      
      steps.push({
        id: 'returned',
        label: 'Returned',
        icon: RotateCcw,
        status: 'current',
        description: 'Order has been returned'
      });
    }

    return steps;
  };

  // Define timeline steps for services
  const getServiceTimeline = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'requested',
        label: 'Booking Requested',
        icon: Calendar,
        status: 'future',
        description: 'Service booking request submitted',
        date: orderDate
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        icon: CheckCircle,
        status: 'future',
        description: 'Provider confirmed your booking'
      },
      {
        id: 'scheduled',
        label: 'Scheduled',
        icon: Clock3,
        status: 'future',
        description: 'Appointment scheduled and ready'
      },
      {
        id: 'in_progress',
        label: 'In Progress',
        icon: PlayCircle,
        status: 'future',
        description: 'Service is currently being performed'
      },
      {
        id: 'completed',
        label: 'Completed',
        icon: CheckCircle,
        status: 'future',
        description: 'Service completed successfully'
      }
    ];

    // Define the normal flow sequence
    const flowSequence = ['requested', 'confirmed', 'scheduled', 'in_progress', 'completed'];
    const currentIndex = flowSequence.indexOf(currentStatus);
    
    // Mark the first step as completed by default (booking was requested)
    steps[0].status = 'completed';
    
    if (currentIndex >= 0) {
      // Normal flow: mark all steps up to current as completed, current as current, rest as future
      steps.forEach((step, index) => {
        if (index < currentIndex) {
          step.status = 'completed';
          // Add progressive dates for completed steps (1 day apart)
          const stepDate = new Date(orderDate);
          stepDate.setDate(orderDate.getDate() + index);
          step.date = stepDate;
        } else if (index === currentIndex) {
          step.status = 'current';
        } else {
          step.status = 'future';
        }
      });
    }

    // Handle special statuses that don't follow the normal flow
    if (currentStatus === 'cancelled') {
      // Find where cancellation happened and mark subsequent steps as skipped
      const lastCompletedIndex = steps.findIndex(step => step.status === 'current' || step.status === 'completed');
      steps.forEach((step, index) => {
        if (index > lastCompletedIndex) {
          step.status = 'skipped';
        }
      });
      
      steps.push({
        id: 'cancelled',
        label: 'Cancelled',
        icon: XCircle,
        status: 'current',
        description: 'Booking has been cancelled'
      });
    } else if (currentStatus === 'no_show') {
      // No show typically happens after scheduled
      const scheduledIndex = steps.findIndex(step => step.id === 'scheduled');
      if (scheduledIndex >= 0) {
        steps.forEach((step, index) => {
          if (index <= scheduledIndex) {
            step.status = 'completed';
          } else {
            step.status = 'skipped';
          }
        });
      }
      
      steps.push({
        id: 'no_show',
        label: 'No Show',
        icon: XCircle,
        status: 'current',
        description: 'Customer did not attend appointment'
      });
    } else if (currentStatus === 'rescheduled') {
      // Rescheduled can happen at various points
      // For rescheduling, we assume at least the request and confirmation happened
      steps[0].status = 'completed'; // Booking Requested
      steps[1].status = 'completed'; // Confirmed
      steps[2].status = 'future';    // Scheduled (will be rescheduled)
      steps[3].status = 'future';    // In Progress
      steps[4].status = 'future';    // Completed
      
      // Add dates for completed steps
      const confirmedDate = new Date(orderDate);
      confirmedDate.setDate(orderDate.getDate() + 1);
      steps[1].date = confirmedDate;
      
      steps.push({
        id: 'rescheduled',
        label: 'Rescheduled',
        icon: RotateCcw,
        status: 'current',
        description: 'Appointment has been rescheduled'
      });
    }

    return steps;
  };

  const timeline = orderType === 'product' ? getProductTimeline() : getServiceTimeline();

  // Debug logging for timeline
  console.log('Generated timeline:', timeline.map(step => ({ id: step.id, status: step.status })));

  const getStepColors = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-[#E8F5E9]',
          border: 'border-[#4CAF50]',
          icon: 'text-[#4CAF50]',
          text: 'text-[#1B1C20]',
          line: 'bg-[#4CAF50]'
        };
      case 'current':
        return {
          bg: 'bg-[#EDD9FF]',
          border: 'border-[#3D1560]',
          icon: 'text-[#3D1560]',
          text: 'text-[#3D1560]',
          line: 'bg-[#CDCED8]'
        };
      case 'future':
        return {
          bg: 'bg-[#F8F8FA]',
          border: 'border-[#CDCED8]',
          icon: 'text-[#70727F]',
          text: 'text-[#70727F]',
          line: 'bg-[#CDCED8]'
        };
      case 'skipped':
        return {
          bg: 'bg-[#FFE5ED]',
          border: 'border-[#DF678C]',
          icon: 'text-[#DF678C]',
          text: 'text-[#DF678C]',
          line: 'bg-[#DF678C]'
        };
      default:
        return {
          bg: 'bg-[#F8F8FA]',
          border: 'border-[#CDCED8]',
          icon: 'text-[#70727F]',
          text: 'text-[#70727F]',
          line: 'bg-[#CDCED8]'
        };
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-semibold text-[#1B1C20] mb-5">
        {orderType === 'product' ? 'Order' : 'Booking'} Progress
      </h3>
      
      {/* Desktop Timeline - Horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Base Connecting Line */}
          <div className="absolute top-[18px] left-7 right-7 h-0.5 bg-[#E8E9ED]"></div>

          {/* Colored Progress / Status Lines */}
          {timeline.slice(0, -1).map((step, index) => {
            // Determine segment color based on this step and next step
            const nextStep = timeline[index + 1];
            let segmentColor: string;
            if (step.status === 'completed' && nextStep.status === 'completed') {
              segmentColor = 'bg-[#4CAF50]';
            } else if (step.status === 'completed' && nextStep.status === 'current') {
              segmentColor = 'bg-[#4CAF50]';
            } else if (step.status === 'skipped' || nextStep.status === 'skipped') {
              segmentColor = 'bg-[#DF678C]';
            } else if (step.status === 'current' && nextStep.status === 'future') {
              segmentColor = 'bg-[#CDCED8]';
            } else {
              segmentColor = 'bg-[#E8E9ED]';
            }
            
            // Each segment spans 1/(n-1) of the total width
            const segmentWidth = 100 / (timeline.length - 1);
            
            // If next step is current status, reduce width to stop at center of current icon
            const adjustedWidth = nextStep.status === 'current' 
              ? `calc(${segmentWidth}% - 1.125rem)` // Stop at center of current icon
              : `${segmentWidth}%`;
            
            return (
              <div
                key={`${step.id}-segment`}
                className={`absolute top-[18px] h-0.5 ${segmentColor}`}
                style={{
                  left: `calc(1.75rem + ${index * segmentWidth}%)`,
                  width: adjustedWidth,
                  zIndex: 5,
                }}
              />
            );
          })}
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {timeline.map((step, index) => {
              const colors = getStepColors(step.status);
              const StepIcon = step.icon;
              const isLast = index === timeline.length - 1;
              
              return (
                <div 
                  key={step.id} 
                  className="group relative flex flex-col items-center flex-1 pt-1 pb-2 px-1 focus:outline-none" 
                  tabIndex={0}
                >
                  {/* Icon Circle */}
                  <div className={`relative w-9 h-9 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center mb-2.5`}
                       style={{ zIndex: 10 }}>
                    <StepIcon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  
                  {/* Step Content Wrapper */}
                  <div className="text-center relative">
                    {/* Label - Always Visible */}
                    <h4 className={`${step.status === 'current' ? 'font-semibold' : 'font-normal'} text-sm mb-0.5 ${colors.text} transition-colors duration-200`}>
                      {step.label}
                    </h4>
                    
                    {/* Date - Always Visible if present */}
                    {step.date && (
                      <p className="text-xs text-[#70727F] mb-1 transition-colors duration-200">
                        {step.date.toLocaleDateString()}
                      </p>
                    )}

                    {/* Description - Revealed on Hover/Focus */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-[150px] sm:w-[170px] mt-1 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-focus:max-h-40 group-focus:opacity-100 transition-all duration-300 ease-in-out overflow-hidden bg-[#FFFFFF] dark:bg-[#474958] p-2.5 rounded-md shadow-lg border border-[#E8E9ED] dark:border-[#383A47] z-20 group-hover:z-30 group-focus:z-30"
                    >
                      <p className="text-xs text-[#383A47] dark:text-[#CDCED8] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline - Vertical */}
      <div className="md:hidden">
        <div className="space-y-2">
          {timeline.map((step, index) => {
            const colors = getStepColors(step.status);
            const StepIcon = step.icon;
            const isLast = index === timeline.length - 1;
            
            // Determine connecting line color based on current and next step (vertical layout)
            let connectingLineColor: string = 'bg-[#E8E9ED]';
            if (!isLast) {
              const nextStep = timeline[index + 1];
              if (step.status === 'completed' && (nextStep.status === 'completed' || nextStep.status === 'current')) {
                connectingLineColor = 'bg-[#4CAF50]';
              } else if (step.status === 'skipped' || nextStep.status === 'skipped') {
                connectingLineColor = 'bg-[#DF678C]';
              } else if (step.status === 'current' && nextStep.status === 'future') {
                connectingLineColor = 'bg-[#CDCED8]';
              } else {
                connectingLineColor = 'bg-[#E8E9ED]';
              }
            }

            return (
              <div 
                key={step.id} 
                className="group relative flex items-start gap-3 p-2 rounded-md focus:outline-none focus:bg-[#EDD9FF] focus:bg-opacity-50" 
                tabIndex={0}
              >
                {/* Icon and Line Container */}
                <div className="flex flex-col items-center flex-shrink-0">
                  {/* Icon Circle */}
                  <div className={`w-7 h-7 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center z-10`}>
                    <StepIcon className={`w-3 h-3 ${colors.icon}`} />
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className={`w-0.5 h-full min-h-[24px] mt-1 mb-1 ${connectingLineColor}`}></div>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 pt-1 pb-1">
                  {/* Label - Always Visible */}
                  <h4 className={`${step.status === 'current' ? 'font-semibold' : 'font-normal'} text-sm mb-0.5 ${colors.text}`}>{step.label}</h4>
                  {/* Date - Always Visible if present */}
                  {step.date && (
                    <p className="text-xs text-[#70727F] mb-1">{step.date.toLocaleDateString()}</p>
                  )}
                  {/* Description - Revealed on Hover/Focus */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-focus:max-h-40 group-focus:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
                    <p className="text-xs text-[#383A47] dark:text-[#CDCED8] leading-relaxed mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}