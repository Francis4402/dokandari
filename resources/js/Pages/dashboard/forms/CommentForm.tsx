
import { useState } from "react";
import { FaUser, FaStar, FaRegStar } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  images?: string;
}

interface CommentFormProps {
  productId: string;
  authUser: User | null;
  isAuthenticated: boolean;
  existingReview?: {
    id: string;
    comment?: string | null;
    rating?: number | null;
  } | null;
  onSuccess?: () => void;
  className?: string;
}

export default function CommentForm({
  productId,
  authUser,
  isAuthenticated,
  existingReview,
  onSuccess,
  className = ""
}: CommentFormProps) {
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to review');
      return;
    }

    if (!comment.trim() && rating === 0) {
      toast.error('Please provide a comment or rating');
      return;
    }

    if (comment.length > 1000) {
      toast.error('Comment must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);

    router.post('/comments', {
      product_id: productId,
      comment: comment.trim() || null,
      rating: rating || null
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment('');
        setRating(0);
        toast.success(existingReview ? 'Review updated!' : 'Review added successfully!');
        if (onSuccess) {
          onSuccess();
        }
        router.reload({ only: ['comments', 'product'] });
      },
      onError: (errors) => {
        console.error('Review error:', errors);
        toast.error(errors.comment || 'Failed to submit review');
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className={`mb-8 p-4 bg-gray-50 rounded-lg text-center ${className}`}>
        <p className="text-gray-600">
          Please <a href="/login" className="text-blue-600 hover:underline">login</a> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`mb-8 ${className}`}>
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          {authUser?.images ? (
            <img
              src={authUser.images.startsWith('http') ? authUser.images : `/storage/${authUser.images}`}
              alt={authUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <FaUser className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Rating Stars */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating {existingReview ? '(optional)' : ''}
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className="w-6 h-6 text-yellow-400 fill-current" />
                  ) : (
                    <FaRegStar className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Comment Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review... (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={1000}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {comment.length}/1000
            </span>
            <button
              type="submit"
              disabled={isSubmitting || (!comment.trim() && rating === 0)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : existingReview ? 'Update Review' : 'Post Review'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
