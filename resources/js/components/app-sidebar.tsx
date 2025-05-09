import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BetweenHorizonalEnd, BookOpen, Building, ChartCandlestick, CircleUser, Folder, LayoutGrid, Receipt, ShoppingBag } from 'lucide-react';
import AppLogo from './app-logo';

// global label
import { GlobalLabel } from './global-label';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Folder,
    },
    {
        title: 'Funds',
        href: '/funds',
        icon: ChartCandlestick,
    },
    {
        title: 'Offices',
        href: '/offices',
        icon: Building,
    },
    {
        title: 'Items',
        href: '/items',
        icon: ShoppingBag,
    },
];

const secondaryNavItems: NavItem[] = [
    {
        title: 'Process Vouchers',
        href: '/acceptances',
        icon: Receipt,
    },
];

const reportNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BetweenHorizonalEnd,
    },
];

const manageNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: CircleUser,
    },
];
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];
export function AppSidebar() {
    const { props } = usePage();
    const auth = props.auth as { user: { id: number; name: string; email: string; role: string } };
    const userId = auth.user.id;
    // console.log('User ID:', userId);
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
                <GlobalLabel text="Platform" className="px-2 py-1 text-gray-600" /> {/* Use GlobalLabel */}
                <NavMain items={mainNavItems} />
                <GlobalLabel text="Vouchers" className="px-2 py-1 text-gray-600" /> {/* Another GlobalLabel */}
                <NavMain items={secondaryNavItems} />
                <GlobalLabel text="Generate" className="px-2 py-1 text-gray-600" />
                <NavMain items={reportNavItems} />
                {userId === 1 && (
                    <div>
                        <GlobalLabel text="Manage" className="px-2 py-1 text-gray-600" />
                        <NavMain items={manageNavItems} />
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
