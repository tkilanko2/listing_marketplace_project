import React from 'react';
import { ListingItem, Product, Service } from '../types';
import { ArrowLeft, Eye, Calendar, Bookmark, ChevronRight, ShoppingBag } from 'lucide-react';

interface SavedItemsPageProps {
  savedItemIds: string[];
  products: Product[];
  services: Service[];
  onListingSelect: (listing: ListingItem) => void;
  toggleSaveItem: (itemId: string) => void;
  onBack: () => void;
}

const SavedItemsPage: React.FC<SavedItemsPageProps> = ({ 
  savedItemIds, 
  products, 
  services, 
  onListingSelect, 
  toggleSaveItem, 
  onBack 
}) => {

  const allItems = [...products, ...services];
  const savedItems = allItems.filter(item => savedItemIds.includes(item.id))
    .map(item => ({ // Ensure all items have a consistent structure for display
      ...item,
      dateSaved: (item as any).dateSaved || 'N/A', // Products have it, services might get it from App.tsx logic
      views: item.views || 0,
      shortDescription: item.shortDescription || item.name,
    }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-[#F8F8FA]">
      <button
        onClick={onBack}
        className="flex items-center text-[#70727F] hover:text-[#383A47] mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Profile
      </button>

      <h1 className="text-3xl font-bold text-[#1B1C20] mb-8">My Saved Items ({savedItems.length})</h1>

      {savedItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
          <p className="text-xl text-[#70727F]">You haven't saved any items yet.</p>
          <p className="text-sm text-[#70727F] mt-2">Browse items and click the heart icon to save them for later.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {savedItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-5 p-4 bg-white border border-[#E8E9ED] rounded-lg shadow-sm hover:border-[#3D1560] hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => onListingSelect(item as ListingItem)}
            >
              <div className="relative w-28 h-28 flex-shrink-0"> {/* Slightly larger image for this page */}
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
                      {item.shortDescription.length > 80 
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
                    <span>Saved: {item.dateSaved}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 flex-shrink-0 ml-auto pl-4 border-l border-[#E8E9ED]">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveItem(item.id);
                  }}
                  className="p-2 text-[#DF678C] hover:text-white rounded-full hover:bg-[#DF678C] transition-colors duration-200"
                  title="Unsave item"
                >
                  <Bookmark className="h-5 w-5" fill="currentColor"/>
                </button>
                <ChevronRight className="h-6 w-6 text-[#9B53D9] group-hover:text-[#3D1560]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItemsPage; 