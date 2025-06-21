import React, { useState } from 'react';
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
  Home,
  Copy
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
  bookingId?: string;
  className?: string;
  userRole?: 'buyer' | 'seller';
}

// Helper to map service status for buyer/seller view
function mapServiceStatus(status: OrderStatus, userRole: 'buyer' | 'seller'): OrderStatus {
  // Backend stores a single status field for service bookings. Frontend maps 'confirmed'/'scheduled' based on user role for display.
  if (status === 'confirmed' || status === 'scheduled') {
    return userRole === 'buyer' ? 'confirmed' : 'scheduled';
  }
  return status;
}

export function OrderStatusTimeline({ currentStatus, orderType, orderDate, bookingId, className = '', userRole = 'buyer' }: OrderStatusTimelineProps) {
  
  console.log('[OrderStatusTimeline] PROPS:', { currentStatus, orderType, userRole, orderDate: orderDate?.toISOString(), bookingId });
  
  const [isCopied, setIsCopied] = useState(false);
  
  const copyBookingId = async () => {
    if (bookingId) {
      try {
        await navigator.clipboard.writeText(bookingId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy booking ID:', err);
      }
    }
  };
  
  // mappedDisplayStatus is used for the status badge and to determine the current position in the timeline logic.
  // For a buyer, if currentStatus is 'scheduled', mappedDisplayStatus becomes 'confirmed'.
  const mappedDisplayStatus = mapServiceStatus(currentStatus, userRole);
  console.log('[OrderStatusTimeline] Mapped Display Status:', mappedDisplayStatus);

  const getStatusDisplayBadge = () => { // Renamed for clarity
    switch (mappedDisplayStatus) {
      // Product statuses
      case 'pending': return { label: 'Status: Pending', color: 'text-[#70727F]', bgColor: 'bg-[#E8E9ED]', borderColor: 'border-[#70727F]' };
      case 'processing': return { label: 'Status: Processing', color: 'text-[#6D26AB]', bgColor: 'bg-[#EDD9FF]', borderColor: 'border-[#6D26AB]' };
      case 'shipped': return { label: 'Status: Shipped', color: 'text-[#3D1560]', bgColor: 'bg-[#EDD9FF]', borderColor: 'border-[#3D1560]' };
      case 'delivered': return { label: 'Status: Delivered', color: 'text-[#4CAF50]', bgColor: 'bg-[#E8F5E9]', borderColor: 'border-[#4CAF50]' };
      case 'returned': return { label: 'Status: Returned', color: 'text-[#DF678C]', bgColor: 'bg-[#FFE5ED]', borderColor: 'border-[#DF678C]' };
      // Service statuses
      case 'requested': return { label: 'Status: Booking Requested', color: 'text-[#70727F]', bgColor: 'bg-[#E8E9ED]', borderColor: 'border-[#70727F]' };
      case 'confirmed': return { label: 'Status: Confirmed', color: 'text-[#3D1560]', bgColor: 'bg-[#EDD9FF]', borderColor: 'border-[#3D1560]' };
      case 'scheduled': return { label: 'Status: Scheduled', color: 'text-[#6D26AB]', bgColor: 'bg-[#EDD9FF]', borderColor: 'border-[#6D26AB]' }; // Only for seller role display
      case 'in_progress': return { label: 'Status: In Progress', color: 'text-[#6D26AB]', bgColor: 'bg-[#EDD9FF]', borderColor: 'border-[#6D26AB]' };
      case 'completed': return { label: 'Status: Completed', color: 'text-[#4CAF50]', bgColor: 'bg-[#E8F5E9]', borderColor: 'border-[#4CAF50]' };
      // Common statuses
      case 'cancelled': return { label: 'Status: Cancelled', color: 'text-[#DF678C]', bgColor: 'bg-[#FFE5ED]', borderColor: 'border-[#DF678C]' };
      case 'no_show': return { label: 'Status: No Show', color: 'text-[#DF678C]', bgColor: 'bg-[#FFE5ED]', borderColor: 'border-[#DF678C]' };
      case 'rescheduled': return { label: 'Status: Rescheduled', color: 'text-[#70727F]', bgColor: 'bg-[#E8E9ED]', borderColor: 'border-[#70727F]' };
      default: return { label: 'Status: Unknown', color: 'text-[#70727F]', bgColor: 'bg-[#E8E9ED]', borderColor: 'border-[#70727F]' };
    }
  };
  const statusDisplayBadge = getStatusDisplayBadge();
  
  const getProductTimeline = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      { id: 'pending', label: 'Order Placed', icon: Package, status: 'future', description: 'Order received and being processed', date: orderDate },
      { id: 'processing', label: 'Processing', icon: RefreshCw, status: 'future', description: 'Preparing your order for shipment'},
      { id: 'shipped', label: 'Shipped', icon: Truck, status: 'future', description: 'Order is on its way to you'},
      { id: 'delivered', label: 'Delivered', icon: CheckCircle, status: 'future', description: 'Order successfully delivered'}
    ];
    const flowSequence = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = flowSequence.indexOf(mappedDisplayStatus); // For products, mappedDisplayStatus is same as currentStatus

    if (steps.length > 0 && currentIndex >=0) steps[0].status = 'completed'; // Order placed is always completed if flow started

    if (currentIndex >= 0) {
      steps.forEach((step, index) => {
        if (index < currentIndex) {
          step.status = 'completed';
          if (!step.date) { const stepDate = new Date(orderDate); stepDate.setDate(orderDate.getDate() + index); step.date = stepDate; }
        } else if (index === currentIndex) {
          step.status = 'current';
        } else {
          step.status = 'future';
        }
      });
    }

    let finalSteps = [...steps];
    if (mappedDisplayStatus === 'cancelled') {
      const lastCompletedIdx = finalSteps.map(s=>s.status).lastIndexOf('completed');
      finalSteps.forEach((step, idx) => {
        if (idx > lastCompletedIdx && step.status !== 'current') step.status = 'skipped';
      });
      finalSteps.push({ id: 'cancelled', label: 'Cancelled', icon: XCircle, status: 'current', description: 'Order has been cancelled' });
    } else if (mappedDisplayStatus === 'returned') {
      finalSteps.forEach(step => { if (step.id === 'delivered' || step.id === 'shipped' || step.id === 'processing' || step.id === 'pending') step.status = 'completed'; });
      finalSteps.push({ id: 'returned', label: 'Returned', icon: RotateCcw, status: 'current', description: 'Order has been returned' });
    }
    console.log('[OrderStatusTimeline] Product Timeline Steps:', finalSteps.map(s => ({id: s.id, status: s.status, label: s.label})));
    return finalSteps;
  };

  const getServiceTimeline = (): TimelineStep[] => {
    console.log('[OrderStatusTimeline] getServiceTimeline START - userRole:', userRole, 'mappedDisplayStatus (for indexing):', mappedDisplayStatus, 'original currentStatus:', currentStatus);
    
    let definedSteps: TimelineStep[];
    // Define the sequence of steps based on userRole
    if (userRole === 'buyer') {
      definedSteps = [
        { id: 'requested', label: 'Booking Requested', icon: Calendar, status: 'future', description: 'Service booking request submitted', date: orderDate },
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, status: 'future', description: 'Provider confirmed your booking.' },
        { id: 'in_progress', label: 'In Progress', icon: PlayCircle, status: 'future', description: 'Service is currently being performed.' },
        { id: 'completed', label: 'Completed', icon: CheckCircle, status: 'future', description: 'Service completed successfully.' }
      ];
    } else { // Seller view
      definedSteps = [
        { id: 'requested', label: 'Booking Requested', icon: Calendar, status: 'future', description: 'Service booking request submitted.', date: orderDate },
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, status: 'future', description: 'You confirmed this booking.' },
        { id: 'scheduled', label: 'Scheduled', icon: Clock3, status: 'future', description: 'Appointment is scheduled with client.' },
        { id: 'in_progress', label: 'In Progress', icon: PlayCircle, status: 'future', description: 'Service is currently being performed.' },
        { id: 'completed', label: 'Completed', icon: CheckCircle, status: 'future', description: 'Service completed successfully.' }
      ];
    }
    console.log('[OrderStatusTimeline] Role-defined steps:', definedSteps.map(s => s.id));

    const flowSequenceIds = definedSteps.map(step => step.id);
    // mappedDisplayStatus will be 'confirmed' for a buyer if original currentStatus was 'scheduled'.
    // This index is used to mark the 'current' step in the role-specific definedSteps.
    const currentIndexInFlow = flowSequenceIds.indexOf(mappedDisplayStatus);
    console.log('[OrderStatusTimeline] Service Flow Sequence IDs:', flowSequenceIds, 'Current Index in Flow:', currentIndexInFlow);

    // Ensure 'requested' step always has its date if it's part of the defined steps.
    const requestedStepInitial = definedSteps.find(s => s.id === 'requested');
    if (requestedStepInitial && !requestedStepInitial.date) {
        requestedStepInitial.date = orderDate;
    }

    // Process normal flow states (completed, current, future)
    if (currentIndexInFlow !== -1) { // mappedDisplayStatus is a step in the current role's normal flow
      definedSteps.forEach((step, index) => {
        const positionInFlow = flowSequenceIds.indexOf(step.id); // Should be 'index' if definedSteps maps directly to flowSequenceIds
        if (positionInFlow < currentIndexInFlow) {
          step.status = 'completed';
          if (!step.date && step.id !== 'requested') { // Set dates, avoid overwriting 'requested' initial date unless necessary
            const stepDate = new Date(orderDate); stepDate.setDate(orderDate.getDate() + positionInFlow); step.date = stepDate;
          }
        } else if (positionInFlow === currentIndexInFlow) {
          step.status = 'current';
        } else {
          step.status = 'future';
        }
      });
    } else {
      // mappedDisplayStatus is one of the special statuses (e.g., 'cancelled', 'rescheduled', 'no_show')
      // Mark all normal flow steps based on which special status occurred.
      // For example, if 'cancelled' after 'confirmed', then 'requested' and 'confirmed' should be 'completed'.
      // This logic is primarily handled by the special status blocks below.
      // For now, ensure 'requested' is completed if the original status implies progression beyond it.
      if (requestedStepInitial && (mappedDisplayStatus === 'no_show' || mappedDisplayStatus === 'cancelled' || mappedDisplayStatus === 'rescheduled')) {
          if (currentStatus !== 'requested') { // If not cancelled/etc. directly from 'requested' state
             requestedStepInitial.status = 'completed';
          } else {
             requestedStepInitial.status = 'current'; // If cancelled AT requested, requested is current (and then cancelled appended)
          }
      }
    }
    
    let finalTimelineSteps = [...definedSteps]; // Start with the processed normal flow steps

    // Handle special terminal/branching statuses
    if (mappedDisplayStatus === 'cancelled') {
      // Determine the logical point of cancellation to mark previous steps completed/skipped
      let lastNormalStepBeforeCancelId = 'requested'; // Default if cancelled very early
      if (currentStatus === 'confirmed' || (userRole === 'buyer' && currentStatus === 'scheduled')) {
          lastNormalStepBeforeCancelId = 'confirmed';
      } else if (currentStatus === 'in_progress') {
          lastNormalStepBeforeCancelId = 'in_progress';
      } // If currentStatus is 'requested', lastNormalStepBeforeCancelId remains 'requested'

      const cancelPointIndex = flowSequenceIds.indexOf(lastNormalStepBeforeCancelId);

      finalTimelineSteps.forEach(step => {
        const stepIndexInFlow = flowSequenceIds.indexOf(step.id);
        if (stepIndexInFlow !== -1) { // If it's a normal flow step
            if (stepIndexInFlow < cancelPointIndex) step.status = 'completed';
            else if (stepIndexInFlow === cancelPointIndex && currentStatus !== step.id) step.status = 'completed'; // e.g. cancelled while confirmed, confirmed becomes completed
            else if (stepIndexInFlow === cancelPointIndex && currentStatus === step.id) step.status = 'current'; // e.g. cancelled while requested, requested is current
            else step.status = 'skipped';
        }
      });
      finalTimelineSteps.push({ id: 'cancelled', label: 'Cancelled', icon: XCircle, status: 'current', description: 'Booking has been cancelled' });
    } else if (mappedDisplayStatus === 'rescheduled') {
      // For 'rescheduled', 'requested' and 'confirmed' are typically completed. Others are future.
      finalTimelineSteps.forEach(step => {
        if (step.id === 'requested' || step.id === 'confirmed') {
          step.status = 'completed';
          if (step.id === 'confirmed' && !step.date) { const confDate = new Date(orderDate); confDate.setDate(orderDate.getDate() + 1); step.date = confDate; }
        } else if (flowSequenceIds.includes(step.id)) { // only mark normal flow steps as future
          step.status = 'future';
        }
      });
      finalTimelineSteps.push({ id: 'rescheduled', label: 'Rescheduled', icon: RotateCcw, status: 'current', description: 'Appointment has been rescheduled' });
    } else if (mappedDisplayStatus === 'no_show') {
      // Determine last completed step before 'no_show'
      // For buyer: 'confirmed' (as 'scheduled' maps to 'confirmed')
      // For seller: 'scheduled' (or 'confirmed' if 'scheduled' isn't used/reached)
      let lastNormalStepIdForNoShow = userRole === 'buyer' ? 'confirmed' : (flowSequenceIds.includes('scheduled') ? 'scheduled' : 'confirmed');
      
      // If 'no_show' occurs during 'in_progress', then 'in_progress' would be the last "active" normal step.
      // However, 'no_show' typically implies the service *didn't* start or wasn't attended *at scheduled time*.
      // So, 'confirmed' (for buyer) or 'scheduled' (for seller) are the most logical preceding completed steps.

      const lastNormalStepIndex = flowSequenceIds.indexOf(lastNormalStepIdForNoShow);

      finalTimelineSteps.forEach(step => {
        const stepIndexInFlow = flowSequenceIds.indexOf(step.id);
        if (stepIndexInFlow !== -1 && stepIndexInFlow <= lastNormalStepIndex) {
          step.status = 'completed';
        } else if (flowSequenceIds.includes(step.id)) { // only mark normal flow steps as skipped
          step.status = 'skipped';
        }
      });
      finalTimelineSteps.push({ id: 'no_show', label: 'No Show', icon: XCircle, status: 'current', description: userRole === 'buyer' ? 'Appointment missed' : 'Customer did not attend'});
    }
    
    console.log('[OrderStatusTimeline] Final Service Timeline Steps (before unique filter):', finalTimelineSteps.map(s => ({id: s.id, status: s.status, label: s.label})));
    
    // Ensure unique steps if a special status might have been re-added after being a definedStep
    // This is more of a safeguard. The logic should ideally prevent duplicates.
    const uniqueTimelineSteps = finalTimelineSteps.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        } else { // If duplicate ID, prioritize 'current' or 'completed' status if one is 'future'
            if ((current.status === 'current' || current.status === 'completed') && x.status === 'future') {
                x.status = current.status; // Update status of existing
            }
            return acc;
        }
    }, [] as TimelineStep[]);


    console.log('[OrderStatusTimeline] Unique Final Service Timeline Steps:', uniqueTimelineSteps.map(s => ({id: s.id, status: s.status, label: s.label})));
    return uniqueTimelineSteps;
  };

  const timeline = orderType === 'product' ? getProductTimeline() : getServiceTimeline();

  const getStepColors = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return { bg: 'bg-[#E8F5E9]', border: 'border-[#4CAF50]', icon: 'text-[#4CAF50]', text: 'text-[#1B1C20]', line: 'bg-[#4CAF50]' };
      case 'current': return { bg: 'bg-[#EDD9FF]', border: 'border-[#3D1560]', icon: 'text-[#3D1560]', text: 'text-[#3D1560]', line: 'bg-[#CDCED8]' }; // Line to next is grey
      case 'future': return { bg: 'bg-[#F8F8FA]', border: 'border-[#CDCED8]', icon: 'text-[#70727F]', text: 'text-[#70727F]', line: 'bg-[#CDCED8]' };
      case 'skipped': return { bg: 'bg-[#FFE5ED]', border: 'border-[#DF678C]', icon: 'text-[#DF678C]', text: 'text-[#DF678C]', line: 'bg-[#DF678C]' };
      default: return { bg: 'bg-[#F8F8FA]', border: 'border-[#CDCED8]', icon: 'text-[#70727F]', text: 'text-[#70727F]', line: 'bg-[#CDCED8]' };
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header with Title and Booking ID */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#1B1C20] mb-2">
            {orderType === 'product' ? 'Order' : 'Booking'} Progress
          </h3>
          {bookingId && (
            <button
              onClick={copyBookingId}
              className="text-sm text-[#70727F] hover:text-[#3D1560] transition-colors cursor-pointer focus:outline-none focus:text-[#3D1560]"
              title="Click to copy booking ID"
            >
              {isCopied ? 'Booking ID copied!' : `Booking ID: ${bookingId}`}
            </button>
          )}
        </div>
        {/* Status Badge - Top Right */}
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusDisplayBadge.bgColor} ${statusDisplayBadge.color} ${statusDisplayBadge.borderColor}`}>
          {statusDisplayBadge.label}
        </span>
      </div>
      
      {/* Desktop Timeline - Horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Base Connecting Line - Covers entire width initially */}
          <div className="absolute top-[18px] left-7 right-7 h-0.5 bg-[#E8E9ED] z-0"></div>

          {/* Colored Progress / Status Lines */}
          {timeline.slice(0, -1).map((step, index) => {
            const nextStep = timeline[index + 1];
            let segmentColorCls: string;

            if (step.status === 'completed' && (nextStep.status === 'completed' || nextStep.status === 'current')) {
              segmentColorCls = 'bg-[#4CAF50]'; // Green if current step completed and next is completed or current
            } else if (step.status === 'current' && nextStep.status === 'future') {
              // If current step is 'current', the line TO IT should be green (handled by previous segment), line FROM IT to next future is grey
              segmentColorCls = 'bg-[#CDCED8]'; 
            } else if (step.status === 'skipped' || nextStep.status === 'skipped') {
              segmentColorCls = 'bg-[#DF678C]'; // Pink if this or next is skipped
            }
             else { // Default for future connections or other cases
              segmentColorCls = 'bg-[#E8E9ED]';
            }
            
            const segmentWidthPercentage = 100 / (timeline.length > 1 ? timeline.length -1 : 1) ;

            let calculatedWidth = `${segmentWidthPercentage}%`;
             // Adjust width to stop at the center of the next icon if it's not fully connected
            if (nextStep.status === 'current' && step.status === 'completed') {
                 // Stop at center of current icon: segmentWidth * 1 - icon_radius_adjustment
                 calculatedWidth = `calc(${segmentWidthPercentage}% - 1.125rem)`; // 1.125rem is ~half of 2.25rem icon+border
            } else if (nextStep.status === 'future' && step.status === 'current') {
                 calculatedWidth = `calc(${segmentWidthPercentage}% - 1.125rem)`;
            }


            return (
              <div
                key={`${step.id}-segment-${index}`}
                className={`absolute top-[18px] h-0.5 ${segmentColorCls}`}
                style={{
                  left: `calc(1.75rem + ${index * segmentWidthPercentage}%)`, // 1.75rem approx center of icon
                  width: calculatedWidth,
                  zIndex: 5, // Higher z-index for colored segments over base grey line
                }}
              />
            );
          })}
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {timeline.map((step, index) => {
              const colors = getStepColors(step.status);
              const StepIcon = step.icon;
              
              return (
                <div 
                  key={step.id + '-' + index} // Ensure unique key if IDs can repeat (e.g. after special status)
                  className="group relative flex flex-col items-center flex-1 pt-1 pb-2 px-1 focus:outline-none" 
                  tabIndex={0}
                >
                  <div className={`relative w-9 h-9 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center mb-2.5`}
                       style={{ zIndex: 10 }}>
                    <StepIcon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  
                  <div className="text-center relative">
                    <h4 className={`${step.status === 'current' ? 'font-semibold' : 'font-normal'} text-sm mb-0.5 ${colors.text} transition-colors duration-200`}>
                      {step.label}
                    </h4>
                    
                    {step.date && (
                      <p className="text-xs text-[#70727F] mb-1 transition-colors duration-200">
                        {step.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    )}

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
            
            let connectingLineColorCls: string = 'bg-[#E8E9ED]'; // Default grey
            if (!isLast) {
              const nextStep = timeline[index + 1];
              if (step.status === 'completed' && (nextStep.status === 'completed' || nextStep.status === 'current')) {
                connectingLineColorCls = 'bg-[#4CAF50]'; // Green
              } else if (step.status === 'skipped' || nextStep.status === 'skipped') {
                connectingLineColorCls = 'bg-[#DF678C]'; // Pink
              } else if (step.status === 'current' && nextStep.status === 'future') {
                connectingLineColorCls = 'bg-[#CDCED8]'; // Grey from current to future
              }
            }

            return (
              <div 
                key={step.id + '-mobile-' + index} 
                className="group relative flex items-start gap-3 p-2 rounded-md focus:outline-none focus:bg-[#EDD9FF] focus:bg-opacity-50" 
                tabIndex={0}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center z-10`}>
                    <StepIcon className={`w-3 h-3 ${colors.icon}`} />
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 h-full min-h-[24px] mt-1 mb-1 ${connectingLineColorCls}`}></div>
                  )}
                </div>
                
                <div className="flex-1 pt-1 pb-1">
                  <h4 className={`${step.status === 'current' ? 'font-semibold' : 'font-normal'} text-sm mb-0.5 ${colors.text}`}>{step.label}</h4>
                  {step.date && (
                    <p className="text-xs text-[#70727F] mb-1">{step.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  )}
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