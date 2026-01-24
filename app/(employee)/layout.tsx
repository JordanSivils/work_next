
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar/Sidebar';
import { Header } from '@/components/layout/header/Header';
import { ToastContainer } from "react-toastify"

export default function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <SidebarProvider>
            <AppSidebar />
              <main className='w-full'>
                <Header aside={<SidebarTrigger />} />
                {children}
                <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                />
              </main>
          </SidebarProvider>
  );
}
