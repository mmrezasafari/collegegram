export interface SavedPost {
  id: string;
  caption?: string;
  images: {
    id: string;
    url: string;
  }[];
}