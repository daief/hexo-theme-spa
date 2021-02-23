export interface ITag {
  name: string;
  id: string;
  slug: string;
  path: string;
}

export interface ICategory {
  name: string;
  id: string;
  slug: string;
  path: string;
  parent?: ICategory;
}

export interface IPost {
  id: string;
  title: string;
  comments: boolean;
  link: string;
  path: string;
  published: boolean;
  photos: any[];
  date: string;
  updated: string;
  tags: ITag[];
  categories: ICategory[];
  min2read: number;
  wordCount: string;
  prev?: IPost;
  next?: IPost;
  excerpt: string;
  more: string;
}
