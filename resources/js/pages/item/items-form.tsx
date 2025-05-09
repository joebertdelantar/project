import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function ItemIndex({ ...props }) {
    const { item, isEdit } = props; // Destructure item from props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} Item`,
            href: route('items.create'),
        },
    ];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        // if the item is not null, set the data to the item data on the form edit
        item_code: item?.item_code || '',
        item_name: item?.item_name || '',
        item_description: item?.item_description || '',
        unit_name: item?.unit_name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // if isEdit is true, update the item
        if (isEdit) {
            put(route('items.update', item?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        } else {
            // if isEdit is false, create a new item
            post(route('items.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }
    };

    // console.log('data', data);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offices" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Back to office List */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('items.index')}
                    >
                        <ArrowLeft />
                        <span>Item List</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* item code */}
                                <div className="grid gap-2">
                                    <Label htmlFor="item_code">Item Code</Label>
                                    <Input
                                        value={data.item_code}
                                        onChange={(e) => setData('item_code', e.target.value)}
                                        id="item_code"
                                        name="item_code"
                                        type="text"
                                        placeholder="Item Code"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.item_code} className="mt-2" />
                                </div>

                                {/* item Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="item_name">Item Name</Label>
                                    <Input
                                        value={data.item_name}
                                        onChange={(e) => setData('item_name', e.target.value)}
                                        id="item_name"
                                        name="item_name"
                                        type="text"
                                        placeholder="Item Name"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.item_name} className="mt-2" />
                                </div>

                                {/* item description */}
                                <div className="grid gap-2">
                                    <Label htmlFor="item_description">Item Description</Label>
                                    <Input
                                        value={data.item_description}
                                        onChange={(e) => setData('item_description', e.target.value)}
                                        id="item_description"
                                        name="item_description"
                                        type="text"
                                        placeholder="Item Description"
                                        autoFocus
                                        required
                                    />
                                    <InputError message={errors.item_description} className="mt-2" />
                                </div>

                                {/* item unit */}
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_name">Item Unit</Label>
                                    <select
                                        id="unit_name"
                                        name="unit_name"
                                        value={data.unit_name}
                                        onChange={(e) => setData('unit_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select Item Unit
                                        </option>
                                        <option value="Kilogram">Kilogram</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Piece">Piece</option>
                                        <option value="Box">Box</option>
                                        <option value="Pcs">Pcs</option>
                                        <option value="Bottle">Bottle</option>
                                        <option value="Pairs">Pairs</option>
                                        <option value="Packs">Packs</option>
                                        <option value="Gals">Gals</option>
                                        <option value="Cans">Cans</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Tins">Tins</option>
                                        <option value="Tubs">Tubs</option>
                                        <option value="Drums">Drums</option>
                                        <option value="Sheets">Sheets</option>
                                        <option value="Rolls">Rolls</option>
                                        <option value="Bundles">Bundles</option>
                                        <option value="Sets">Sets</option>
                                        <option value="Cases">Cases</option>
                                        <option value="Totes">Totes</option>
                                        <option value="Crates">Crates</option>
                                        <option value="Trays">Trays</option>
                                        <option value="Pallets">Pallets</option>
                                        <option value="Tanks">Tanks</option>
                                    </select>
                                    <InputError message={errors.unit_name} className="mt-2" />
                                </div>

                                {/* Submit */}
                                <Button type="submit" className="mt-4 w-fit cursor-pointer bg-green-600 hover:bg-green-700" tabIndex={4}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    <span>{processing ? 'Saving...' : isEdit ? 'Update' : 'Create'} Item</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
