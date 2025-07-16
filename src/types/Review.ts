export interface Review {
  id: string;
  listingId: string; // To link review to a specific service
  listingTitle: string; // e.g., "Professional Hair Cutting"
  providerId: string;
  reviewerId: string;
  reviewerName: string; // Will be a username like "HappyBuyer23", not a full name
  reviewerAvatar: string; // URL
  reviewTitle: string; // Review title from the form
  comment: string;
  rating: number; // Overall score
  criterias: { name: string; rating: number; }[]; // e.g., [{ name: 'Communication', rating: 5 }]
  date: string;
  helpfulCount: number;
  notHelpfulCount: number;
  images: string[]; // Array of placeholder image URLs
  userVote?: 'helpful' | 'not-helpful'; // For tracking user interactions
} 