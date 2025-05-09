import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports',
        href: '/reports',
    },
];
export default function ReportIndex() {
    const RIS_number = usePage().props.RIS_number ?? [];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const RIS_number_value = formData.get('RIS_number'); // get the value of the RIS_number input field

        // console.log(RIS_number_value);
        if (RIS_number_value) {
            const RIS_number = encodeURIComponent(RIS_number_value as string);
            // console.log(RIS_number);
            // query the database using axios
            axios
                .get(`/acceptances/get-by-ris?RIS_number=${RIS_number}`)
                .then((response) => {
                    const data = response.data;
                    
                    const monthNames = [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                    ];
                    const date = data?.SSMI_date && !isNaN(Date.parse(data.SSMI_date)) ? new Date(data.SSMI_date) : new Date(data[0].SSMI_date); // Fallback to current date only if SSMI_date is invalid

                    const monthName = !isNaN(date.getTime()) && Array.isArray(monthNames) ? monthNames[date.getMonth()] : 'Unknown Month';

                    // create a new jsPDF instance
                    const doc = new jsPDF({
                        orientation: 'landscape', // change to 'landscape' for landscape orientation
                        // how to set paper to legal?
                        unit: 'px',
                        format: [612, 792],
                    });

                    // add content to the pdf
                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold'); // Set font to bold
                    doc.text(`Report on the Receipt of `, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
                    doc.text(`${data[0].category.category_name}`, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
                    doc.text(`For the Month of ${monthName} ${date.getFullYear()}`, doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });

                    // create table

                    autoTable(doc, {
                        startY: 100,
                        theme: 'grid',
                        tableWidth: 'auto',
                        columnStyles: {
                            0: { halign: 'center' },
                            1: { halign: 'center' },
                            2: { halign: 'center' },
                            3: { halign: 'center' },
                            4: { halign: 'center' },
                            5: { halign: 'center' },
                            6: { halign: 'center' },
                            7: { halign: 'center' },
                            8: { halign: 'center' },
                            9: { halign: 'center' },
                            10: { halign: 'center' },
                            11: { halign: 'center' },
                            12: { halign: 'center' },
                        },
                        head: [
                            [
                                {
                                    content: data[0].category.category_name,
                                    colSpan: 13,
                                    styles: {
                                        fontStyle: 'bold',
                                        fillColor: [0, 255, 0],
                                        textColor: [0, 0, 0],
                                    },
                                },
                            ],
                            [
                                {
                                    content: data[0].RIS_number,
                                    colSpan: 4,
                                    styles: {
                                        fontStyle: 'bold',
                                        fillColor: [255, 255, 0],
                                        textColor: [0, 0, 0],
                                    },
                                },
                                {
                                    content: 'ACCEPTANCE',
                                    colSpan: 4,
                                    styles: {
                                        fontStyle: 'bold',
                                        fillColor: [255, 192, 203],
                                        textColor: [0, 0, 0],
                                        halign: 'center',
                                    },
                                },
                                {
                                    content: 'ISSUANCE',
                                    colSpan: 5,
                                    styles: {
                                        fontStyle: 'bold',
                                        fillColor: [173, 216, 230],
                                        textColor: [0, 0, 0],
                                        halign: 'center',
                                    },
                                },
                            ],

                            [
                                { content: 'Acceptance Date', colSpan: 1, styles: { halign: 'center' } },
                                { content: 'Office', colSpan: 1, styles: { halign: 'center' } },
                                { content: 'Item Code', colSpan: 1, styles: { halign: 'center' } },
                                { content: 'Item Description', colSpan: 1, styles: { halign: 'center' } },
                                { content: 'Unit', colSpan: 1, styles: { halign: 'center', fillColor: [255, 192, 203], textColor: [0, 0, 0] } },
                                { content: 'Qty', colSpan: 1, styles: { halign: 'center', fillColor: [255, 192, 203], textColor: [0, 0, 0] } },
                                { content: 'Unit Price', colSpan: 1, styles: { halign: 'center', fillColor: [255, 192, 203], textColor: [0, 0, 0] } },
                                {
                                    content: 'Total Price',
                                    colSpan: 1,
                                    styles: { halign: 'center', fillColor: [255, 192, 203], textColor: [0, 0, 0] },
                                },
                                { content: 'Date', colSpan: 1, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                                { content: 'Qty', colSpan: 1, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                                { content: 'Unit Price', colSpan: 1, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                                {
                                    content: 'Total Price',
                                    colSpan: 1,
                                    styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] },
                                },
                                { content: 'Balance', colSpan: 1, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                            ],
                        ],

                        body: [
                            ...data.map((item: any) => {
                                return [
                                    { content: item.acceptance_date },
                                    { content: item.office.office_acronym },
                                    { content: item.item.item_code },
                                    { content: item.item.item_description },
                                    { content: item.item.unit_name, styles: { fillColor: [255, 192, 203], textColor: [0, 0, 0] } },
                                    { content: item.qty, styles: { fillColor: [255, 192, 203], textColor: [0, 0, 0] } },
                                    {
                                        content: parseFloat(item.unit_price).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                        styles: { halign: 'right', fillColor: [255, 192, 203], textColor: [0, 0, 0] },
                                    },
                                    {
                                        content: parseFloat(item.total_price).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                        styles: { halign: 'right', fillColor: [255, 192, 203], textColor: [0, 0, 0] },
                                    },

                                    { content: item.issuance_date, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                                    { content: item.issuance_qty, styles: { halign: 'center', fillColor: [173, 216, 230], textColor: [0, 0, 0] } },
                                    {
                                        content: parseFloat(item.issuance_unit_price).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                        styles: { halign: 'right', fillColor: [173, 216, 230], textColor: [0, 0, 0] },
                                    },
                                    {
                                        content: parseFloat(item.issuance_total_price).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                        styles: { halign: 'right', fillColor: [173, 216, 230], textColor: [0, 0, 0] },
                                    },
                                    {
                                        content: parseFloat(item.balance).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }),
                                        styles: { halign: 'right', fillColor: [173, 216, 230], textColor: [0, 0, 0] },
                                    },
                                ];
                            }),
                        ],
                        foot: [
                            [
                                { content: 'TOTAL', styles: { fontStyle: 'bold', textColor: 'red', halign: 'center' } },
                                { content: '', colSpan: 6 },
                                {
                                    content: data
                                        .reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0)
                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                    styles: { fontStyle: 'bold', textColor: 'red', halign: 'right', fillColor: [255, 255, 255] },
                                },
                                { content: '', colSpan: 3 },
                                {
                                    content: data
                                        .reduce((sum: number, item: any) => sum + parseFloat(item.issuance_total_price), 0)
                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                    styles: { fontStyle: 'bold', textColor: 'red', halign: 'right', fillColor: [255, 255, 255] },
                                },
                                {
                                    content: data
                                        .reduce((sum: number, item: any) => sum + parseFloat(item.balance), 0)
                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                    styles: { fontStyle: 'bold', textColor: 'red', halign: 'right', fillColor: [255, 255, 255] },
                                },
                            ],
                        ],
                        styles: {
                            lineWidth: 0.5,
                            lineColor: [0, 0, 0],
                        },
                    }),
                        // save the pdf
                        doc.save('report.pdf');
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response) {
                        console.error(error.response.data);
                        console.error(error.response.status);
                        console.error(error.response.headers);
                    } else if (error.request) {
                        console.error(error.request);
                    } else {
                        console.error('Error', error.message);
                    }
                    console.error(error.config);
                });
        }
    };

    // console.log(RIS_number);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Process Voucher</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Make a form that fetches RIS data */}
                                    <form onSubmit={submit}>
                                        {/* Input Field */}
                                        <input
                                            className="w-full rounded border border-gray-300 p-2"
                                            type="text"
                                            id="RIS_number"
                                            name="RIS_number"
                                            required
                                            list="RIS_number_options"
                                        />

                                        {/* Datalist for Suggestions */}
                                        <datalist id="RIS_number_options">
                                            {Array.isArray(RIS_number) && RIS_number.length > 0 ? (
                                                RIS_number.map((item, index) => (
                                                    <option key={index} value={typeof item === 'object' ? item.RIS_number : item} />
                                                ))
                                            ) : (
                                                <option value={typeof RIS_number === 'string' ? RIS_number : ''} />
                                            )}
                                        </datalist>

                                        {/* Submit Button */}
                                        <Button type="submit">Process</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="w-full flex-1 bg-green-500 text-white">
                                <CardHeader>
                                    <CardTitle>Card title</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed,
                                        convallis ex.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="absolute inset-0 flex flex-col p-4">
                            <Card className="w-full flex-1 bg-red-500 text-white">
                                <CardHeader>
                                    <CardTitle>Card title</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed,
                                        convallis ex.
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
