export interface User {
  id: number;
  email: string;
}

export interface Project {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  content: string;
  imageUrl: string;
  author: User;
}

export enum Role {
  ADMIN = 'admin',
  GUEST = 'guest'
}