import {
  Barcode,
  FileText,
  Home,
  SquareUserRound,
  Truck,
  Upload,
} from 'lucide-react';

export const sidebarItems = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Products',
    url: '/products',
    icon: Barcode,
  },
  {
    title: 'Suppliers',
    url: '#',
    icon: Truck,
  },
  {
    title: 'Employees',
    url: '#',
    icon: SquareUserRound,
  },
];

export const sidebarQuick = [
  {
    title: 'Inventory',
    url: '#',
    icon: FileText,
  },
  {
    title: 'Product Upload',
    url: '#',
    icon: Upload,
  },
];
