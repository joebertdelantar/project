import { Link } from '@inertiajs/react';

interface LinkProps {
    active: boolean;
    label: string;
    url: string | null;
}

interface PaginationProps {
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

export const Pagination = ({ links, from, to, total }: PaginationProps) => {
    return (
        <div className="mt-4 flex items-center justify-between">
            {/* Showing the number of results */}
            <div className="text-sm text-gray-500">
                Showing {from} to {to} of {total} results
            </div>

            {/* Pagination Links */}
            <div className="flex items-center gap-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${
                            link.active ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};