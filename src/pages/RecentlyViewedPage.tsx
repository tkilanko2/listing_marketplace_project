import React, { useMemo } from 'react';
import { ListingItem, Product, Service, ServiceProvider } from '../types'; // Ensure ServiceProvider is imported if used
import { ArrowLeft, Eye, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';

interface RecentlyViewedEntry {
  itemId: string;
  viewedAt: number; // Timestamp
}

// This will be the shape of items in our displayable list.
// It must be compatible with ListingItem and add viewedAt.
interface DisplayableRecentlyViewedItem extends ListingItem {
  viewedAt: number;
  // itemType is already part of ListingItem as 'type', we don't need a separate itemType here
}

interface RecentlyViewedPageProps {
  recentlyViewedEntries: RecentlyViewedEntry[];
  products: Product[];
  services: Service[];
  onListingSelect: (listing: ListingItem) => void;
  onBack: () => void;
}

const RecentlyViewedPage: React.FC<RecentlyViewedPageProps> = ({ 
  recentlyViewedEntries, 
  products, 
  services, 
  onListingSelect, 
  onBack 
}) => {

  const allMockItems = useMemo(() => [...products, ...services], [products, services]);

  const displayableItems = useMemo(() => {
    return recentlyViewedEntries
      .map(entry => {
        const item = allMockItems.find(i => i.id === entry.itemId);
        if (!item) return null;

        // Construct the displayable item, ensuring all ListingItem properties are present
        // and add viewedAt.
        const displayItem: DisplayableRecentlyViewedItem = {
          // Spread all properties from the original item (Product or Service)
          // which should conform to ListingItem
          ...(item as ListingItem), // Start by spreading the item as a ListingItem
          
          // Ensure critical ListingItem fields have fallbacks if they could be missing
          // from raw mock data, though ideally types enforce this upstream.
          id: item.id,
          name: item.name,
          type: item.type, // product or service
          images: item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/150'],
          price: item.price,
          category: item.category || 'N/A',
          shortDescription: item.shortDescription || (item as any).description || item.name,
          views: item.views || 0,
          saves: (item as any).saves || 0, // Assuming saves might exist on some items
          provider: item.provider as ServiceProvider, // Assuming provider is on ListingItem
          location: item.location, // Assuming location is on ListingItem
          status: item.status || 'active',
          createdAt: item.createdAt || new Date().toISOString(),
          
          // Add the recently viewed specific property
          viewedAt: entry.viewedAt,
        };
        return displayItem;
      })
      .filter((item): item is DisplayableRecentlyViewedItem => item !== null) // Type guard
      .sort((a, b) => b.viewedAt - a.viewedAt); // Sort by most recent first
  }, [recentlyViewedEntries, allMockItems]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-[#F8F8FA]">
      <button
        onClick={onBack}
        className="flex items-center text-[#70727F] hover:text-[#383A47] mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Profile
      </button>

      <h1 className="text-3xl font-bold text-[#1B1C20] mb-8">My Recently Viewed Items ({displayableItems.length})</h1>

      {displayableItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
          <p className="text-xl text-[#70727F]">You haven't viewed any items recently.</p>
          <p className="text-sm text-[#70727F] mt-2">Items you view will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayableItems.map((item) => (
            <div 
              key={item.id + '-' + item.viewedAt} 
              className="flex items-center gap-5 p-4 bg-white border border-[#E8E9ED] rounded-lg shadow-sm hover:border-[#3D1560] hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => onListingSelect(item)} // item is DisplayableRecentlyViewedItem, which extends ListingItem
            >
              <div className="relative w-28 h-28 flex-shrink-0">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-md" 
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#1B1C20] text-lg truncate group-hover:text-[#3D1560]">{item.name}</h3>
                    <p className="text-sm text-[#70727F] mt-1 line-clamp-2">
                      {item.shortDescription && item.shortDescription.length > 80 
                        ? `${item.shortDescription.substring(0, 80)}...` 
                        : item.shortDescription}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-[#3D1560]">${item.price}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2.5 text-sm text-[#70727F]">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{item.views} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Viewed: {new Date(item.viewedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-6 w-6 text-[#9B53D9] group-hover:text-[#3D1560] ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedPage; 