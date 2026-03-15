// resources/js/Pages/dashboard/messages/index.tsx

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import {
  FaSearch,
  FaStar,
  FaEnvelope,
  FaTimes,
  FaReply,
  FaTrash,
  FaEye,
  FaCheckDouble,
  FaArrowLeft,
  FaInbox,
  FaEnvelopeOpen
} from 'react-icons/fa';
import { PageProps } from '@/types';

// Contact interface matching your database schema
interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// Pagination links interface
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Props interface matching your controller return
interface Props extends PageProps {
  contacts: {
    data: Contact[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: PaginationLink[];
  };
  unreadCount: number;
  filters: {
    filter?: string;
    search?: string;
  };
}

type MessageTab = 'inbox' | 'unread' | 'starred';

const Messages = ({ auth, contacts: initialContacts, unreadCount: initialUnreadCount, filters }: Props) => {
  // Initialize state with safe defaults
  const [activeTab, setActiveTab] = useState<MessageTab>(() => {
    return (filters?.filter === 'unread' || filters?.filter === 'starred')
      ? filters.filter as MessageTab
      : 'inbox';
  });

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [replyingTo, setReplyingTo] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Ensure contacts is always an array
  const [contacts, setContacts] = useState<Contact[]>(
    Array.isArray(initialContacts?.data) ? initialContacts.data : []
  );

  const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);

  // Update contacts when props change
  useEffect(() => {
    if (initialContacts?.data && Array.isArray(initialContacts.data)) {
      setContacts(initialContacts.data);
    }
  }, [initialContacts]);

  // Update unread count when contacts change
  useEffect(() => {
    if (Array.isArray(contacts)) {
      const count = contacts.filter(c => !c.is_read).length;
      setUnreadCount(count);
    }
  }, [contacts]);

