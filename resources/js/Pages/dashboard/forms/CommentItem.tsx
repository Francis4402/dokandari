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

    // Check for profile_photo_path
    if (comment.user.profile_photo_path) {
      return `/storage/${comment.user.profile_photo_path}`;
    }

    // Check for avatar
    if (comment.user.avatar) {
      // Check if it's a full URL or just a path
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

  return (
    <div className={`flex space-x-4 comment-enter ${className}`}>
      <div className="flex-shrink-0">
        {comment.user ? (
          <>
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {userInitials}
              </div>
            )}
          </>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="font-semibold text-gray-900">
              {userName}
            </span>
            {userEmail && (
              <span className="text-xs text-gray-400">
                ({userEmail})
              </span>
            )}
            <span className="text-sm text-gray-500 flex items-center">
              <FaClock className="w-3 h-3 mr-1" />
              {formatDate(comment.created_at)}
            </span>
            {comment.created_at !== comment.updated_at && (
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                edited
              </span>
            )}
          </div>

          {/* Comment Actions */}
          {isOwnComment && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Edit comment"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={1000}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting || !editText.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {comment.comment}
          </p>
        )}
      </div>
    </div>
  );
}
