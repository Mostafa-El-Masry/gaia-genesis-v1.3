export type ItemType = "image" | "video";
export interface GalleryItem {
  id: string;
  type: ItemType;
  src: string;
  preview?: string[];
  w?: number;
  h?: number;
  duration?: number;
  addedAt: string;
}
