export type MediaType = 'image' | 'video';

export interface ManifestItem {
  id: string;            // stable key, e.g. filename without ext
  type: MediaType;
  src: string;           // /media/images/foo.jpg or /media/videos/foo.mp4
  thumb?: string;        // thumbnail for video or smaller image
  addedAt: string;       // ISO date
  views?: number;
  tags?: string[];
  w?: number;
  h?: number;
  duration?: number;     // seconds (video)
  title?: string;        // optional display name from overlay
}

export interface GalleryManifestV1 {
  schema: 'gallery_manifest_v1';
  createdAt: string;
  items: ManifestItem[];
}
