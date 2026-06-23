import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type Project = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  domain: string[];
  duration_months: number;
  methodology: string;
  key_findings: string;
  participants: number;
  url: string;
};

const columnHelper = createColumnHelper<Project>();

const columns = [
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('authors', {
    header: 'Authors',
    cell: (info) => info.getValue().join(', '),
  }),
  columnHelper.accessor('year', { header: 'Year' }),
  columnHelper.accessor('domain', {
    header: 'Domain',
    cell: (info) => info.getValue().join(', '),
  }),
  columnHelper.accessor('duration_months', { header: 'Duration (mo)' }),
  columnHelper.accessor('methodology', { header: 'Methodology' }),
  columnHelper.accessor('participants', { header: 'Participants' }),
  columnHelper.accessor('url', {
    header: 'Link',
    cell: (info) =>
      info.getValue() ? (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View →
        </a>
      ) : (
        '—'
      ),
  }),
];

export default function DataTable({ projects }: { projects: Project[] }) {
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={columns.length}>
                No projects match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
