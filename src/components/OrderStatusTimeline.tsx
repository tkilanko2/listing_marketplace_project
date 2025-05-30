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
  
  // Define timeline steps for products
  const getProductTimeline = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'pending',
        label: 'Order Placed',
        icon: Package,
        status: 'completed',
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

    // Update status based on current order status
    let currentIndex = -1;
    
    // First, find the current step index
    steps.forEach((step, index) => {
      if (step.id === currentStatus) {
        currentIndex = index;
      }
    });

    // Then update all step statuses based on current position
    steps.forEach((step, index) => {
      if (step.id === currentStatus) {
        step.status = 'current';
      } else if (index < currentIndex) {
        // All steps before current should be completed
        step.status = 'completed';
      } else if (index > currentIndex) {
        // All steps after current should be future (unless special cases)
        if (currentStatus === 'cancelled' || currentStatus === 'returned') {
          step.status = 'skipped';
        } else {
          step.status = 'future';
        }
      }
    });

    // Handle special statuses that don't follow the normal flow
    if (currentStatus === 'cancelled') {
      steps.push({
        id: 'cancelled',
        label: 'Cancelled',
        icon: XCircle,
        status: 'current',
        description: 'Order has been cancelled'
      });
    } else if (currentStatus === 'returned') {
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
        status: 'completed',
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

    // Update status based on current booking status
    let currentIndex = -1;
    
    // First, find the current step index
    steps.forEach((step, index) => {
      if (step.id === currentStatus) {
        currentIndex = index;
      }
    });

    // Then update all step statuses based on current position
    steps.forEach((step, index) => {
      if (step.id === currentStatus) {
        step.status = 'current';
      } else if (index < currentIndex) {
        // All steps before current should be completed
        step.status = 'completed';
      } else if (index > currentIndex) {
        // All steps after current should be future (unless special cases)
        if (currentStatus === 'cancelled' || currentStatus === 'no_show' || currentStatus === 'rescheduled') {
          step.status = 'skipped';
        } else {
          step.status = 'future';
        }
      }
    });

    // Handle special statuses that don't follow the normal flow
    if (currentStatus === 'cancelled') {
      steps.push({
        id: 'cancelled',
        label: 'Cancelled',
        icon: XCircle,
        status: 'current',
        description: 'Booking has been cancelled'
      });
    } else if (currentStatus === 'no_show') {
      steps.push({
        id: 'no_show',
        label: 'No Show',
        icon: XCircle,
        status: 'current',
        description: 'Customer did not attend appointment'
      });
    } else if (currentStatus === 'rescheduled') {
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
          <div className="absolute top-7 left-7 right-7 h-0.5 bg-[#E8E9ED]"></div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {timeline.map((step, index) => {
              const colors = getStepColors(step.status);
              const StepIcon = step.icon;
              const isLast = index === timeline.length - 1;
              
              // Determine connecting line color
              const nextStep = timeline[index + 1];
              let connectingLineColor = 'bg-[#E8E9ED]'; // default grey
              
              if (step.status === 'completed' && !isLast) {
                connectingLineColor = 'bg-[#4CAF50]'; // green for completed steps
              }
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1 max-w-[180px]">
                  {/* Icon Circle */}
                  <div className={`relative w-14 h-14 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center mb-3 z-10`}>
                    <StepIcon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  
                  {/* Connecting Line from this step to next */}
                  {!isLast && (
                    <div className={`absolute top-7 left-7 w-full h-0.5 ${connectingLineColor} z-5`}
                         style={{
                           width: `calc(100% / ${timeline.length - 1})`,
                           left: `calc(${index} * (100% / ${timeline.length - 1}) + 1.75rem)`
                         }}>
                    </div>
                  )}
                  
                  {/* Step Content */}
                  <div className="text-center">
                    <h4 className={`font-semibold text-sm mb-1 ${colors.text}`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-[#70727F] max-w-[125px] leading-relaxed">
                      {step.description}
                    </p>
                    {step.date && (
                      <p className="text-xs text-[#CDCED8] mt-1">
                        {step.date.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline - Vertical */}
      <div className="md:hidden">
        <div className="space-y-3">
          {timeline.map((step, index) => {
            const colors = getStepColors(step.status);
            const StepIcon = step.icon;
            const isLast = index === timeline.length - 1;
            
            // Determine connecting line color for mobile
            let connectingLineColor = 'bg-[#E8E9ED]'; // default grey
            if (step.status === 'completed' && !isLast) {
              connectingLineColor = 'bg-[#4CAF50]'; // green for completed steps
            }
            
            return (
              <div key={step.id} className="flex items-start gap-3">
                {/* Icon and Line Container */}
                <div className="flex flex-col items-center">
                  {/* Icon Circle */}
                  <div className={`w-11 h-11 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                    <StepIcon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className={`w-0.5 h-7 mt-2 ${connectingLineColor}`}></div>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 pb-3">
                  <h4 className={`font-semibold text-sm mb-1 ${colors.text}`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-[#70727F] leading-relaxed">
                    {step.description}
                  </p>
                  {step.date && (
                    <p className="text-xs text-[#CDCED8] mt-1">
                      {step.date.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 