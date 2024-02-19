export interface AdminType {
  id: string;
  created_at: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  image: string;
}

export interface StaffType {
  id: string;
  created_at: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  level: number;
  image: string;
}

export interface WriterType {
  id: string;
  created_at: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  image: string;
  blog_quantity: string;
}

export interface CustomerType {
  id: string; // p_key
  created_at: string;
  name: string; // p_key
  dob: string;
  phone: string;
  address: string;
  email: string;
  level: number;
  image: string;
}

export interface ProductType {
  id: string; // p_key
  created_at: string;
  brand: string;
  name: string; // p_key
  description: string;
  images: string[];
  price: number;
  options: string[];
  rate: number;
  sold_quantity: number;
  description_id: string; // f_key
  category: string;
  is_deleted: boolean;
}

export interface ProductDescriptionType {
  id: string; // p_key
  created_at: string;
  content: string;
  images: string[];
  writer: string;
  comments: string[];
}

export interface ProductWithDescriptionAndStorageType {
  id: string;
  created_at: string;
  brand: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  options: string[];
  rate: number;
  sold_quantity: number;
  description_id: string;
  category: string;
  is_deleted: boolean;
  product_description: ProductDescriptionType;
  storage: StorageType[];
}

export interface OrderType {
  id: string;
  created_at: string;
  prod_ids: string[]; // array
  prod_names: string[]; // array
  prod_quantities: number[]; // array
  state: "pending" | "shipping" | "delivered" | "canceled" | "returned";
  customer_id: string; // f_key
  customer_name: string; // f_key
  price: number;
  note: string;
  address: string;
}

export interface BlogType {
  id: string;
  created_at: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  writer: string;
  likes: number;
  comments: string[];
}

export interface StorageType {
  id: string; // p_key
  created_at: string;
  name: string;
  address: string;
  prod_id: string; // f_key
  prod_name: string; // f_key
  quantity: number;
}

export interface LogType {
  id: string;
  created_at: string;
  title: string;
  actor: string;
  interface: string;
  result: string;
}
