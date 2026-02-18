import { CsvDialog } from '@/app/(employee)/components/forms/csv-dialog';
import { SyncUsers } from '@/app/(employee)/components/forms/sync-users';
import { InventoryForm } from '@/app/(employee)/components/forms/inventory-form';
import {
  Barcode,
  BriefcaseBusiness,
  FileText,
  Home,
  SquareUserRound,
  Truck,
  Upload,
} from 'lucide-react';
import { InventoryFormWrapper } from '@/app/(employee)/components/forms/inventory-form-wrapper';
import { SpecialOrderWrapper } from '@/app/(employee)/components/forms/special-order-wrapper';

export const sidebarItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Products',
    url: '/products',
    icon: Barcode,
  },
  {
    title: 'Suppliers',
    url: '/suppliers',
    icon: Truck,
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: SquareUserRound,
  },
  {
    title: 'Brands',
    url: '/brands',
    icon: BriefcaseBusiness,
  }
];

export const sidebarQuick = [
  {
    title: 'Inventory',
    button: <InventoryFormWrapper />
  },
  {
    title: 'Special Order Form',
    button: <SpecialOrderWrapper />
  },
];

export const adminActions = [
  {
    title: 'Database Inventory',
    button: <CsvDialog />
  },
  {
    title: "Sync Users",
    button: <SyncUsers />
  }
]
