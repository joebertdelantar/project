import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Arrow } from '@radix-ui/react-tooltip';
import { ArrowLeft, LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function CategoryIndex({...props}) {

    const {category, isEdit} =  props; // Destructure categories from props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} Category`,
            href: route('categories.create'),
        },
    ];

    

    const {data, setData, post, put, processing, errors, reset} = useForm({
        // if the category is not null, set the data to the category data on the form edit
        category_code:  category?.category_code || '',
        category_name: category?.category_name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // if isEdit is true, update the category
        if (isEdit) {
            put(route('categories.update', category?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }else {
            // if isEdit is false, create a new category
            post(route('categories.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }
    };

    // console.log('data', data);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                

                {/* Back to Category List */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('categories.index')}
                    >
                        <ArrowLeft />
                        <span>Category List</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* Category Code */}
                                <div className="grid gap-2">
                                    <Label htmlFor="category_code">Category Code</Label>
                                    <Input value={data.category_code} onChange={(e) => setData('category_code', e.target.value)} id="category_code" name="category_code" type="text" placeholder="Category Code" autoFocus required />
                                    <InputError message={errors.category_code} className="mt-2" />
                                </div>

                                {/* Category Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="category_name">Category Name</Label>
                                    <Input value={data.category_name} onChange={(e) => setData('category_name', e.target.value)} id="category_name" name="category_name" type="text" placeholder="Category Name" autoFocus required />
                                    <InputError message={errors.category_name} className="mt-2" />
                                </div>


                                {/* Submit */}
                                <Button type="submit" className="mt-4 w-fit bg-green-600 hover:bg-green-700 cursor-pointer" tabIndex={4}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    <span>{processing ? ('Saving...') : (isEdit ? 'Update' : 'Create')} Category</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