  // Filter contacts based on active tab and search
  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return [];
    }

    return contacts.filter(contact => {
      // Apply tab filter
      if (activeTab === 'unread' && contact.is_read) return false;
      if (activeTab === 'starred' && !contact.is_starred) return false;

      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        return (
          (contact.name?.toLowerCase() || '').includes(searchLower) ||
          (contact.email?.toLowerCase() || '').includes(searchLower) ||
          (contact.subject?.toLowerCase() || '').includes(searchLower) ||
          (contact.message?.toLowerCase() || '').includes(searchLower)
        );
      }

      return true;
    });
  }, [contacts, activeTab, searchTerm]);

  const handleTabChange = (tab: MessageTab) => {
    setActiveTab(tab);
    setSelectedContact(null);
    setShowMobileList(true);

    router.get(route('dashboard.messages'), {
      filter: tab === 'inbox' ? undefined : tab,
      search: searchTerm || undefined
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.get(route('dashboard.messages'), {
      filter: activeTab === 'inbox' ? undefined : activeTab,
      search: searchTerm || undefined
    }, {
      preserveState: true,
      replace: true,
      preserveScroll: true
    });
  };

  const toggleStar = (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    router.post(route('contacts.toggle-star', contactId), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setContacts(prev =>
          prev.map(c =>
            c.id === contactId
              ? { ...c, is_starred: !c.is_starred }
              : c
          )
        );
        if (selectedContact?.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, is_starred: !prev.is_starred } : null);
        }
      },
      onError: (errors) => {
        console.error('Error toggling star:', errors);
      }
    });
  };

  const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setShowMobileList(false);

        if (!contact.is_read) {
            setIsUpdating(true);

            router.post(route('contacts.mark-single-read', contact.id), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const readAt = new Date().toISOString();
                setContacts(prev =>
                prev.map(c =>
                    c.id === contact.id
                    ? { ...c, is_read: true, read_at: readAt }
                    : c
                )
                );
                setSelectedContact(prev =>
                prev ? { ...prev, is_read: true, read_at: readAt } : null
                );
            },
            onFinish: () => setIsUpdating(false),
            });
        }
    };

  const handleReply = (contact: Contact) => {
    setReplyingTo(contact);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const sendReply = () => {
    if (!replyMessage.trim() || !replyingTo) return;

    // In production, you would send this to your backend
    console.log('Reply to:', replyingTo.email, replyMessage);

    setShowReplyModal(false);
    setReplyingTo(null);
    setReplyMessage('');

    // Show success message
    alert(`Reply would be sent to ${replyingTo.email} in production`);
  };

  const deleteContact = (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      router.delete(route('contacts.destroy', contactId), {
        preserveScroll: true,
        onSuccess: () => {
          setContacts(prev => prev.filter(c => c.id !== contactId));
          if (selectedContact?.id === contactId) {
            setSelectedContact(null);
            setShowMobileList(true);
          }
        },
        onError: (errors) => {
          console.error('Error deleting contact:', errors);
        }
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&bold=true&size=128`;
  };

  const getTabIcon = (tab: MessageTab) => {
    switch(tab) {
      case 'inbox': return <FaInbox className="mr-1" />;
      case 'unread': return <FaEnvelope className="mr-1" />;
      case 'starred': return <FaStar className="mr-1" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Messages" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? (
                    <>You have <span className="font-semibold text-blue-600">{unreadCount} unread</span> messages</>
                  ) : (
                    'View and manage contact form submissions'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Contacts Sidebar */}
            <div className={`${showMobileList ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
              <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <form onSubmit={handleSearch}>
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
                  </form>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {(['inbox', 'unread', 'starred'] as MessageTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`flex-1 py-3 text-sm font-medium capitalize flex items-center justify-center ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center">
                        {getTabIcon(tab)}
                        {tab}
                      </span>
                      {tab === 'unread' && unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] relative">
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}

                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                      <FaEnvelope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">No messages found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm ? 'Try a different search term' : 'Your inbox is empty'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredContacts.map(contact => (
                        <div
                          key={contact.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                            selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                          } ${!contact.is_read ? 'bg-blue-50/30' : ''}`}
                          onClick={() => handleContactSelect(contact)}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100">
                                <img
                                  src={getAvatarUrl(contact.name)}
                                  alt={contact.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=3b82f6&color=fff&bold=true`;
                                  }}
                                />
                              </div>
                              {!contact.is_read && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white"></div>
                              )}
                            </div>

                            {/* Contact Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-800 truncate">
                                  {contact.name}
                                </h4>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <button
                                    onClick={(e) => toggleStar(contact.id, e)}
                                    className="hover:scale-110 transition-transform focus:outline-none"
                                    title={contact.is_starred ? "Unstar" : "Star"}
                                  >
                                    <FaStar
                                      className={`h-3 w-3 ${
                                        contact.is_starred
                                          ? 'text-yellow-500'
                                          : 'text-gray-300 hover:text-yellow-500'
                                      }`}
                                    />
                                  </button>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatDate(contact.created_at).split(',')[0]}
                                  </span>
                                </div>
                              </div>

                              <div className="mb-1">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate inline-block max-w-full">
                                  {contact.subject}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 truncate mb-1">
                                {contact.message.length > 60
                                  ? contact.message.substring(0, 60) + '...'
                                  : contact.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 truncate max-w-[150px]">
                                  {contact.email}
                                </span>
                                {!contact.is_read && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination Info */}
                {initialContacts?.total > 0 && (
                  <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
                    Showing {initialContacts.from || 0} - {initialContacts.to || 0} of {initialContacts.total} messages
                  </div>
                )}
              </div>
            </div>

            {/* Message Detail Area */}
            <div className={`${!showMobileList ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
              {selectedContact ? (
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                  {/* Message Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setShowMobileList(true)}
                          className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Back to list"
                        >
                          <FaArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100">
                            <img
                              src={getAvatarUrl(selectedContact.name)}
                              alt={selectedContact.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            {selectedContact.name}
                          </h2>
                          <p className="text-gray-600">{selectedContact.email}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Received: {formatDate(selectedContact.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReply(selectedContact)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaReply className="h-4 w-4 mr-2" />
                          Reply
                        </button>
                        <button
                          onClick={(e) => deleteContact(selectedContact.id, e)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-3xl mx-auto">
                      {/* Subject */}
                      <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</h3>
                        <p className="text-gray-900 text-lg font-medium">{selectedContact.subject}</p>
                      </div>

                      {/* Message */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Message</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {selectedContact.message}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center">
                            {selectedContact.is_read ? (
                              <>
                                <FaCheckDouble className="h-5 w-5 text-green-500 mr-2" />
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Read</span>
                                  {selectedContact.read_at && (
                                    <p className="text-xs text-gray-500">
                                      {formatDate(selectedContact.read_at)}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <FaEye className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Unread</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center">
                            {selectedContact.is_starred ? (
                              <>
                                <FaStar className="h-5 w-5 text-yellow-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Starred</span>
                              </>
                            ) : (
                              <>
                                <FaStar className="h-5 w-5 text-gray-300 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Not Starred</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg h-full flex flex-col items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <FaEnvelopeOpen className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Select a Message</h3>
                    <p className="text-gray-600">
                      Choose a message from the sidebar to view its details and reply to the customer.
                    </p>
                    {filteredContacts.length > 0 && (
                      <p className="text-sm text-gray-500 mt-4">
                        You have {filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''} in this view
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Reply to {replyingTo.name}</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Original Message:</span> {replyingTo.subject}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {replyingTo.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    From: {replyingTo.email} • Received: {formatDate(replyingTo.created_at)}
                  </p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply *
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your reply here..."
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={!replyMessage.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
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
