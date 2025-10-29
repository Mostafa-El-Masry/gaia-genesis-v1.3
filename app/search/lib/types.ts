export type Category =
  | 'all' | 'apollo' | 'gallery' | 'labs' | 'health'
  | 'wealth' | 'timeline' | 'settings' | 'intro' | 'other';

export interface SearchItem {
  id: string;
  key: string;
  cat: Category;
  title: string;
  text: string;
  snippet?: string;
  route?: string;
  anchor?: string;
  date?: string;
  tags?: string[];
}

export interface SearchIndex { v: number; createdAt: string; items: SearchItem[]; }
export interface SearchPrefs { lastQuery: string; lastCat: Category; }
