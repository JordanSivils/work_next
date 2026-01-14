'use server';

export interface Product {
  description: string;
  available: number;
  status: ProductStats;
  price: number;
}

export type ProductStats = 'standard' | 'non-standard';

export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = [
        {
          description: 'Apple MacBook Pro 16"',
          available: null,
          status: 'standard',
          price: 2999.99,
          category: 'Laptop',
        },
        {
          description: 'Lenovo ThinkPad X1 Carbon',
          available: 8,
          status: 'standard',
          price: 1899.99,
          category: 'Laptop',
        },
        {
          description: 'Logitech MX Master 3 Mouse',
          available: 38,
          status: 'standard',
          price: 99.95,
          category: 'Peripheral',
        },
        {
          description: 'Samsung 32" Curved Monitor',
          available: 5,
          status: 'non-standard',
          price: 429.5,
          category: 'Monitor',
        },
        {
          description: 'Generic USB-C Dock',
          available: 24,
          status: 'standard',
          price: 75.0,
          category: 'Accessory',
        },
      ] as (Product & { category: string })[];
      resolve(products);
    }, 1111);
  });
}
