// CommentItem.tsx
import { useState, useEffect } from "react";
import { FaUser, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile_photo_url?: string;
  profile_photo_path?: string;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user: User | null;
}

interface CommentItemProps {
  comment: Comment;
  authUser: User | null;
  onDelete?: () => void;
  className?: string;
}

export default function CommentItem({
  comment,
  authUser,
  onDelete,
  className = ""
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get user avatar URL
  const getUserAvatar = () => {
    if (!comment.user) return null;

    if (comment.user.profile_photo_url) {
      return comment.user.profile_photo_url;
    }

    if (comment.user.profile_photo_path) {
      return `/storage/${comment.user.profile_photo_path}`;
    }

    if (comment.user.avatar) {
      if (comment.user.avatar.startsWith('http')) {
        return comment.user.avatar;
      }
      return `/storage/${comment.user.avatar}`;
    }

    return null;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!comment.user?.name) return 'U';

    return comment.user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Generate consistent color for user
  const getUserColor = (userId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];

    const index = parseInt(userId) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return dateString;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.comment);
  };

  const handleUpdate = () => {
    if (!editText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (editText.length > 1000) {
      toast.error('Comment must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);

    router.put(`/comments/${comment.id}`, {
      comment: editText.trim()
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Comment updated successfully!');
        router.reload({ only: ['comments'] });
      },
      onError: (errors) => {
        console.error('Update error:', errors);
        toast.error(errors.comment || 'Failed to update comment');
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      router.delete(`/comments/${comment.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Comment deleted successfully!');
          if (onDelete) onDelete();
          router.reload({ only: ['comments'] });
        },
        onError: () => {
          toast.error('Failed to delete comment');
        }
      });
    }
  };

  // Check if this is the user's own comment
  const isOwnComment = authUser && comment.user && authUser.id === comment.user.id;

  // Get avatar URL
  const avatarUrl = !imageError ? getUserAvatar() : null;
  const userInitials = getUserInitials();
  const userName = comment.user?.name || 'Anonymous User';
  const userEmail = comment.user?.email;
  const userColor = comment.user ? getUserColor(comment.user.id) : 'from-gray-500 to-gray-600';

  return (
    <div className={`flex space-x-4 comment-enter ${className}`}>
      <div className="flex-shrink-0">
        {comment.user ? (
          <>
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-line shadow-hard-sm"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${userColor} flex items-center justify-center text-white font-semibold text-sm shadow-hard-sm`}>
                {userInitials}
              </div>
            )}
          </>
        ) : (
          <div className="w-10 h-10 rounded-full bg-paper-dim border border-line flex items-center justify-center">
            <FaUser className="w-5 h-5 text-text-soft" />
          </div>
        )}
      </div>

      <div className="flex-1 bg-paper-dim rounded-xl p-4 border border-line">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="font-semibold text-ink">
              {userName}
            </span>
            {userEmail && (
              <span className="text-xs text-text-soft">
                ({userEmail})
              </span>
            )}
            <span className="text-sm text-text-soft flex items-center">
              <FaClock className="w-3 h-3 mr-1" />
              {formatDate(comment.created_at)}
            </span>
            {comment.created_at !== comment.updated_at && (
              <span className="text-xs text-text-soft bg-paper-dim border border-line px-2 py-0.5 rounded-full">
                edited
              </span>
            )}
          </div>

          {/* Comment Actions */}
          {isOwnComment && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-1 text-text-soft hover:text-marigold transition-colors rounded-lg hover:bg-paper-dim"
                title="Edit comment"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-text-soft hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Delete comment"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft resize-none"
              rows={3}
              maxLength={1000}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting || !editText.trim()}
                className="px-4 py-2 bg-marigold hover:bg-marigold-dark text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-text-soft whitespace-pre-line leading-relaxed">
            {comment.comment}
          </p>
        )}
      </div>
    </div>
  );
}
