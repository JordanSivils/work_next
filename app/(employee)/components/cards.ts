import { Barcode, BriefcaseBusiness, SquareUserRound, Truck } from 'lucide-react';

export const cards = [
  {
    title: 'Products',
    description: 'Filterable and Sortable Products Table',
    url: '/products',
    icon: Barcode,
  },
  {
    title: 'Suppliers',
    description: 'Filterable and Sortable Supplier Table',
    url: '/suppliers',
    icon: Truck,
  },
  {
    title: 'Employees',
    description: 'Quick employee information lookup',
    url: '/employees',
    icon: SquareUserRound,
  },
  {
    title: "Brands",
    description: "Filterable and Sortable Brand Table",
    url: "/brands",
    icon: BriefcaseBusiness
  }
];
