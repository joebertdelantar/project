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


export default function FundIndex({...props}) {

    const {fund, isEdit} =  props; 

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} Acceptance`,
            href: route('acceptances.create'),
        },
    ];

    

    const {data, setData, post, put, processing, errors, reset} = useForm({
        // if the acceptance is not null, set the data to the acceptance data on the form edit
        fund_code:  fund?.fund_code || '',
        fund_name: fund?.fund_name || '',
        
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // if isEdit is true, update the office
        if (isEdit) {
            put(route('funds.update', fund?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }else {
            // if isEdit is false, create a new office
            post(route('funds.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }
    };

    // console.log('data', data);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Funds" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                

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
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} Fund</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* office_acronym */}
                                <div className="grid gap-2">
                                    <Label htmlFor="fund_code">Fund Code</Label>
                                    <Input value={data.fund_code} onChange={(e) => setData('fund_code', e.target.value)} id="fund_code" name="fund_code" type="text" placeholder="Fund Code" autoFocus required />
                                    <InputError message={errors.fund_code} className="mt-2" />
                                </div>

                                {/* office Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="fund_name">Fund Name</Label>
                                    <Input value={data.fund_name} onChange={(e) => setData('fund_name', e.target.value)} id="fund_name" name="fund_name" type="text" placeholder="Fund Name" autoFocus required />
                                    <InputError message={errors.fund_name} className="mt-2" />
                                </div>


                                {/* Submit */}
                                <Button type="submit" className="mt-4 w-fit bg-green-600 hover:bg-green-700 cursor-pointer" tabIndex={4}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    <span>{processing ? ('Saving...') : (isEdit ? 'Update' : 'Create')} Fund</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
