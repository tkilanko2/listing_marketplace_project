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
  MessageCircle
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

interface ProductDetailsPageProps {
  product: Product;
  onBuyNow: () => void;
  onBack: () => void;
  onProviderSelect: (provider: ServiceProvider) => void;
  onListingSelect: (listing: ListingItem) => void;
}

export function ProductDetailsPage({ product, onBuyNow, onBack, onProviderSelect, onListingSelect }: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishListed, setIsWishListed] = useState(false);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Navigation and Breadcrumb */}
      <FadeInOnScroll>
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Back to listings</span>
          </button>
          <div className="text-sm text-gray-500">
            Home / {product.category} / {product.name}
          </div>
        </div>
      </FadeInOnScroll>

      {/* Product Title and Stats */}
      <FadeInOnScroll delay={0.2}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{provider.rating} ({provider.reviews.length} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Package2 className="w-4 h-4 text-gray-400 mr-1" />
                <span>{product.condition}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                <span>{product.location.city}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{product.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bookmark className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{product.saves} saves</span>
            </div>
          </div>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery and Details */}
        <div className="lg:col-span-2">
          {/* Product Gallery */}
          <ParallaxSection offset={20}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <ServiceGallery images={product.images} />
            </div>
          </ParallaxSection>

          {/* Overview Section */}
          <div className="space-y-8">
            {/* Short Description */}
            <FadeInOnScroll>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-800 font-medium leading-relaxed">{product.shortDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Detailed Description */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">About this product</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.longDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Product Features */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.brand && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Package2 className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">Brand</p>
                        <p className="text-gray-600">{product.brand}</p>
                      </div>
                    </div>
                  )}
                  {product.condition && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <RotateCcw className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">Condition</p>
                        <p className="text-gray-600">{product.condition}</p>
                      </div>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Shield className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">Warranty</p>
                        <p className="text-gray-600">{product.warranty}</p>
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
                  <h2 className="text-2xl font-semibold mb-6">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-900 mb-1">{key}</p>
                        <p className="text-gray-600">{value}</p>
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
                  <h2 className="text-2xl font-semibold mb-6">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 ml-4">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            )}

            {/* Reviews Section */}
            <FadeInOnScroll>
              <div className="mt-16 lg:mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
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
              {/* Price and Purchase Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-gray-500 ml-2">
                      {product.availableQuantity > 0 ? `${product.availableQuantity} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.availableQuantity}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center border rounded-md p-2"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.availableQuantity}
                      className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={onBuyNow}
                  disabled={product.availableQuantity === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>Buy Now</span>
                </button>

                {/* Product Info */}
                <div className="mt-4 space-y-4">
                  {/* Shipping Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>Free Shipping</span>
                    </div>
                  </div>

                  {/* Additional Product Details */}
                  <div className="space-y-3">
                    {product.sku && (
                      <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="font-medium">
                          {`${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth} ${product.dimensions.unit}`}
                        </span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-medium">{`${product.weight.value} ${product.weight.unit}`}</span>
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Available Colors:</span>
                        <span className="font-medium">{product.colors.join(', ')}</span>
                      </div>
                    )}
                    {product.material && product.material.length > 0 && (
                      <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Materials:</span>
                        <span className="font-medium">{product.material.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
                <HeartAnimation
                  isActive={isWishListed}
                  onClick={() => setIsWishListed(!isWishListed)}
                  className="p-3 rounded-lg border border-gray-300"
                />
                <button className="p-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-6 h-6" />
                </button>
                <button className="p-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Trust Elements */}
              <TrustElements
                monthlyPurchases={trustData.monthlyPurchases}
                responseRate={trustData.responseRate}
                responseTime={trustData.responseTime}
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