import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Items',
        href: '/items',
    },
];

interface Item {
    id: number;
    item_code: string;
    item_name: string;
    item_description: string;
    unit_name: string;
}

interface LinkProps {
    url: string | null;
    label: string;
    active: boolean;
}

interface ItemIndexProps {
    items: ItemPagination;
    filters: FilterProps;
}

interface ItemPagination {
    data: Item[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number; // Added total property
}

interface FilterProps {
    search: string;
}

export default function ItemIndex({ items, filters }: ItemIndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flashMessage ? true : false);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(route('items.destroy', id), {
                preserveScroll: true,
                onSuccess: () => setShowAlert(true),
            });
        }
    };

    // hiding alert after 1 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 1000); // 1 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [flashMessage]);

    // console.log('flash', flash);

    // Search functionality
    const { data, setData } = useForm({
        search: filters.search || '', // Initialize search state
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value); // Update the search state

        const queryString = value ? { search: value } : {}; // Create query string based on search value

        // Call the search function here or trigger a search action
        // For example, you can make an API call to fetch filtered categories based on the search term
        router.get(route('items.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && flashMessage && (
                    <div className="fixed top-4 left-1/2 z-50 w-11/12 max-w-2xl -translate-x-1/2 transform">
                        <Alert variant={'default'} className={flash.success ? 'border-green-500 bg-green-500' : 'bg-red-00 border-red-500'}>
                            <AlertTitle className="text-white">{flash.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription className="text-white">{flashMessage}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="relative flex w-1/2 items-center">
                    {/* Search Input */}
                    <Input
                        type="text"
                        name="search"
                        id="search"
                        value={data.search}
                        onChange={handleChange}
                        placeholder="Search items..."
                        className="w-full rounded-md border-gray-300 pr-10 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />

                    {/* Magnifying Glass Icon */}
                    <div className="pointer-events-none absolute left-3 flex items-center">
                        <Search size={20} className="text-gray-500" />
                    </div>

                    {/* Clear Search Button (X Icon) */}
                    {data.search && (
                        <button
                            className="absolute right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => {
                                setData('search', ''); // Clear the search input
                                router.get(route('items.index'), {}, { preserveState: true, preserveScroll: true }); // Reset the search results
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Add Office Button */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('items.create')}
                    >
                        <Plus />
                        <span>Add Item</span>
                    </Link>
                </div>

                {/* Office List */}
                <div className="flex-1 overflow-hidden rounded-xl bg-white p-4 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold">Item List</h2>
                    <table className="w-full divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item Code
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item Name
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item Description
                                </th>


                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase text-right">
                                    Unit
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/* Check if items is empty */}
                            {items.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                            {/* Map through items and display them in the table */}
                            {items.data.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{item.item_code}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{item.item_name}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{item.item_description}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 text-right">{item.unit_name}</td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                as="button"
                                                href={route('items.edit', item.id)}
                                                className="ms-4 flex cursor-pointer items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </Link>

                                            <Button
                                                as="button"
                                                className="ms-4 flex cursor-pointer items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Global Pagination */}
                <Pagination links={items.links} from={items.from} to={items.to} total={items.total} />
            </div>
        </AppLayout>
    );
}
