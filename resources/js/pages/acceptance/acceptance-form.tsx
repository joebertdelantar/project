import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AcceptanceIndex({ ...props }) {
    const { acceptance, isEdit } = props;
    // console.log("HIMAYA",acceptance);
    // for the flash message
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flashMessage ? true : false);

    // hiding alert after 1 seconds
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 1000); // 1 seconds

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [showAlert]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} Acceptance`,
            href: route('acceptances.create'),
        },
    ];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        // dont reset RIS_number

        user_id: acceptance?.user_id || '',
        fund_id: acceptance?.fund_id || '',
        fund_name: acceptance?.fund?.fund_name || '',
        SSMI_date: acceptance?.SSMI_date || '',
        category_id: acceptance?.category_id || '',
        category_name: acceptance?.category?.category_name || '',
        RIS_number: acceptance?.RIS_number || '',
        acceptance_date: acceptance?.acceptance_date || '',
        office_id: acceptance?.office_id || '',
        office_name: acceptance?.office?.office_name || '',
        item_code: acceptance?.item?.item_code || '',
        item_description: acceptance?.item?.item_description || '',
        item_id: acceptance?.item_id || '',
        item_name: acceptance?.item?.item_name || '',
        unit_name: acceptance?.item?.unit_name || '',
        qty: acceptance?.qty || '',
        unit_price: acceptance?.unit_price || '',
        total_price: acceptance?.total_price || '',

        // for issuance section
        issuance_date: acceptance?.issuance_date || '',
        issuance_qty: acceptance?.issuance_qty || '',
        issuance_unit_price: acceptance?.issuance_unit_price || '',
        issuance_total_price: acceptance?.issuance_total_price || '',
        balance: acceptance?.balance || '',
        status: acceptance?.status || 'Pending',
    });

    // Automatically calculate total_price when qty or unit_price changes
    useEffect(() => {
        const quantity = parseFloat(data.qty) || 0;
        const unitPrice = parseFloat(data.unit_price) || 0;
        const totalPrice = quantity * unitPrice;
        // for issuance section
        const issuanceQuantity = parseFloat(data.issuance_qty) || 0;
        const issuanceUnitPrice = parseFloat(data.issuance_unit_price) || 0;
        const issuanceTotalPrice = issuanceQuantity * issuanceUnitPrice;

        setData('issuance_total_price', issuanceTotalPrice.toFixed(2));

        setData('total_price', totalPrice.toFixed(2)); // Update total_price with 2 decimal places

        const balance = (totalPrice - issuanceTotalPrice).toFixed(2);
        setData('balance', balance);
        setData('status', balance === '0.00' ? 'Completed' : 'Pending');

        // console.log('data inside useEffect:', data); // Add this line
        // console.log('category_name inside useEffect:', data && data.category_name);
    }, [data.qty, data.unit_price,data.issuance_qty, data.issuance_unit_price, data.balance]); // Watch for changes in qty and unit_price

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // if isEdit is true, update the office
        if (isEdit) {
            put(route('acceptances.update', acceptance?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        } else {
            // if isEdit is false, create a new office
            post(route('acceptances.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();

                    setData('RIS_number', data.RIS_number);
                    setData('office_name', data.office_name);
                    setData('office_id', data.office_id);
                    setData('fund_name', data.fund_name);
                    setData('fund_id', data.fund_id);
                    setData('SSMI_date', data.SSMI_date);
                    setData('acceptance_date', data.acceptance_date);
                    setData('category_name', data.category_name);
                    setData('category_id', data.category_id);
                    setShowAlert(true);

                    // console.log(flash);
                },
                onError: () => console.log(errors),
            });
        }
    };

    const [suggestions, setSuggestions] = useState<{ id: number; RIS_number: string; office_name: string }[]>([]);
    const [categorySuggestions, setCategorySuggestions] = useState<{ id: number; category_name: string }[]>([]);
    const [officeSuggestions, setOfficeSuggestions] = useState<{ id: number; office_name: string }[]>([]);
    const [fundSuggestions, setFundSuggestions] = useState<{ id: number; fund_name: string }[]>([]);
    const [itemSuggestions, setItemSuggestions] = useState<
        { id: number; item_name: string; item_code: string; item_description: string; unit_name: string }[]
    >([]);

    const fetchCategorySuggestions = async (query: string) => {
        if (query.length < 2) {
            setCategorySuggestions([]); // Clear suggestions if query is too short
            return;
        }

        try {
            const response = await fetch(`/categories/suggestions?query=${query}`); // Updated endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch category suggestions');
            }
            const data = await response.json();
            setCategorySuggestions(data); // Update suggestions state
        } catch (error) {
            console.error('Error fetching category suggestions:', error);
        }
    };

    const fetchOfficeSuggestions = async (query: string) => {
        if (query.length < 2) {
            setOfficeSuggestions([]); // Clear suggestions if query is too short
            return;
        }

        try {
            const response = await fetch(`/offices/suggestions?query=${query}`); // Updated endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch office suggestions');
            }
            const data = await response.json();
            setOfficeSuggestions(data); // Update suggestions state with id and name
        } catch (error) {
            console.error('Error fetching office suggestions:', error);
        }
    };

    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]); // Clear suggestions if query is too short
            return;
        }
    
        try {
            const response = await fetch(`/acceptances/suggestions?query=${query}`);
            if (!response.ok) throw new Error('Failed to fetch suggestions');
    
            const data = await response.json();
    
            // Ensure unique suggestions
            const uniqueSuggestions = [
                ...new Map(data.map((suggestion: { RIS_number: string }) => [suggestion.RIS_number, suggestion])).values(),
            ] as { id: number; RIS_number: string; office_name: string }[];
    
            // Close suggestions if pasted query matches an existing suggestion
            if (uniqueSuggestions.some(s => s.RIS_number === query)) {
                setSuggestions([]);
            } else {
                setSuggestions(uniqueSuggestions); // Update suggestions state
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };
    

    const fetchItemSuggestions = async (query: string) => {
        if (query.length < 2) {
            setItemSuggestions([]); // Clear suggestions if query is too short
            return;
        }

        try {
            const response = await fetch(`/items/suggestions?query=${query}`); // Updated endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch item suggestions');
            }
            const data = await response.json();
            setItemSuggestions(data); // Update suggestions state
        } catch (error) {
            console.error('Error fetching item suggestions:', error);
        }
    };

    const fetchFundSuggestions = async (query: string) => {
        if (query.length < 2) {
            setFundSuggestions([]); // Clear suggestions if query is too short
            return;
        }

        try {
            const response = await fetch(`/funds/suggestions?query=${query}`); // Updated endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch fund suggestions');
            }
            const data = await response.json();
            setFundSuggestions(data); // Update suggestions state
        } catch (error) {
            console.error('Error fetching fund suggestions:', error);
        }
    };

    const handleFundSuggestionClick = (fund: { id: number; fund_name: string }) => {
        setData('fund_name', fund.fund_name); // Set the selected fund name
        setData('fund_id', fund.id); // Set the selected fund ID
        setFundSuggestions([]); // Clear suggestions
    };

    const handleCategorySuggestionClick = (category: { id: number; category_name: string }) => {
        setData('category_name', category.category_name); // Set the selected category name
        setData('category_id', category.id); // Set the selected category ID
        setCategorySuggestions([]); // Clear suggestions
    };

    const handleOfficeSuggestionClick = (office: { id: number; office_name: string }) => {
        setData('office_name', office.office_name); // Set the selected office name
        setData('office_id', office.id); // Set the selected office ID
        setOfficeSuggestions([]); // Clear suggestions
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleSuggestionClick = (suggestion: { id: number; RIS_number: string; office_name: string }) => {
        setData('RIS_number', suggestion.RIS_number); // Set the selected suggestion
        // console.log(suggestion.office_name);
        setSuggestions([]); // Clear suggestions
        setDropdownOpen(false); // Close the dropdown
    };

    const handleItemSuggestionClick = (item: { id: number; item_name: string; item_code: string; item_description: string; unit_name: string }) => {
        setData('item_code', item.item_code); // Set the selected item code
        setData('item_description', item.item_description); // Auto-fill item description
        setData('unit_name', item.unit_name); // Auto-fill unit name
        setData('item_id', item.id); // Set the selected item ID
        setData('item_name', item.item_name); // Set the selected item name
        setItemSuggestions([]); // Clear suggestions
    };

    // Add this function to fetch data based on RIS_number

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Acceptance" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && flashMessage && (
                    <div className="fixed top-4 left-1/2 z-50 w-11/12 max-w-2xl -translate-x-1/2 transform">
                        <Alert variant={'default'} className={flash.success ? 'border-green-500 bg-green-500' : 'bg-red-00 border-red-500'}>
                            <AlertTitle className="text-white">{flash.success ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription className="text-white">{flashMessage}</AlertDescription>
                        </Alert>
                    </div>
                )}
                {/* Back to office List */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('acceptances.index')}
                    >
                        <ArrowLeft />
                        <span>Acceptance List</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} Acceptance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="fund_name">Fund Name</Label>
                                    <div className="relative">
                                        <Input
                                            value={data.fund_name}
                                            onChange={(e) => {
                                                setData('fund_name', e.target.value);
                                                fetchFundSuggestions(e.target.value); // Fetch suggestions when typing
                                            }}
                                            id="fund_name"
                                            name="fund_name"
                                            type="text"
                                            placeholder="Fund Name"
                                            autoFocus
                                            required
                                        />
                                        {/* Suggestions Dropdown */}
                                        {fundSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full rounded-md border border-gray-300 bg-white shadow-md">
                                                {fundSuggestions.map((fund, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleFundSuggestionClick(fund)}
                                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        {fund.fund_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.fund_name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="SSMI_date">SSMI Month</Label>
                                    <Input
                                        className="w-[200px]"
                                        value={data.SSMI_date}
                                        onChange={(e) => setData('SSMI_date', e.target.value)} // Ensure the value is in 'yyyy-MM' format
                                        id="SSMI_date"
                                        name="SSMI_date"
                                        type="month" // Use 'month' input type to enforce 'yyyy-MM' format
                                        placeholder="SSMI Date"
                                        required
                                    />
                                    <InputError message={errors.SSMI_date} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* <div className="grid gap-2">
                                    <Label htmlFor="category_name">Category</Label>
                                    <select
                                        value={data.category_name}
                                        onChange={(e) => setData('category_name', e.target.value)}
                                        id="category_name"
                                        name="category_name"
                                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {props.categories.map((category: { id: number; category_name: string }) => (
                                            <option key={category.id} value={category.id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_name} className="mt-2" />
                                </div> */}
                                <div className="grid gap-2">
                                    <Label htmlFor="category_name">Categories</Label>
                                    <div className="relative">
                                        <Input
                                            value={data.category_name}
                                            onChange={(e) => {
                                                setData('category_name', e.target.value);
                                                fetchCategorySuggestions(e.target.value); // Fetch suggestions when typing
                                            }}
                                            id="category_name"
                                            name="category_name"
                                            type="text"
                                            placeholder="Category Name"
                                            autoFocus
                                            required
                                        />
                                        {/* Suggestions Dropdown */}
                                        {categorySuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full rounded-md border border-gray-300 bg-white shadow-md">
                                                {categorySuggestions.map((category, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleCategorySuggestionClick(category)}
                                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        {category.category_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.category_name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="acceptance_date">Acceptance Date</Label>
                                    <Input
                                        className="w-[200px]"
                                        value={data.acceptance_date}
                                        onChange={(e) => setData('acceptance_date', e.target.value)}
                                        id="acceptance_date"
                                        name="acceptance_date"
                                        type="date" // Use "date" input type for a date picker
                                        placeholder="Acceptance Date"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.acceptance_date} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="RIS_number">RIS Number</Label>
                                    <div className="relative">
                                        <Input
                                            value={data.RIS_number}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setData('RIS_number', inputValue);
                                                fetchSuggestions(inputValue); // Fetch suggestions when typing
                                                

                                                // Close suggestions if pasted value matches an existing suggestion
                                                if (suggestions.some(s => s.RIS_number === inputValue)) {
                                                    setSuggestions([]); // Hide dropdown
                                                }else{
                                                    fetchSuggestions(inputValue); // Fetch suggestions when typing
                                                }
                                                
                                            }}
                                            id="RIS_number"
                                            name="RIS_number"
                                            type="text"
                                            placeholder="RIS Number"
                                            autoFocus
                                            required
                                        />
                                        {/* Suggestions Dropdown */}
                                        {dropdownOpen && suggestions.length > 0 && (
                                            <div className="absolute z-10 w-full rounded-md border border-gray-300 bg-white shadow-md">
                                                {suggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        {suggestion.RIS_number}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.RIS_number} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="office_name">Office Name</Label>
                                    <div className="relative">
                                        <Input
                                            value={data.office_name}
                                            onChange={(e) => {
                                                setData('office_name', e.target.value);
                                                fetchOfficeSuggestions(e.target.value); // Fetch suggestions when typing
                                            }}
                                            id="office_name"
                                            name="office_name"
                                            type="text"
                                            placeholder="Office Name"
                                            autoFocus
                                            required
                                        />
                                        {/* Suggestions Dropdown */}
                                        {officeSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full rounded-md border border-gray-300 bg-white shadow-md">
                                                {officeSuggestions.map((office, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleOfficeSuggestionClick(office)}
                                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        {office.office_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.office_name} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="item_code">Item Code</Label>
                                    <div className="relative">
                                        <Input
                                            value={data.item_code}
                                            onChange={(e) => {
                                                setData('item_code', e.target.value);
                                                fetchItemSuggestions(e.target.value); // Fetch suggestions when typing
                                            }}
                                            id="item_code"
                                            name="item_code"
                                            type="text"
                                            placeholder="Item Code"
                                            autoFocus
                                            required
                                        />
                                        {/* Suggestions Dropdown */}
                                        {itemSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full rounded-md border border-gray-300 bg-white shadow-md">
                                                {itemSuggestions.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleItemSuggestionClick(item)}
                                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        {item.item_code}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.item_code} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="item_description">Item Description</Label>
                                    <Input
                                        value={data.item_description}
                                        onChange={(e) => setData('item_description', e.target.value)}
                                        id="item_description"
                                        name="item_description"
                                        type="text"
                                        placeholder="Item Description"
                                        className='bg-gray-100 cursor-not-allowed'
                                        disabled // Makes the input field disabled
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.item_description} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_name">Unit Name</Label>
                                    <Input
                                        value={data.unit_name}
                                        onChange={(e) => setData('unit_name', e.target.value)}
                                        id="unit_name"
                                        name="unit_name"
                                        type="text"
                                        placeholder="Unit Name"
                                        className='bg-gray-100 cursor-not-allowed'
                                        disabled // Makes the input field disabled
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.unit_name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="qty">Quantity</Label>
                                    <Input
                                        value={data.qty}
                                        onChange={(e) => setData('qty', e.target.value)}
                                        id="qty"
                                        name="qty"
                                        type="number"
                                        placeholder="Quantity"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.qty} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_price">Unit Price</Label>
                                    <Input
                                        value={data.unit_price}
                                        onChange={(e) => setData('unit_price', e.target.value)}
                                        id="unit_price"
                                        name="unit_price"
                                        type="number"
                                        placeholder="Unit Price"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.unit_price} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="total_price">Total Price</Label>
                                    <Input
                                        className="text-red-600 font-bold bg-gray-100 cursor-not-allowed"
                                        value={data.total_price} // Use data.amount instead of data.amount
                                        onChange={(e) => setData('total_price', e.target.value)}
                                        id="total_price"
                                        name="total_price"
                                        type="total_price"
                                        placeholder="total_price"
                                        disabled // Makes the input field disabled
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.total_price} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6"></div>

                            <hr className="my-4 border-t-3 border-green-300" />

                            <div className="grid gap-2 text-center">
                                <h2 className="font-bold">Issuance Section</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="issuance_date">Issuance Date</Label>
                                    <Input
                                        value={data.issuance_date}
                                        onChange={(e) => setData('issuance_date', e.target.value)}
                                        id="issuance_date"
                                        name="issuance_date"
                                        type="date"
                                        placeholder="Issuance Date"
                                        autoFocus
                                    />
                                    <InputError message={errors.issuance_date} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="issuance_qty">Issuance Quantity</Label>
                                    <Input
                                        value={data.issuance_qty}
                                        onChange={(e) => setData('issuance_qty', e.target.value)}
                                        id="issuance_qty"
                                        name="issuance_qty"
                                        type="number"
                                        placeholder="Issuance Quantity"
                                        autoFocus
                                    />
                                    <InputError message={errors.issuance_qty} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="issuance_price">Issuance Unit Price</Label>
                                    <Input
                                        value={data.issuance_unit_price}
                                        onChange={(e) => setData('issuance_unit_price', e.target.value)}
                                        id="issuance_unit_price"
                                        name="issuance_unit_price"
                                        type="number"
                                        placeholder="Issuance Unit Price"
                                        autoFocus
                                    />
                                    <InputError message={errors.issuance_unit_price} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="issuance_total_price">Issuance Total Price</Label>
                                    <Input
                                        className="text-red-600 font-bold"
                                        value={data.issuance_total_price}
                                        onChange={(e) => setData('issuance_total_price', e.target.value)}
                                        id="issuance_total_price"
                                        name="issuance_total_price"
                                        type="number"
                                        placeholder="Issuance Total Price"
                                        disabled
                                        autoFocus
                                    />
                                    <InputError message={errors.issuance_total_price} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="balance">Balances</Label>
                                    <Input
                                        className="text-green-600 font-bold bg-gray-100 cursor-not-allowed"
                                        value={data.balance}
                                        onChange={(e) => setData('balance', e.target.value)}
                                        id="balance"
                                        name="balance"
                                        type="number"
                                        placeholder="Balances"
                                        disabled
                                        autoFocus
                                    />
                                    <InputError message={errors.balance} className="mt-2" />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="mt-4 w-fit cursor-pointer bg-green-600 hover:bg-green-700" tabIndex={4}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                <span>{processing ? 'Saving...' : isEdit ? 'Update' : 'Create'} Acceptance</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
