
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    username: string;
    role: string;
    email: string; // Added email for proper mapping
}

export default function UserIndex() {
    // Define types correctly to prevent 'unknown' error
    const { users } = usePage().props as { users?: User[] }; 

    // flash message
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flashMessage ? true : false);

    const handleDelete = (id: number) => {
            if (confirm('Are you sure you want to delete this user?')) {
                router.delete(route('users.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => setShowAlert(true),
                });
            }
        };

    useEffect(() => {
            if (flashMessage) {
                const timer = setTimeout(() => {
                    setShowAlert(false);
                }, 1000); // 1 seconds
    
                return () => clearTimeout(timer); // Cleanup the timer on component unmount
            }
        }, [flashMessage]);

    // Ensure `users` is always an array
    const userList = Array.isArray(users) ? users : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Alert message */}
                {showAlert && flashMessage && (
                    <div className="fixed top-4 left-1/2 z-50 w-11/12 max-w-2xl -translate-x-1/2 transform">
                        <Alert variant={'default'} className={flash.success ? 'border-green-500 bg-green-500' : 'bg-red-00 border-red-500'}>
                            <AlertTitle className="text-white">{flash.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription className="text-white">{flashMessage}</AlertDescription>
                        </Alert>
                    </div>
                )}
                {/* add user button */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                     href={route('users.create')} 
                     className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                     as="button"
                     >
                        <Plus />
                        <span>Add User</span>
                    </Link>
                </div>
                {/* Users list */}
                <div className="flex-1 overflow-hidden rounded-xl bg-white p-4 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold">Users List</h2>
                    <table className="w-full divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Email
                                </th>
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Role
                                </th> */}
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userList.length > 0 ? (
                                userList.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{user.email}</td>
                                        {/* <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{user.role}</td> */}
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex justify-center space-x-2">
                                            <Link
                                                as="button"
                                                href={route('users.edit', user.id)}
                                                className="ms-4 flex cursor-pointer items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </Link>
                                            <Button
                                                as="button"
                                                className="ms-4 flex cursor-pointer items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 py-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
