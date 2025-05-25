import React, { useState, useEffect } from 'react';
import { Product, ServiceProvider, ListingItem } from '../types';
import { 
  ArrowLeft, 
  Star, 
  User, 
  Package2,
  Eye,
  Bookmark,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  CheckCircle,
  Heart,
  Share2,
  Mail
} from 'lucide-react';
import { ServiceGallery } from '../components/ServiceGallery';
import { ProviderProfile } from '../components/ProviderProfile';
import { mockProducts } from '../mockData';
import { TrustElements } from '../components/TrustElements';
import { EnhancedReviews } from '../components/EnhancedReviews';
import { DetailedReview } from '../types/Review';
import { FadeInOnScroll } from '../components/animations/FadeInOnScroll';
import { ParallaxSection } from '../components/animations/ParallaxSection';
import { HeartAnimation } from '../components/animations/HeartAnimation';
import { ProductCardSkeleton, ReviewSkeleton } from '../components/loading/SkeletonLoader';
import { useCart } from '../context/CartContext';

interface ProductDetailsPageProps {
  product: Product;
  onBuyNow: () => void;
  onBack: () => void;
  onProviderSelect: (provider: ServiceProvider) => void;
  onListingSelect: (listing: ListingItem) => void;
  onNavigateTo?: (page: string) => void;
  isItemSaved: boolean;
  toggleSaveItem: () => void;
}

