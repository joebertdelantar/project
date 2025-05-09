import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Acceptances',
        href: '/acceptances',
    },
];

interface Acceptance {
    id: number;
    item_id: number;
    item_name: string;
    fund_id: number;
    category_id: number;
    office_id: number;
    RIS_number: string;
    SSMI_date: string;
    acceptance_date: string;
    qty: number;
    unit_price: string;
    total_price: number;
}

interface LinkProps {
    url: string | null;
    label: string;
    active: boolean;
}

interface AcceptanceIndexProps {
    acceptances: AcceptancePagination;
    filters: FilterProps;
    grandTotal: number;
}

interface AcceptancePagination {
    data: Acceptance[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number; // Added total property
}

interface FilterProps {
    search: string;
}

export default function AcceptanceIndex({ acceptances, filters, grandTotal }: AcceptanceIndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flashMessage ? true : false);

    // get the grand total

    // console.log(grandTotal);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this acceptance?')) {
            router.delete(route('acceptances.destroy', id), {
                preserveScroll: true,
                onSuccess: () => setShowAlert(true),
            });
        }
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 1000); // 1 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [showAlert]);

    // Search functionality
    const { data, setData } = useForm({
        search: filters.search || '', // Initialize search state
        status: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value); // Update the search state
        const status = data.status;

        const queryString = {
            search: value, // Include search query
            status, // Include status filter
        }; // Create query string based on search value

        // Call the search function here or trigger a search action
        // For example, you can make an API call to fetch filtered categories based on the search term
        router.get(route('acceptances.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // for accordion
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleAccordion = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Acceptances" />
            {/* <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4 border-t-4 border-blue-500"> */}
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
                        placeholder="Search acceptances..."
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
                                router.get(route('acceptances.index'), {}, { preserveState: true, preserveScroll: true }); // Reset the search results
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="relative mt-4 flex w-1/2 items-center border-gray-300 text-sm">
                    <select
                        name="status"
                        id="status"
                        value={data.status || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setData('status', value); // Update the status state
                            const queryString = value ? { status: value } : {};
                            router.get(route('acceptances.index'), queryString, {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Add Category Button */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('acceptances.create')}
                    >
                        <Plus />
                        <span>Add Acceptance</span>
                    </Link>
                </div>

                {/* Category List */}
                <div className="flex-1 overflow-hidden rounded-xl bg-white p-4 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold">Acceptance List</h2>
                    <table className="w-full divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    ...
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    RIS Number
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Stock #
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Description
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Qty
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Unit
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Unit Price
                                </th>

                                <th scope="col" className="px-6 py-3 text-left text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Total Price
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/* Check if categories is empty */}
                            {acceptances.data.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No acceptance found.
                                    </td>
                                </tr>
                            )}
                            {/* Map through categories and display them in the table */}
                            {acceptances.data.map((acceptance: any) => (
                                <React.Fragment key={acceptance.id}>
                                    <tr>
                                        <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => toggleAccordion(acceptance.id)}
                                                className="flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                            >
                                                {expandedRow === acceptance.id ? (
                                                    <>
                                                        <ChevronUp size={14} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown size={14} />
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td
                                            className="px-6 py-4 text-left text-sm whitespace-nowrap"
                                            style={{ color: acceptance.status === 'Completed' ? 'green' : 'red' }}
                                        >
                                            {acceptance.status}
                                        </td>
                                        <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-900">{acceptance.RIS_number}</td>
                                        <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-900">{acceptance.item_code}</td>
                                        <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-900">{acceptance.item_description}</td>
                                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900">{acceptance.qty}</td>
                                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900">{acceptance.unit_name}</td>

                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                acceptance.unit_price,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                            {Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                acceptance.total_price,
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex justify-center space-x-2">
                                                <Link
                                                    as="button"
                                                    href={route('acceptances.edit', acceptance.id)}
                                                    className="ms-4 flex cursor-pointer items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </Link>

                                                {/* <Button
                                                    as="button"
                                                    className="ms-4 flex cursor-pointer items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                                                    onClick={() => handleDelete(acceptance.id)}
                                                >
                                                    <Trash2 />
                                                    Delete
                                                </Button> */}
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Dropdown Accordion Row */}
                                    {expandedRow === acceptance.id && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-4">
                                                <Card className="grid grid-cols-2 gap-4 bg-green-50 text-sm">
                                                    <div>
                                                        <CardHeader className="mb-4">
                                                            <CardTitle>Acceptance Details</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="mb-4">
                                                            <p className="mb-2">
                                                                <b>Office:</b> {acceptance.office_name}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Fund:</b> {acceptance.fund_name}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>SSMI Date:</b> {acceptance.SSMI_date}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Acceptance Date:</b> {acceptance.acceptance_date}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Total Cost:</b>{' '}
                                                                {Intl.NumberFormat('en-PH', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(acceptance.total_price)}
                                                            </p>

                                                        </CardContent>
                                                    </div>
                                                    <div>
                                                        <CardHeader className="mb-4">
                                                            <CardTitle>Issuance Details</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="mb-4">
                                                            <p className="mb-2">
                                                                <b>Date Issued:</b> {acceptance.issuance_date}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Qty:</b> {acceptance.issuance_qty}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Unit:</b> {acceptance.unit_name}
                                                            </p>
                                                            <p className="mb-2">
                                                                <b>Total Cost:</b>{' '}
                                                                {Intl.NumberFormat('en-PH', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(acceptance.issuance_total_price)}
                                                            </p>
                                                            <p className="mb-2 font-semibold text-red-600">
                                                                <b>Balances:</b>{' '}
                                                                {Intl.NumberFormat('en-PH', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }).format(acceptance.balance)}
                                                            </p>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Global Pagination */}
                <Pagination links={acceptances.links} from={acceptances.from} to={acceptances.to} total={acceptances.total} />
            </div>
        </AppLayout>
    );
}
