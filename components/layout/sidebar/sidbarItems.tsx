import { InventoryForm } from '@/app/components/inventory-form';
import {
  Barcode,
  BriefcaseBusiness,
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
  {
    title: 'Brands',
    url: '/brands?limit=25',
    icon: BriefcaseBusiness,
  }
];

export const sidebarQuick = [
  {
    title: 'Inventory',
    url: '#',
    button: <InventoryForm />
  },
  {
    title: 'Product Upload',
    url: '#',
    icon: Upload,
  },
];
