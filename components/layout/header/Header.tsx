'use client';
import ToggleTheme from '@/components/ui/theme-toggle';
import { useSidebar } from '@/components/ui/sidebar';

type HeaderProp = {
  aside: React.ReactNode;
};
export function Header({ aside }: HeaderProp) {
  const { open } = useSidebar();
  return (
    <div className='flex justify-between w-full'>
      {aside}
      {!open && <h1>MooreEquine</h1>}
      <div className='p-2'>
        <ToggleTheme />
      </div>
    </div>
  );
}
