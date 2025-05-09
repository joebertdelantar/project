import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="flex-1 w-full bg-yellow-500 text-white">
                                <CardHeader>
                                    <CardTitle>Card title</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="flex-1 w-full bg-green-500 text-white">
                                <CardHeader>
                                    <CardTitle>Card title</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="flex-1 w-full bg-red-500 text-white">
                                <CardHeader>
                                    <CardTitle>Card title</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
