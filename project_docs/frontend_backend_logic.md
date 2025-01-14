# Frontend-Backend Logic Documentation

## UI Component Implementation Cross-Reference

### Navigation Components
- **Source Files**:
  - `src/pages/LandingPage.tsx`: Main navigation implementation
  - `src/components/CountrySelector.tsx`: Location selection
  - `src/components/LanguageSelector.tsx`: Language switching
  - `src/components/ProfileIcon.tsx`: User profile menu

### Location Selection Logic
- **Implementation Location**: `src/components/CountrySelector.tsx`
- **State Management**: Uses React useState for local state
- **Default Behavior**:
  ```typescript
  const [selectedCountry, setSelectedCountry] = useState('Global');
  ```
- **City Selection Logic**:
  ```typescript
  const handleAddCity = (city: string) => {
    if (selectedCities.length < 5) {
      setSelectedCities([...selectedCities, city]);
      setCityInput('');
    }
  };
  ```

### Icon Behaviors
- **Profile Icon**:
  - Implementation: `src/components/ProfileIcon.tsx`
  - State Management: Combines local state with authentication context
  - Hover Effects: Uses Tailwind classes for transitions
  ```typescript
  className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-50"
  ```

- **Language Icon**:
  - Implementation: `src/components/LanguageSelector.tsx`
  - Translation Management: Uses translation context
  - State: Manages language selection through global state

- **Listing Card Icons**:
  - Implementation: `src/components/ListingCard.tsx`
  - View Count:
    ```typescript
    <button className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2.5 py-1.5">
      <Eye className="w-3.5 h-3.5 text-white" />
      <span>{views}</span>
    </button>
    ```
  - Type Indicator:
    ```typescript
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-1.5">
      {type === 'product' ? <Package2 /> : <Wrench />}
    </div>
    ```
  - Rating Display:
    ```typescript
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))}
    ```

## State Management Cross-Reference

### Location State
- **Implementation**: Uses combination of local and global state
- **Persistence**: Local storage for recent searches
- **Updates**: Real-time updates through WebSocket connection
```typescript
interface LocationState {
  selectedCities: string[];
  recentSearches: string[];
  defaultLocation: string;
}
```

### UI State Management
- **Implementation**: Mix of React hooks and context
- **Performance Optimization**: Memoization for expensive computations
- **Event Handling**: Debounced event handlers for search inputs

## API Integration Cross-Reference

### Location Services
```typescript
interface LocationService {
  searchCities: (query: string) => Promise<string[]>;
  getDefaultLocation: () => Promise<string>;
  updateUserLocation: (location: string) => Promise<void>;
}
```

### Icon Interaction APIs
```typescript
interface IconInteractionAPI {
  trackView: (listingId: string) => Promise<void>;
  toggleBookmark: (listingId: string) => Promise<void>;
  updateRating: (listingId: string, rating: number) => Promise<void>;
}
```

## Component Lifecycle Cross-Reference

### Mounting Behavior
- Location detection on initial load
- Language preference detection
- Icon state initialization

### Update Behavior
- Real-time view count updates
- Dynamic rating updates
- Location suggestion updates

### Cleanup Behavior
- WebSocket connection cleanup
- Event listener cleanup
- Cache invalidation

## Error Handling Cross-Reference

### Location Errors
```typescript
const handleLocationError = (error: LocationError) => {
  switch (error.type) {
    case 'PERMISSION_DENIED':
      setDefaultLocation('Global');
      break;
    case 'POSITION_UNAVAILABLE':
      useStoredLocation();
      break;
    default:
      logError(error);
  }
};
```

### Icon Interaction Errors
```typescript
const handleIconError = (error: IconError) => {
  // Error handling implementation
  console.error('Icon interaction failed:', error);
  // Fallback behavior
};
```

## Performance Optimization Cross-Reference

### Location Selection
- Debounced search
- Cached recent locations
- Preloaded popular cities

### Icon Rendering
- Lazy loading for images
- SVG optimization
- Conditional rendering for complex states
``` 