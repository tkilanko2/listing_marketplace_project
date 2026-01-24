import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ChevronUp, ChevronDown, HelpCircle, 
  Rocket, Shield, CreditCard, Settings, ShieldCheck,
  Calendar, ShoppingBag, Star, MessageCircle,
  Store, FileText, Package, DollarSign, BarChart3, FileCheck,
  X, ArrowLeft, Sparkles
} from 'lucide-react';
import { FAQItem, FAQCategory } from '../types';
import { 
  faqCategories, 
  mockFAQs, 
  getCategoriesByTab, 
  getFAQsByCategory, 
  getFAQsBySubcategory,
  searchFAQs,
  getCategoryById
} from '../mockData';

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Shield,
  CreditCard,
  Settings,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Star,
  MessageCircle,
  Store,
  FileText,
  Package,
  DollarSign,
  BarChart3,
  FileCheck,
};

export interface HelpCenterPageProps {
  initialTab?: 'general' | 'seller';
  initialCategory?: string;
  initialSubcategory?: string;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export function HelpCenterPage({
  initialTab = 'general',
  initialCategory,
  initialSubcategory,
  onBack,
  onNavigate
}: HelpCenterPageProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'seller'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory || null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Get categories for current tab
  const categories = useMemo(() => {
    return getCategoriesByTab(activeTab);
  }, [activeTab]);

  // Get selected category object
  const selectedCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    return getCategoryById(selectedCategory) || categories.find(c => c.id === selectedCategory || c.name === selectedCategory) || null;
  }, [selectedCategory, categories]);

  // Get FAQs based on current state
  const displayedFAQs = useMemo(() => {
    if (searchQuery) {
      // Search across all tabs, not just the active one
      return searchFAQs(searchQuery);
    }
    if (selectedCategoryObj && selectedSubcategory) {
      return getFAQsBySubcategory(selectedCategoryObj.name, selectedSubcategory, activeTab);
    }
    if (selectedCategoryObj) {
      return getFAQsByCategory(selectedCategoryObj.name, activeTab);
    }
    return [];
  }, [searchQuery, selectedCategoryObj, selectedSubcategory, activeTab]);

  // Handle tab change
  const handleTabChange = (tab: 'general' | 'seller') => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setExpandedFAQ(null);
  };

  // Handle category click
  const handleCategoryClick = (category: FAQCategory) => {
    setSelectedCategory(category.id);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setExpandedFAQ(null);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedCategory) {
      setSelectedSubcategory(subcategory);
      setSearchQuery('');
      setExpandedFAQ(null);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else if (onBack) {
      onBack();
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setExpandedFAQ(null);
  };

  // Toggle FAQ expansion
  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className="w-6 h-6" />;
  };

  // Render category cards grid
  const renderCategoryGrid = () => {
    if (categories.length === 0) {
      return (
        <div className="text-center py-16">
          <HelpCircle className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
          <p className="text-[#70727F] text-lg">No categories available for this tab.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || HelpCircle;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white border-2 border-[#E8E9ED] rounded-xl p-6 hover:border-[#3D1560] hover:shadow-lg transition-all duration-200 text-left group transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#EDD9FF] to-[#D0B0EE] flex items-center justify-center text-[#3D1560] group-hover:from-[#3D1560] group-hover:to-[#6D26AB] group-hover:text-white transition-all duration-200 shadow-sm">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#1B1C20] mb-2 group-hover:text-[#3D1560] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#70727F] mb-3 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#3D1560] bg-[#EDD9FF] px-2.5 py-1 rounded-full">
                      {category.faqCount} {category.faqCount === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Render subcategories grid
  const renderSubcategories = () => {
    if (!selectedCategoryObj || !selectedCategoryObj.hasSubcategories || !selectedCategoryObj.subcategories) {
      return null;
    }

    return (
      <div>
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to categories</span>
          </button>
          <h2 className="text-3xl font-bold text-[#1B1C20] mb-3">{selectedCategoryObj.name}</h2>
          <p className="text-[#70727F] text-base leading-relaxed">{selectedCategoryObj.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedCategoryObj.subcategories.map((subcategory) => {
            const subcategoryFAQs = getFAQsBySubcategory(selectedCategoryObj.name, subcategory, activeTab);
            return (
              <button
                key={subcategory}
                onClick={() => handleSubcategoryClick(subcategory)}
                className="bg-white border-2 border-[#E8E9ED] rounded-xl p-6 hover:border-[#3D1560] hover:shadow-lg transition-all duration-200 text-left group transform hover:-translate-y-1"
              >
                <h3 className="text-base font-bold text-[#1B1C20] mb-3 group-hover:text-[#3D1560] transition-colors">
                  {subcategory}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#3D1560] bg-[#EDD9FF] px-2.5 py-1 rounded-full">
                    {subcategoryFAQs.length} {subcategoryFAQs.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render FAQ list
  const renderFAQList = () => {
    if (displayedFAQs.length === 0) {
      return (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-[#CDCED8] mx-auto mb-4" />
          <p className="text-[#70727F] text-lg mb-2">No articles found</p>
          <p className="text-[#CDCED8] text-sm">
            {searchQuery ? 'Try a different search term' : 'No FAQs available in this category'}
          </p>
        </div>
      );
    }

    return (
      <div>
        {(selectedCategory || searchQuery) && (
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">
                {searchQuery ? 'Back to categories' : selectedSubcategory ? 'Back to subcategories' : 'Back to categories'}
              </span>
            </button>
            {selectedCategoryObj && !searchQuery && (
              <>
                <h2 className="text-3xl font-bold text-[#1B1C20] mb-3">
                  {selectedSubcategory ? `${selectedCategoryObj.name} - ${selectedSubcategory}` : selectedCategoryObj.name}
                </h2>
                <p className="text-[#70727F] text-base leading-relaxed">{selectedCategoryObj.description}</p>
              </>
            )}
            {searchQuery && (
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#3D1560]" />
                <h2 className="text-3xl font-bold text-[#1B1C20]">
                  Search results for "{searchQuery}"
                </h2>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {displayedFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border-2 border-[#E8E9ED] rounded-xl overflow-hidden hover:border-[#3D1560] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F8F8FA] transition-colors group"
              >
                <div className="flex-1 pr-4 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-base font-semibold text-[#1B1C20] group-hover:text-[#3D1560] transition-colors">
                      {faq.question}
                    </span>
                    {searchQuery && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        faq.tab === 'general' 
                          ? 'bg-[#EDD9FF] text-[#3D1560]' 
                          : 'bg-[#FFF3E0] text-[#F57C00]'
                      }`}>
                        {faq.tab.charAt(0).toUpperCase() + faq.tab.slice(1)}
                      </span>
                    )}
                  </div>
                  {searchQuery && (
                    <p className="text-xs text-[#70727F] truncate">
                      {faq.category}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-[#3D1560]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
                  )}
                </div>
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 py-5 border-t-2 border-[#E8E9ED] bg-gradient-to-b from-[#F8F8FA] to-white">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-[#383A47] leading-relaxed whitespace-pre-line mb-4 text-[15px]">
                      {faq.answer}
                    </p>
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E8E9ED]">
                        {faq.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#EDD9FF] text-[#3D1560] text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Determine what to render
  const renderContent = () => {
    if (searchQuery || selectedCategory) {
      // Show FAQs (either from search or category/subcategory)
      return renderFAQList();
    } else {
      // Show category grid or subcategories
      if (selectedCategoryObj && selectedCategoryObj.hasSubcategories) {
        return renderSubcategories();
      } else {
        return renderCategoryGrid();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F8FA] to-[#E8E9ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          {onBack && !selectedCategory && !searchQuery && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3D1560] to-[#6D26AB] flex items-center justify-center shadow-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1B1C20] mb-1">Help Center</h1>
              <p className="text-[#70727F] text-base">Find answers to common questions and get the support you need</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
              <Search className="w-4 h-4 text-[#70727F]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-11 pr-10 py-3 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]/20 focus:border-[#3D1560] bg-white text-[#383A47] text-sm placeholder:text-[#CDCED8] transition-all shadow-sm hover:shadow-md focus:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#70727F] hover:text-[#383A47] transition-colors p-1 rounded-md hover:bg-[#F8F8FA]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex gap-2 border-b-2 border-[#E8E9ED]">
            {(['general', 'seller'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-8 py-4 font-semibold text-sm transition-all relative ${
                  activeTab === tab
                    ? 'text-[#3D1560]'
                    : 'text-[#70727F] hover:text-[#383A47]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D1560] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
