import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Circle, 
  User,
  Package,
  Calendar
} from 'lucide-react';
import { 
  addMessageToThread,
  getMessageThreadById,
  getMessageThreadsForUser,
  getUnreadCountForUser,
  markThreadReadForUser
} from '../mockData';

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  title: string;
  issueCategory: string;
  content: string;
  attachments?: { name: string; url: string; size: number }[];
  timestamp: Date;
  status: 'unread' | 'read';
}

interface MessageThread {
  id: string;
  type: 'booking' | 'order' | 'listing';
  title: string;
  participants: { 
    buyer: { id: string; name: string };
    seller: { id: string; name: string };
  };
  messages: Message[];
  lastActivity: Date;
  unreadCount: number;
  status: 'active' | 'resolved';
}

interface MessagingPageProps {
  threadId?: string;
  currentUserId?: string;
  currentUserType?: 'buyer' | 'seller';
  onBack?: () => void;
  startNewThread?: boolean; // For buyers to start new threads
  orderInfo?: { // Information about the order/booking/listing for new threads
    id: string;
    type: 'booking' | 'order' | 'listing';
    title: string;
    sellerName: string;
    sellerId: string;
    buyerId?: string;
    buyerName?: string;
  };
}

const serviceIssueCategories = [
  'Appointment Scheduling',
  'Rescheduling Request', 
  'Service Location/Address',
  'Service Details & Requirements',
  'Provider Availability',
  'Payment & Billing',
  'Cancellation Request',
  'Service Quality Concerns',
  'No-Show Issues',
  'Special Accommodations',
  'Pre-Service Questions',
  'Post-Service Follow-up',
  'Technical Issues',
  'Other'
];

const productIssueCategories = [
  'Order Status & Tracking',
  'Shipping & Delivery',
  'Product Information',
  'Size/Color/Specification',
  'Payment & Billing',
  'Return & Refund Request',
  'Exchange Request',
  'Product Quality Issues',
  'Damaged/Missing Items',
  'Order Modification',
  'Delivery Address Change',
  'Order Cancellation',
  'Technical Issues',
  'Other'
];

