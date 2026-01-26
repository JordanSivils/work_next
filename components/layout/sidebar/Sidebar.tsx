import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import { adminActions, sidebarItems, sidebarQuick } from './sidbarItems';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { RequireRoleWrapper } from '@/components/ui/check-role-wrapper';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex gap-4'>
          <Image
            className='rounded-sm'
            src={'/me_icon.webp'}
            height={30}
            width={30}
            alt='Moore Equine Logo'
          />
          <p>Moore Equine</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarQuick.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.button}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <RequireRoleWrapper roles={["dev"]}>
              <SidebarGroup>
                <SidebarGroupLabel>Dev Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminActions.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          {item.button}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
        </RequireRoleWrapper>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem><SignedIn><UserButton /></SignedIn></SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
