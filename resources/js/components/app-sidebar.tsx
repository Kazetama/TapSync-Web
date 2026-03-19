import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type Usertype } from '@/types';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Clock, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
        usertype: ['user'],
    },

    {
        title: 'Admin Dashboard',
        url: '/admin/dashboard',
        icon: LayoutGrid,
        usertype: ['admin'],
    },

    {
        title: 'Manajemen Siswa',
        url: '/admin/siswa',
        icon: Users,
        usertype: ['admin'],
    },

    {
        title: 'Data Absensi',
        url: '/admin/absensi',
        icon: BookOpen,
        usertype: ['admin'],
    },
    
    {
        title: 'Pengaturan Absensi',
        url: '/admin/absensi/settings',
        icon: Clock,
        usertype: ['admin'],
    },
    
    {
        title: 'Super Admin Dashboard',
        url: '/superadmin/dashboard',
        icon: LayoutGrid,
        usertype: ['superadmin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    const usertype: Usertype = auth?.user?.usertype ?? 'user'

    const filteredMainNavItems = mainNavItems.filter(
        item => !item.usertype || item.usertype.includes(usertype)
    )

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
