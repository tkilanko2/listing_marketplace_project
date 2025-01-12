export interface DetailedReview {
  id: string;
  author: string;
  rating: number;
  date: Date;
  title?: string;
  content: string;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  images?: string[];
  userVote?: 'helpful' | 'not-helpful';
} 