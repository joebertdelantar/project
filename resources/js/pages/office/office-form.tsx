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


export default function OfficeIndex({...props}) {

    const {office, isEdit} =  props; // Destructure offices from props

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} Office`,
            href: route('offices.create'),
        },
    ];

    

    const {data, setData, post, put, processing, errors, reset} = useForm({
        // if the office is not null, set the data to the office data on the form edit
        office_acronym:  office?.office_acronym || '',
        office_name: office?.office_name || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // if isEdit is true, update the office
        if (isEdit) {
            put(route('offices.update', office?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }else {
            // if isEdit is false, create a new office
            post(route('offices.store'), {
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
                        href={route('offices.index')}
                    >
                        <ArrowLeft />
                        <span>Office List</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} Office</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* office_acronym */}
                                <div className="grid gap-2">
                                    <Label htmlFor="office_acronym">Office Acronym</Label>
                                    <Input value={data.office_acronym} onChange={(e) => setData('office_acronym', e.target.value)} id="office_acronym" name="office_acronym" type="text" placeholder="Office Acronym" autoFocus required />
                                    <InputError message={errors.office_acronym} className="mt-2" />
                                </div>

                                {/* office Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="office_name">Office Name</Label>
                                    <Input value={data.office_name} onChange={(e) => setData('office_name', e.target.value)} id="office_name" name="office_name" type="text" placeholder="Office Name" autoFocus required />
                                    <InputError message={errors.office_name} className="mt-2" />
                                </div>


                                {/* Submit */}
                                <Button type="submit" className="mt-4 w-fit bg-green-600 hover:bg-green-700 cursor-pointer" tabIndex={4}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    <span>{processing ? ('Saving...') : (isEdit ? 'Update' : 'Create')} Office</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
