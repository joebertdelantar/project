import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function UserIndex({ ...props }) {
    const { user, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Create'} User`,
            href: route('users.create'),
        },
    ];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        // if the user is not null, set the data to the user data on the form edit
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        // role: user?.role || '',
    });

    // password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // console.log(data);
        // if isEdit is true, update the user
        if (isEdit) {
            put(route('users.update', user?.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        } else {
            // if isEdit is false, create a new user
            post(route('users.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: () => console.log(errors),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* back button to user list */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                    <Link
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        as="button"
                        href={route('users.index')}
                    >
                        <ArrowLeft />
                        <span>Users List</span>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit' : 'Create'} User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">User Name</Label>
                                    <Input
                                        id="name"
                                        onChange={(e) => setData('name', e.target.value)}
                                        value={data.name}
                                        placeholder="User Name"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        value={data.email}
                                        type="email"
                                        placeholder="Email"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div className="relative grid gap-2">
                                    <Label htmlFor="password">{isEdit ? 'New Password' : 'Password'}</Label>
                                    <div className="relative flex items-center">
                                        <Input
                                            id="password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            value={data.password}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            required
                                            autoFocus
                                        />
                                        <button className="absolute right-3 flex" onClick={() => setShowPassword(!showPassword)} type="button">
                                            {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                        </button>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">{isEdit ? 'New Password Confirmation' : 'Password Confirmation'}</Label>
                                    <div className="relative flex items-center">
                                        <Input
                                            id="password_confirmation"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            value={data.password_confirmation}
                                            type={showPasswordConfirmation ? 'text' : 'password'} // Make it dynamic
                                            placeholder="Password Confirmation"
                                            required
                                            autoFocus
                                        />
                                        <button
                                            className="absolute right-3 flex"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            type="button"
                                        >
                                            {showPasswordConfirmation ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                        </button>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>
                                {/* <div className="grid gap-2">
                                    <Label htmlFor='role'>Role</Label>
                                    <Input
                                    id='role'
                                    onChange={(e) => setData('role', e.target.value)}
                                    value={data.role}
                                     placeholder='Role'/>
                                </div> */}
                            </div>

                            {/* button submit */}
                            <Button type="submit" className="w-fit cursor-pointer rounded-md bg-green-600 px-4 py-2 hover:bg-green-700">
                                <span>{isEdit ? 'Update' : 'Create'} User</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