export function ProductDetailsPage({ 
  product, 
  onBuyNow, 
  onBack, 
  onProviderSelect, 
  onListingSelect,
  onNavigateTo,
  isItemSaved,
  toggleSaveItem
}: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [provider, setProvider] = useState(product.provider);
  const [reviews, setReviews] = useState<DetailedReview[]>([
    {
      id: '1',
      author: 'John D.',
      rating: 5,
      date: new Date('2023-03-15'),
      title: 'Exceptional Quality and Craftsmanship',
      content: 'The attention to detail is remarkable. The leather is butter-soft and the stitching is impeccable. I particularly appreciate the thoughtful design of the interior compartments. This bag is perfect for both professional settings and casual outings.',
      isVerified: true,
      helpfulCount: 24,
      notHelpfulCount: 2,
      images: ['/images/review1.jpg', '/images/review2.jpg'],
      userVote: 'helpful',
    },
    {
      id: '2',
      author: 'Sarah M.',
      rating: 4,
      date: new Date('2023-03-10'),
      content: 'Beautiful bag with great functionality. The only minor issue is that the shoulder strap could be a bit more comfortable for extended wear.',
      isVerified: true,
      helpfulCount: 15,
      notHelpfulCount: 1,
      images: ['/images/review3.jpg'],
    },
    {
      id: '3',
      author: 'Michael R.',
      rating: 5,
      date: new Date('2023-03-05'),
      title: 'Worth Every Penny',
      content: 'This is my second purchase from this brand, and they never disappoint. The quality is consistent, and the customer service is excellent.',
      isVerified: true,
      helpfulCount: 18,
      notHelpfulCount: 0,
    },
  ]);

  const otherProducts = mockProducts.filter(p => 
    p.provider.id === provider.id && p.id !== product.id
  );

  const [isLoading, setIsLoading] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<{visible: boolean, message: string}>({
    visible: false,
    message: ''
  });

  useEffect(() => {
    if (!product || !product.provider) {
      return;
    }

    try {
      setProvider(product.provider);
    } catch (error) {
      console.error('Error setting provider:', error);
    }
  }, [product]);

  // Update provider rating when reviews change
  useEffect(() => {
    const total = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / total;
    setProvider(prev => ({
      ...prev,
      rating: Number(averageRating.toFixed(1)),
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.content,
        createdAt: review.date,
        customerName: review.author
      }))
    }));
  }, [reviews]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.availableQuantity) {
      setQuantity(value);
    }
  };

  const trustData = {
    monthlyPurchases: 87,
    responseRate: 98,
    responseTime: 'Within 2 hours',
    verifiedBusiness: true,
  };

  const handleReviewVote = (reviewId: string, isHelpful: boolean) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const previousVote = review.userVote;
        const newVote = isHelpful ? 'helpful' as const : 'not-helpful' as const;
        
        let helpfulCount = review.helpfulCount;
        let notHelpfulCount = review.notHelpfulCount;
        
        if (previousVote === 'helpful') {
          helpfulCount--;
        } else if (previousVote === 'not-helpful') {
          notHelpfulCount--;
        }
        
        if (newVote === 'helpful') {
          helpfulCount++;
        } else {
          notHelpfulCount++;
        }

        return {
          ...review,
          helpfulCount,
          notHelpfulCount,
          userVote: previousVote === newVote ? undefined : newVote,
        };
      }
      return review;
    }));
  };

  const handleAddToCart = () => {
    console.log('Add to Cart clicked', product, quantity);
    addToCart(product, quantity);
    
    // Show feedback message
    setCartFeedback({
      visible: true,
      message: `${quantity} item${quantity > 1 ? 's' : ''} added to cart`
    });
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      setCartFeedback({
        visible: false,
        message: ''
      });
    }, 2000);
  };

  const navigateToCart = () => {
    if (onNavigateTo) {
      onNavigateTo('cart');
    } else {
      // Fallback if onNavigateTo is not provided
      window.location.href = '/cart';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      {/* Feedback Toast */}
      {cartFeedback.visible && (
        <div className="fixed top-16 right-5 bg-[#3D1560] bg-opacity-80 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-xs md:max-w-md">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{cartFeedback.message}</span>
          </div>
          <button 
            onClick={navigateToCart}
            className="ml-4 text-white underline hover:text-[#EDD9FF] text-sm"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Navigation and Breadcrumb */}
      <FadeInOnScroll>
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-[#70727F] hover:text-[#383A47] mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Back to listings</span>
          </button>
          <div className="text-sm text-[#70727F]">
            Home / {product.category} / {product.name}
          </div>
        </div>
      </FadeInOnScroll>

      {/* Product Title and Stats */}
      <FadeInOnScroll delay={0.2}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1">
            <div className="mb-4">
              <span className="text-[#3D1560] text-sm font-medium tracking-wider uppercase">{product.category}</span>
              <h1 className="text-4xl font-bold text-[#1B1C20] leading-tight mt-1">
                {product.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#70727F]">
              <div className="flex items-center bg-[#E8E9ED] px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-[#3D1560] mr-1" />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-[#70727F] ml-1">({provider.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center">
                <Package2 className="w-4 h-4 text-[#70727F] mr-1" />
                <span>{product.availableQuantity} available</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-[#70727F] mr-1" />
                <span>{product.views} views</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-4 md:mt-0">
            <button 
              onClick={toggleSaveItem}
              className={`p-2 rounded-full border border-[#CDCED8] text-[#383A47] hover:bg-[#EDD9FF] hover:text-[#6D26AB] transition-colors duration-200 ${isItemSaved ? 'bg-[#FFE5ED]' : ''}`}
              title={isItemSaved ? "Unsave item" : "Save item"}
            >
              {isItemSaved ? (
                <HeartAnimation isActive={true} onClick={toggleSaveItem} />
              ) : (
                <Heart className="w-5 h-5 text-[#383A47]" />
              )}
            </button>
            <button className="p-2 rounded-full border border-[#CDCED8] text-[#383A47] hover:bg-[#EDD9FF] hover:text-[#6D26AB] transition-colors duration-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery and Details */}
        <div className="lg:col-span-2">
          {/* Product Gallery */}
          <ParallaxSection offset={20}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-[#CDCED8]">
              <ServiceGallery 
                images={product.images} 
                responseTime={product.provider.responseTime || "Within 2h"}
                responseRate={product.provider.responseRate || "98%"}
              />
            </div>
          </ParallaxSection>

          {/* Overview Section */}
          <div className="space-y-8">
            {/* Short Description */}
            <FadeInOnScroll>
              <div className="bg-gradient-to-r from-[#EDD9FF] to-[#E8E9ED] p-6 rounded-xl border border-[#CDCED8]">
                <p className="text-[#383A47] font-medium leading-relaxed">{product.shortDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Detailed Description */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">About this product</h2>
                <p className="text-[#383A47] leading-relaxed whitespace-pre-line">{product.longDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Product Features */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.brand && (
                    <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                      <Package2 className="w-8 h-8 text-[#3D1560]" />
                      <div className="ml-4">
                        <p className="font-semibold text-[#383A47]">Brand</p>
                        <p className="text-[#70727F]">{product.brand}</p>
                      </div>
                    </div>
                  )}
                  {product.condition && (
                    <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                      <RotateCcw className="w-8 h-8 text-[#3D1560]" />
                      <div className="ml-4">
                        <p className="font-semibold text-[#383A47]">Condition</p>
                        <p className="text-[#70727F]">{product.condition}</p>
                      </div>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                      <Shield className="w-8 h-8 text-[#3D1560]" />
                      <div className="ml-4">
                        <p className="font-semibold text-[#383A47]">Warranty</p>
                        <p className="text-[#70727F]">{product.warranty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeInOnScroll>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <FadeInOnScroll>
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="p-4 bg-[#E8E9ED] rounded-lg">
                        <p className="font-semibold text-[#383A47] mb-1">{key}</p>
                        <p className="text-[#70727F]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <FadeInOnScroll>
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start p-4 bg-[#E8E9ED] rounded-lg">
                        <CheckCircle className="w-6 h-6 text-[#3D1560] flex-shrink-0 mt-0.5" />
                        <p className="text-[#70727F] ml-4">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            )}

            {/* Reviews Section */}
            <FadeInOnScroll>
              <div className="mt-16 lg:mt-24">
                <h2 className="text-2xl font-bold text-[#1B1C20] mb-8">Customer Reviews</h2>
                <EnhancedReviews
                  reviews={reviews}
                  onVoteHelpful={handleReviewVote}
                />
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Right Column - Provider Profile and Purchase */}
        <div className="lg:col-span-1">
          <FadeInOnScroll delay={0.4}>
            <div className="bg-white p-6 rounded-xl shadow-sm lg:sticky lg:top-6">
              {/* Purchase Controls */}
              <div className="bg-[#E8E9ED] rounded-xl p-6 mt-8 border border-[#CDCED8]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#1B1C20]">Price:</span>
                      <span className="text-3xl font-bold text-[#3D1560]">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#70727F]">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#70727F]">
                      <RotateCcw className="w-4 h-4" />
                      <span>30-day return policy</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#70727F]">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#CDCED8] rounded-lg overflow-hidden bg-[#F8F8FA] shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-[#383A47] hover:bg-[#E8E9ED] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-[#383A47] font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.availableQuantity}
                        className="px-3 py-2 text-[#383A47] hover:bg-[#E8E9ED] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-[#70727F]">{product.availableQuantity} in stock</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={onBuyNow}
                      className="bg-[#3D1560] text-[#FFFFFF] px-6 py-3 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Buy Now
                    </button>
                    <div className="relative group inline-block">
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center gap-2 bg-[#F8F8FA] text-[#383A47] border border-[#CDCED8] px-6 py-3 rounded-lg font-medium hover:bg-[#E8E9ED] transition-colors duration-200 shadow-sm w-full"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-[#1B1C20] text-[#FFFFFF] text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center pointer-events-none">
                        Add to Cart
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-2 border-t border-[#CDCED8]">
                    <button
                      onClick={() => toggleSaveItem()}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${
                        isItemSaved ? 'bg-[#EDD9FF] text-[#3D1560]' : 'bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8]'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isItemSaved ? 'fill-[#3D1560] text-[#3D1560]' : ''}`} />
                      {isItemSaved ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8] transition-colors duration-200 shadow-sm">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Elements */}
              <TrustElements
                monthlyPurchases={trustData.monthlyPurchases}
                verifiedBusiness={trustData.verifiedBusiness}
                onReport={() => {
                  // Handle report action
                  console.log('Report listing');
                }}
              />

              {/* Provider Profile */}
              <ProviderProfile 
                provider={provider}
                otherListings={otherProducts}
                onProviderSelect={onProviderSelect}
                onListingSelect={onListingSelect}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
} 