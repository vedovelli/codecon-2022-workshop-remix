export interface User {
  id: number;
  name: string;
  html_url: string;
  bio: string;
  avatar_url: string;
  location: string;
  company: string;
}

export interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
}