export function MessagingPage({ 
  threadId, 
  currentUserId = 'user1', 
  currentUserType = 'buyer', 
  onBack,
  startNewThread = false,
  orderInfo
}: MessagingPageProps) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [isCreatingNewThread, setIsCreatingNewThread] = useState(startNewThread);
  const [messageForm, setMessageForm] = useState({
    issueCategory: '',
    otherReason: '',
    content: '',
    attachments: [] as File[]
  });

  const loadThreads = () => {
    const items = getMessageThreadsForUser(currentUserId, currentUserType).map(thread => ({
      ...thread,
      unreadCount: getUnreadCountForUser(thread.id, currentUserId)
    }));
    setThreads(items);
    return items;
  };

  useEffect(() => {
    const items = loadThreads();
    
    if (threadId) {
      const thread = getMessageThreadById(threadId);
      if (thread) {
        markThreadReadForUser(thread.id, currentUserId);
        setSelectedThread(thread);
        setIsCreatingNewThread(false);
        setShowMessageForm(false);
        loadThreads();
      } else if (orderInfo && startNewThread) {
        setIsCreatingNewThread(true);
        setShowMessageForm(true);
      }
    } else if (orderInfo) {
      const thread = getMessageThreadById(orderInfo.id);
      if (thread) {
        markThreadReadForUser(thread.id, currentUserId);
        setSelectedThread(thread);
        setIsCreatingNewThread(false);
        setShowMessageForm(false);
        loadThreads();
      } else if (startNewThread) {
        setIsCreatingNewThread(true);
        setShowMessageForm(true);
      }
    } else if (!threadId) {
      setSelectedThread(items[0] || null);
    }
  }, [threadId, startNewThread, orderInfo, currentUserId, currentUserType]);

  const handleSendMessage = () => {
    if (!messageForm.content.trim()) {
      return;
    }

    if (isCreatingNewThread) {
      if (!orderInfo || !messageForm.issueCategory) {
        return;
      }
      if (messageForm.issueCategory === 'Other' && !messageForm.otherReason.trim()) {
        return;
      }
    }

    const computedTitle = isCreatingNewThread
      ? messageForm.issueCategory === 'Other'
        ? messageForm.otherReason.trim()
        : messageForm.issueCategory
      : selectedThread?.title || 'Message';

    const computedIssueCategory = isCreatingNewThread
      ? messageForm.issueCategory
      : selectedThread?.messages[0]?.issueCategory || 'General';

    if (!computedTitle) {
      return;
    }

    const threadIdForMessage = selectedThread?.id || orderInfo?.id || `thread_${Date.now()}`;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      threadId: threadIdForMessage,
      senderId: currentUserId,
      senderType: currentUserType,
      senderName: 'You',
      title: computedTitle,
      issueCategory: computedIssueCategory,
      content: messageForm.content,
      attachments: [],
      timestamp: new Date(),
      status: 'unread'
    };

    const updatedThread = addMessageToThread({
      threadId: threadIdForMessage,
      message: newMessage,
      orderInfo,
      currentUserId,
      currentUserType
    });

    if (updatedThread) {
      setSelectedThread(updatedThread);
      setIsCreatingNewThread(false);
      loadThreads();
    }

    setMessageForm({
      issueCategory: '',
      otherReason: '',
      content: '',
      attachments: []
    });
    setShowMessageForm(false);
  };

  const formatParticipantName = (fullName: string): string => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  };

  const getIssueCategories = (threadType: 'booking' | 'order' | 'listing') => {
    // Treat listing as booking for category purposes
    if (threadType === 'listing' || threadType === 'booking') {
      return serviceIssueCategories;
    }
    return productIssueCategories;
  };

  const lastMessage = selectedThread?.messages[selectedThread.messages.length - 1];
  const canReply = !!selectedThread && lastMessage?.senderId !== currentUserId;

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#1B1C20]">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Thread List */}
          <div className="lg:col-span-1 bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] overflow-hidden">
            <div className="p-4 border-b border-[#E8E9ED]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1B1C20]">Conversations</h2>
                {/* Removed general messaging - buyers must start from booking/order/listing pages */}
              </div>
            </div>
            
            {/* CTA removed - messaging starts from booking/order/listing only */}
            
            <div className="overflow-y-auto h-full">
              {threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => {
                    markThreadReadForUser(thread.id, currentUserId);
                    setSelectedThread(thread);
                    setIsCreatingNewThread(false);
                    setShowMessageForm(false);
                    loadThreads();
                  }}
                  className={`w-full p-4 text-left border-b border-[#E8E9ED] hover:bg-[#F8F8FA] transition-colors ${
                    selectedThread?.id === thread.id ? 'bg-[#EDD9FF]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      thread.type === 'booking' ? 'bg-[#EDD9FF]' : 'bg-[#E8F5E9]'
                    }`}>
                      {thread.type === 'booking' ? 
                        <Calendar className="w-5 h-5 text-[#3D1560]" /> : 
                        <Package className="w-5 h-5 text-[#4CAF50]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-[#1B1C20] truncate">
                          {thread.title}
                        </h3>
                        {thread.unreadCount > 0 && (
                          <span className="bg-[#3D1560] text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#70727F] mb-1">
                        with {formatParticipantName(
                          currentUserType === 'buyer' ? thread.participants.seller.name : thread.participants.buyer.name
                        )}
                      </p>
                      <p className="text-xs text-[#CDCED8]">
                        {thread.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Main - Message Thread */}
          <div className="lg:col-span-2 bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] flex flex-col">
            {selectedThread || isCreatingNewThread ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-[#E8E9ED]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1B1C20]">
                        {isCreatingNewThread && orderInfo 
                          ? orderInfo.title 
                            : selectedThread?.title
                        }
                      </h2>
                      <p className="text-sm text-[#70727F]">
                        {isCreatingNewThread && orderInfo 
                          ? `with ${formatParticipantName(
                              currentUserType === 'buyer'
                                ? orderInfo.sellerName
                                : orderInfo.buyerName || 'Buyer'
                            )}`
                          : selectedThread
                            ? `with ${formatParticipantName(
                                currentUserType === 'buyer' 
                                  ? selectedThread?.participants.seller.name 
                                  : selectedThread?.participants.buyer.name
                              )}`
                            : ''
                        }
                      </p>
                    </div>
                    {/* Reply CTA moved below message list */}
                  </div>
                </div>

                {/* Messages */}
                <div
                  className={`${isCreatingNewThread ? 'flex-none' : 'flex-1'} overflow-y-auto p-4 space-y-4`}
                >
                  {!isCreatingNewThread &&
                    (selectedThread?.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.senderId === currentUserId ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#EDD9FF] flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-[#3D1560]" />
                      </div>
                      <div className={`max-w-[70%] ${message.senderId === currentUserId ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`rounded-lg p-4 ${
                          message.senderId === currentUserId 
                            ? 'bg-[#3D1560] text-white' 
                            : 'bg-[#F8F8FA] text-[#383A47]'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium opacity-80">
                              {message.senderName}
                            </span>
                            <span className="text-xs opacity-60">
                              {message.timestamp.toLocaleString()}
                            </span>
                            {message.status === 'unread' && message.senderId !== currentUserId && (
                              <Circle className="w-2 h-2 fill-current text-[#3D1560]" />
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{message.title}</h4>
                          <p className="text-xs opacity-80 mb-2">Category: {message.issueCategory}</p>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                        </div>
                      </div>
                    )))}
                </div>

                {/* Reply CTA */}
                {selectedThread && !isCreatingNewThread && !showMessageForm && (
                  <div className="border-t border-[#E8E9ED] px-4 py-3 flex justify-end">
                    <button
                      onClick={() => {
                        if (canReply) {
                          setShowMessageForm(true);
                        }
                      }}
                      disabled={!canReply}
                      className="flex items-center gap-2 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {canReply ? 'Reply' : 'Waiting for response'}
                    </button>
                  </div>
                )}

                {/* Message Form */}
                {showMessageForm && (
                  <div className="border-t border-[#E8E9ED] p-4">
                    <div className="space-y-4">

                      {isCreatingNewThread && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#383A47] mb-2">
                              Issue Category *
                            </label>
                            <select
                              value={messageForm.issueCategory}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setMessageForm(prev => ({ 
                                  ...prev, 
                                  issueCategory: nextValue,
                                  otherReason: nextValue === 'Other' ? prev.otherReason : ''
                                }));
                              }}
                            className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            {getIssueCategories(
                              isCreatingNewThread && orderInfo 
                                  ? (orderInfo.type === 'listing' ? 'listing' : orderInfo.type)
                                  : selectedThread?.type || 'booking'
                            ).map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                          {messageForm.issueCategory === 'Other' && (
                            <div>
                              <label className="block text-sm font-medium text-[#383A47] mb-2">
                                Other Reason *
                              </label>
                              <input
                                type="text"
                                value={messageForm.otherReason}
                                onChange={(e) => setMessageForm(prev => ({ ...prev, otherReason: e.target.value }))}
                                className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                                placeholder="Describe your reason"
                              />
                            </div>
                          )}
                      </div>
                      )}

                      {((isCreatingNewThread &&
                        messageForm.issueCategory &&
                        (messageForm.issueCategory !== 'Other' || messageForm.otherReason.trim())) ||
                        (!isCreatingNewThread && canReply)) && (
                          <>
                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          Message *
                        </label>
                        <textarea
                          value={messageForm.content}
                          onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                                rows={8}
                          className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent resize-none"
                          placeholder="Type your message here..."
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowMessageForm(false)}
                          className="px-4 py-2 border border-[#CDCED8] text-[#383A47] rounded-lg hover:bg-[#F8F8FA] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendMessage}
                          disabled={
                            !messageForm.content.trim() || 
                                  (isCreatingNewThread && !messageForm.issueCategory) ||
                                  (isCreatingNewThread && messageForm.issueCategory === 'Other' && !messageForm.otherReason.trim()) ||
                                  (isCreatingNewThread && !orderInfo) ||
                                  (!isCreatingNewThread && !canReply)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>
                          </>
                        )}

                      {!isCreatingNewThread && !canReply && (
                        <div className="text-sm text-[#70727F]">
                          Waiting for a response before you can reply.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-[#CDCED8] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#383A47] mb-2">
                    {currentUserType === 'buyer' ? 'No active conversations' : 'Select a conversation'}
                  </h3>
                  <p className="text-[#70727F] mb-4">
                    {currentUserType === 'buyer' 
                      ? 'Start a conversation from a booking, order, or listing page' 
                      : 'Choose a conversation from the list to start messaging'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 