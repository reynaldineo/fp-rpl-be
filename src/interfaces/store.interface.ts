export interface qtyAtt {
  prod_id: string;
  cart_id: string;
}

export interface prodAtt {
  id?: string;
  img_url?: string;
  name: string;
  price: number;
  stock: number;
  description: string;
}
