export interface MentionedPost {
  id: string;
  caption?: string;
  images: {
    id: string;
    url: string;
  }[];
}