import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { productsApi } from '../api/products';
import type { Product, Review } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';

// Removed mock reviews
export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProductAndReviews = async () => {
      try {
        const [data, reviewsData] = await Promise.all([
          productsApi.getProduct(id),
          productsApi.getReviews(id)
        ]);
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
          setSelectedImage(data.imageUrls[0]);
        }
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isAuthenticated) return;
    
    setSubmittingReview(true);
    setReviewMessage('');
    
    try {
      const newReview = await productsApi.addReview(id, { rating, comment });
      setReviews(prev => [newReview, ...prev]);
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      setReviewMessage('Review submitted successfully!');
      setTimeout(() => setReviewMessage(''), 3000);
    } catch (err) {
      setReviewMessage('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) return;
    
    setAdding(true);
    try {
      await addItem(product.id, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-accent-terracotta text-lg">{error || 'Product not found'}</p>
        <Button onClick={() => navigate('/products')}>Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-10"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-[#F5F5F5] dark:bg-[#221F1D] rounded-[32px] overflow-hidden flex items-center justify-center relative p-8">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-opacity duration-300"
              />
            ) : (
              <span className="text-muted text-lg">No image available</span>
            )}
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img ? 'border-foreground opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx}`} 
                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal bg-[#F5F5F5] dark:bg-[#221F1D]" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-muted font-medium mb-3 tracking-wider uppercase text-sm">{product.category}</p>
            <h1 className="text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-medium text-foreground">${product.price.toFixed(2)}</span>
              {product.stockQuantity < 10 && (
                <span className="text-accent-terracotta text-sm font-medium mb-1">Only {product.stockQuantity} left</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-8 text-sm">
              <div className="flex text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current opacity-40" />
              </div>
              <span className="font-medium text-foreground">4.6</span>
              <span className="text-muted">(128 Reviews)</span>
            </div>

            <p className="text-lg text-muted leading-relaxed mb-10">
              {product.description || "Experience uncompromising quality and performance. Carefully engineered for precision and durability in every detail."}
            </p>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg mb-8"
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
          >
            {adding ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-border-light dark:border-border-dark">
            <div className="flex flex-col gap-2">
              <Truck className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Free Shipping</span>
              <span className="text-xs text-muted">On orders over $50</span>
            </div>
            <div className="flex flex-col gap-2">
              <RotateCcw className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Free Returns</span>
              <span className="text-xs text-muted">Within 30 days</span>
            </div>
            <div className="flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Secure Checkout</span>
              <span className="text-xs text-muted">256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-16 border-t border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <h2 className="text-3xl font-serif text-foreground">Customer Reviews</h2>
          {isAuthenticated ? (
            <Button 
              variant={showReviewForm ? "outline" : "primary"} 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          ) : (
            <p className="text-sm text-muted">
              Please <button onClick={() => navigate('/login')} className="text-foreground underline">log in</button> to leave a review
            </p>
          )}
        </div>
        
        {reviewMessage && (
          <div className={`p-4 rounded-xl text-sm mb-8 ${reviewMessage.includes('success') ? 'bg-accent-sage/10 text-accent-sage border border-accent-sage/20' : 'bg-accent-terracotta/10 text-accent-terracotta border border-accent-terracotta/20'}`}>
            {reviewMessage}
          </div>
        )}

        {showReviewForm && isAuthenticated && (
          <div className="bg-black/5 dark:bg-white/5 p-8 rounded-3xl border border-border-light dark:border-border-dark mb-12 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-serif text-foreground mb-6">Leave your thoughts</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted/30'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  className="w-full rounded-2xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
              </div>
              
              <Button type="submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-12">
          {reviews.length === 0 ? (
            <p className="text-muted md:col-span-3 py-12 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-border-light dark:border-border-dark">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="flex flex-col space-y-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <h3 className="font-medium text-foreground">{review.firstName} {review.lastName}</h3>
                <p className="text-muted text-sm leading-relaxed flex-1">"{review.comment}"</p>
                <span className="text-xs text-muted/70">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
