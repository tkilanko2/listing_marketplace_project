import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  X, 
  MessageCircle, 
  Circle, 
  User,
  Package,
  Calendar
} from 'lucide-react';

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
  type: 'booking' | 'order';
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
  orderInfo?: { // Information about the order/booking for new threads
    id: string;
    type: 'booking' | 'order';
    title: string;
    sellerName: string;
    sellerId: string;
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
    title: '',
    issueCategory: '',
    content: '',
    attachments: [] as File[]
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockThreads: MessageThread[] = [
      {
        id: 'BK001',
        type: 'booking',
        title: 'Booking #BK001 - Hair Styling Service',
        participants: {
          buyer: { id: 'buyer1', name: 'John D.' },
          seller: { id: 'seller1', name: 'Sarah M.' }
        },
        messages: [
          {
            id: 'msg1',
            threadId: 'BK001',
            senderId: 'buyer1',
            senderType: 'buyer',
            senderName: 'John D.',
            title: 'Question about service location',
            issueCategory: 'Service Location/Address',
            content: 'Hi, I wanted to confirm the exact address for my appointment tomorrow. Could you please provide the specific building entrance to use?',
            timestamp: new Date('2024-01-15T10:30:00'),
            status: 'read'
          },
          {
            id: 'msg2',
            threadId: 'BK001',
            senderId: 'seller1',
            senderType: 'seller',
            senderName: 'Sarah M.',
            title: 'Re: Question about service location',
            issueCategory: 'Service Location/Address',
            content: 'Hello John! The address is 123 Main Street, Suite 201. Please use the main entrance and take the elevator to the 2nd floor. I\'ll be waiting for you in Suite 201. Looking forward to seeing you tomorrow!',
            timestamp: new Date('2024-01-15T14:20:00'),
            status: 'unread'
          }
        ],
        lastActivity: new Date('2024-01-15T14:20:00'),
        unreadCount: 1,
        status: 'active'
      },
      {
        id: 'OR002',
        type: 'order',
        title: 'Order #OR002 - Wireless Headphones',
        participants: {
          buyer: { id: 'buyer1', name: 'John D.' },
          seller: { id: 'seller2', name: 'Tech Store' }
        },
        messages: [
          {
            id: 'msg3',
            threadId: 'OR002',
            senderId: 'buyer1',
            senderType: 'buyer',
            senderName: 'John D.',
            title: 'Shipping delay inquiry',
            issueCategory: 'Shipping & Delivery',
            content: 'Hi, I noticed my order hasn\'t been shipped yet. The expected ship date was 2 days ago. Could you please provide an update?',
            timestamp: new Date('2024-01-14T09:15:00'),
            status: 'read'
          }
        ],
        lastActivity: new Date('2024-01-14T09:15:00'),
        unreadCount: 0,
        status: 'active'
      }
    ];
    
    setThreads(mockThreads);
    
    if (threadId) {
      const thread = mockThreads.find(t => t.id === threadId);
      if (thread) {
        setSelectedThread(thread);
        setIsCreatingNewThread(false);
      } else if (orderInfo && startNewThread) {
        // If no existing thread found but we have order info, prepare for new thread creation
        setIsCreatingNewThread(true);
        setShowMessageForm(true);
      }
    } else if (startNewThread && orderInfo) {
      // Starting a new thread
      setIsCreatingNewThread(true);
      setShowMessageForm(true);
    }
  }, [threadId, startNewThread, orderInfo]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 3;
    
    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      if (file.type.startsWith('image/') && file.size <= maxSize) {
        validFiles.push(file);
      }
    }
    
    setMessageForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles].slice(0, maxFiles)
    }));
  };

  const removeAttachment = (index: number) => {
    setMessageForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSendMessage = () => {
    if (!messageForm.title.trim() || !messageForm.content.trim() || !messageForm.issueCategory) {
      return;
    }

    // Mock sending message - replace with actual API call
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      threadId: selectedThread?.id || orderInfo?.id || '',
      senderId: currentUserId,
      senderType: currentUserType,
      senderName: currentUserType === 'buyer' ? 'You' : 'You',
      title: messageForm.title,
      issueCategory: messageForm.issueCategory,
      content: messageForm.content,
      attachments: messageForm.attachments.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      })),
      timestamp: new Date(),
      status: 'unread'
    };

    if (isCreatingNewThread && orderInfo) {
      // Create new thread
      const newThread: MessageThread = {
        id: orderInfo.id,
        type: orderInfo.type,
        title: orderInfo.title,
        participants: {
          buyer: { id: currentUserId, name: 'You' },
          seller: { id: orderInfo.sellerId, name: orderInfo.sellerName }
        },
        messages: [newMessage],
        lastActivity: new Date(),
        unreadCount: 0,
        status: 'active'
      };

      setThreads(prev => [newThread, ...prev]);
      setSelectedThread(newThread);
      setIsCreatingNewThread(false);
    } else if (selectedThread) {
      // Add message to existing thread
      setSelectedThread(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastActivity: new Date()
      } : null);

      // Update thread in threads list
      setThreads(prev => prev.map(thread => 
        thread.id === selectedThread.id 
          ? { ...thread, messages: [...thread.messages, newMessage], lastActivity: new Date() }
          : thread
      ));
    }

    // Reset form
    setMessageForm({
      title: '',
      issueCategory: '',
      content: '',
      attachments: []
    });
    setShowMessageForm(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIssueCategories = (threadType: 'booking' | 'order') => {
    return threadType === 'booking' ? serviceIssueCategories : productIssueCategories;
  };

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
              <h2 className="text-lg font-semibold text-[#1B1C20]">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
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
                        with {currentUserType === 'buyer' ? thread.participants.seller.name : thread.participants.buyer.name}
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
                        {isCreatingNewThread && orderInfo ? orderInfo.title : selectedThread?.title}
                      </h2>
                      <p className="text-sm text-[#70727F]">
                        {isCreatingNewThread && orderInfo 
                          ? `with ${orderInfo.sellerName}`
                          : `with ${currentUserType === 'buyer' ? selectedThread?.participants.seller.name : selectedThread?.participants.buyer.name}`
                        }
                      </p>
                    </div>
                    {/* Only show New Message button for buyers, or if creating a new thread */}
                    {(currentUserType === 'buyer' || isCreatingNewThread) && (
                      <button
                        onClick={() => setShowMessageForm(true)}
                        className="flex items-center gap-2 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {isCreatingNewThread ? 'Start Conversation' : 'Reply'}
                      </button>
                    )}
                    
                    {/* For sellers, show a reply button instead */}
                    {currentUserType === 'seller' && !isCreatingNewThread && (
                      <button
                        onClick={() => setShowMessageForm(true)}
                        className="flex items-center gap-2 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isCreatingNewThread ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-[#CDCED8] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#383A47] mb-2">Start a new conversation</h3>
                        <p className="text-[#70727F]">Send your first message to begin the conversation</p>
                      </div>
                    </div>
                  ) : (
                    selectedThread?.messages.map(message => (
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
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs opacity-80">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{attachment.name}</span>
                                  <span>({formatFileSize(attachment.size)})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    )) || []
                  )}
                </div>

                {/* Message Form */}
                {showMessageForm && (
                  <div className="border-t border-[#E8E9ED] p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#383A47] mb-2">
                            Message Title *
                          </label>
                          <input
                            type="text"
                            value={messageForm.title}
                            onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                            placeholder="Enter message title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#383A47] mb-2">
                            Issue Category *
                          </label>
                          <select
                            value={messageForm.issueCategory}
                            onChange={(e) => setMessageForm(prev => ({ ...prev, issueCategory: e.target.value }))}
                            className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            {getIssueCategories(isCreatingNewThread && orderInfo ? orderInfo.type : selectedThread?.type || 'booking').map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          Message *
                        </label>
                        <textarea
                          value={messageForm.content}
                          onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent resize-none"
                          placeholder="Type your message here..."
                        />
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          Attachments (Max 3 images, 10MB each)
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 border border-[#CDCED8] rounded-lg cursor-pointer hover:bg-[#F8F8FA] transition-colors">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">Add Images</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-[#70727F]">
                            {messageForm.attachments.length}/3 files selected
                          </span>
                        </div>
                        
                        {messageForm.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {messageForm.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-[#F8F8FA] p-2 rounded">
                                <div className="flex items-center gap-2">
                                  <Paperclip className="w-3 h-3 text-[#70727F]" />
                                  <span className="text-sm text-[#383A47]">{file.name}</span>
                                  <span className="text-xs text-[#70727F]">({formatFileSize(file.size)})</span>
                                </div>
                                <button
                                  onClick={() => removeAttachment(index)}
                                  className="text-[#DF678C] hover:text-[#C5587A] p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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
                          disabled={!messageForm.title.trim() || !messageForm.content.trim() || !messageForm.issueCategory}
                          className="flex items-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-[#CDCED8] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#383A47] mb-2">Select a conversation</h3>
                  <p className="text-[#70727F]">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 