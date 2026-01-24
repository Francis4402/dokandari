import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaImage,
  FaSmile,
  FaEllipsisV,
  FaCheckDouble,
  FaCheck,
  FaPhone,
  FaVideo,
  FaArchive,
  FaStar,
  FaEnvelope,
  FaUsers,
  FaPlus,
  FaCircle,
  FaRegCircle,
  FaTimes
} from 'react-icons/fa';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isArchived: boolean;
  isStarred: boolean;
  isGroup?: boolean;
  groupName?: string;
  groupMembers?: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'offline';
}

interface PageProps {
  auth: {
    user: any;
  };
}

type MessageTab = 'inbox' | 'unread' | 'starred' | 'archived';

const Messages = () => {
  const [activeTab, setActiveTab] = useState<MessageTab>('inbox');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      participant: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
        role: 'Customer',
        status: 'online',
        lastSeen: '2 min ago'
      },
      lastMessage: 'Thanks for the quick response! The product looks great.',
      timestamp: '10:30 AM',
      unreadCount: 2,
      isArchived: false,
      isStarred: true
    },
    {
      id: '2',
      participant: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
        role: 'VIP Customer',
        status: 'away',
        lastSeen: '1 hour ago'
      },
      lastMessage: 'When will my order be shipped?',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isArchived: false,
      isStarred: false
    },
    {
      id: '3',
      participant: {
        id: 'user3',
        name: 'Mike Wilson',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=random',
        role: 'Agent',
        status: 'online',
        lastSeen: 'Just now'
      },
      lastMessage: 'I need help with inventory management.',
      timestamp: '2 days ago',
      unreadCount: 5,
      isArchived: false,
      isStarred: true
    },
    {
      id: '4',
      isGroup: true,
      groupName: 'Support Team',
      groupMembers: 8,
      participant: {
        id: 'group1',
        name: 'Support Team',
        avatar: 'https://ui-avatars.com/api/?name=Support+Team&background=random',
        role: 'Group',
        status: 'online'
      },
      lastMessage: 'Please check the new support tickets',
      timestamp: '3 days ago',
      unreadCount: 12,
      isArchived: false,
      isStarred: false
    },
    {
      id: '5',
      participant: {
        id: 'user4',
        name: 'Alex Turner',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Turner&background=random',
        role: 'Admin',
        status: 'offline',
        lastSeen: 'Last seen 3 days ago'
      },
      lastMessage: 'Meeting scheduled for tomorrow at 3 PM',
      timestamp: '1 week ago',
      unreadCount: 0,
      isArchived: true,
      isStarred: false
    }
  ];

  // Mock messages data
  const messages: Message[] = [
    {
      id: 'msg1',
      senderId: 'user1',
      receiverId: 'current',
      content: 'Hi there! I have a question about my recent order.',
      timestamp: '10:15 AM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg2',
      senderId: 'current',
      receiverId: 'user1',
      content: 'Hello! I\'d be happy to help. What\'s your order number?',
      timestamp: '10:20 AM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg3',
      senderId: 'user1',
      receiverId: 'current',
      content: 'It\'s #ORD-78945. When will it be shipped?',
      timestamp: '10:25 AM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg4',
      senderId: 'current',
      receiverId: 'user1',
      content: 'Let me check that for you. Your order will be shipped within 24 hours.',
      timestamp: '10:30 AM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg5',
      senderId: 'user1',
      receiverId: 'current',
      content: 'Perfect! Thanks for the quick response.',
      timestamp: '10:32 AM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg6',
      senderId: 'user1',
      receiverId: 'current',
      content: 'Also, can I get a tracking number once it\'s shipped?',
      timestamp: '10:33 AM',
      read: false,
      type: 'text'
    }
  ];

  // Mock users for new chat
  const users: User[] = [
    { id: 'u1', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random', role: 'Customer', status: 'online' },
    { id: 'u2', name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random', role: 'VIP Customer', status: 'away' },
    { id: 'u3', name: 'Mike Wilson', avatar: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=random', role: 'Agent', status: 'online' },
    { id: 'u4', name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random', role: 'Customer', status: 'offline' },
    { id: 'u5', name: 'Robert Brown', avatar: 'https://ui-avatars.com/api/?name=Robert+Brown&background=random', role: 'Admin', status: 'online' },
    { id: 'u6', name: 'Lisa Miller', avatar: 'https://ui-avatars.com/api/?name=Lisa+Miller&background=random', role: 'Agent', status: 'online' }
  ];

  const currentUser = {
    id: 'current',
    name: 'You',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
  };

  const filteredConversations = conversations.filter(conversation => {
    // Apply tab filter
    if (activeTab === 'unread' && conversation.unreadCount === 0) return false;
    if (activeTab === 'starred' && !conversation.isStarred) return false;
    if (activeTab === 'archived' && !conversation.isArchived) return false;
    if (activeTab === 'inbox' && conversation.isArchived) return false;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        conversation.participant.name.toLowerCase().includes(searchLower) ||
        conversation.lastMessage.toLowerCase().includes(searchLower) ||
        (conversation.groupName && conversation.groupName.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const getStatusColor = (status: 'online' | 'away' | 'offline') => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: 'online' | 'away' | 'offline') => {
    switch (status) {
      case 'online': return <FaCircle className="h-2 w-2" />;
      case 'away': return <FaCircle className="h-2 w-2" />;
      case 'offline': return <FaRegCircle className="h-2 w-2" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const toggleStar = (conversationId: string) => {
    console.log('Toggling star for conversation:', conversationId);
  };

  const toggleArchive = (conversationId: string) => {
    console.log('Toggling archive for conversation:', conversationId);
  };

  return (
    <DashboardLayout>
      <Head title="Messages" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-600 mt-1">Manage your conversations and customer support</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewChat(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-0.5"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  New Message
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversations Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg h-full">
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {(['inbox', 'unread', 'starred', 'archived'] as MessageTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {tab === 'unread' && (
                          <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                            {conversations.filter(c => c.unreadCount > 0).length}
                          </span>
                        )}
                        {tab}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Conversations List */}
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-8">
                      <FaEnvelope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No conversations found</p>
                    </div>
                  ) : (
                    <div>
                      {filteredConversations.map(conversation => (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedConversation === conversation.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                  src={conversation.participant.avatar}
                                  alt={conversation.participant.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {!conversation.isGroup && (
                                <div className={`absolute -bottom-0.5 -right-0.5 ${getStatusColor(conversation.participant.status)}`}>
                                  {getStatusIcon(conversation.participant.status)}
                                </div>
                              )}
                              {conversation.isGroup && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                  <FaUsers className="h-2 w-2 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Conversation Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-800 truncate">
                                  {conversation.isGroup ? conversation.groupName : conversation.participant.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {conversation.isStarred && (
                                    <FaStar className="h-3 w-3 text-yellow-500" />
                                  )}
                                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                                </div>
                              </div>

                              <div className="flex items-center mb-1">
                                {conversation.isGroup && (
                                  <span className="text-xs text-purple-600 font-medium mr-2">
                                    Group • {conversation.groupMembers} members
                                  </span>
                                )}
                                {!conversation.isGroup && (
                                  <span className="text-xs text-gray-500 font-medium mr-2">
                                    {conversation.participant.role}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 truncate mb-1">
                                {conversation.lastMessage}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {conversation.unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                      {conversation.unreadCount} new
                                    </span>
                                  )}
                                </div>
                                {conversation.isArchived && (
                                  <FaArchive className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              {selectedConversation ? (
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={selectedConv?.participant.avatar}
                              alt={selectedConv?.participant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {selectedConv && !selectedConv.isGroup && (
                            <div className={`absolute -bottom-0.5 -right-0.5 ${getStatusColor(selectedConv.participant.status)}`}>
                              {getStatusIcon(selectedConv.participant.status)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {selectedConv?.isGroup ? selectedConv.groupName : selectedConv?.participant.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {selectedConv?.isGroup ? (
                              <span className="text-sm text-gray-600">
                                <FaUsers className="h-3 w-3 inline mr-1" />
                                {selectedConv.groupMembers} members
                              </span>
                            ) : (
                              <>
                                <span className={`text-sm ${getStatusColor(selectedConv?.participant.status || 'offline')}`}>
                                  {selectedConv?.participant.status === 'online' ? 'Online' :
                                   selectedConv?.participant.status === 'away' ? 'Away' : 'Offline'}
                                </span>
                                {selectedConv?.participant.lastSeen && (
                                  <span className="text-sm text-gray-500">
                                    • Last seen {selectedConv.participant.lastSeen}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaPhone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaVideo className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEllipsisV className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => {
                      const isCurrentUser = message.senderId === 'current';
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                            <div className={`rounded-2xl p-4 ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <div className={`flex items-center justify-end mt-2 text-xs ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                <span>{message.timestamp}</span>
                                {isCurrentUser && (
                                  <span className="ml-2">
                                    {message.read ? (
                                      <FaCheckDouble className="h-3 w-3" />
                                    ) : (
                                      <FaCheck className="h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`flex-shrink-0 ${isCurrentUser ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={isCurrentUser ? currentUser.avatar : selectedConv?.participant.avatar}
                                alt={isCurrentUser ? currentUser.name : selectedConv?.participant.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaPaperclip className="h-5 w-5" />
                      </button>
                      <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaImage className="h-5 w-5" />
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message here..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaSmile className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        <FaPaperPlane className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <FaEnvelope className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Select a Conversation</h3>
                    <p className="text-gray-600 mb-8">
                      Choose a conversation from the sidebar to start messaging, or create a new message to begin a conversation.
                    </p>
                    <button
                      onClick={() => setShowNewChat(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Start New Conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">New Message</h3>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="relative mb-4">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedConversation(user.id);
                        setShowNewChat(false);
                      }}
                    >
                      <div className="relative mr-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{user.name}</h4>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <div className={`text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewChat(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Create new group logic
                    setShowNewChat(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Messages;
