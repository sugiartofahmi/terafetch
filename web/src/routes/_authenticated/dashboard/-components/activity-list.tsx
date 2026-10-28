import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { TDashboardActivity } from '@/apis/dashboard/dashboard.type'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columns: Array<ColumnDef<TDashboardActivity>> = [
  {
    accessorKey: 'title',
    header: 'Activity',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
]

type TActivityListProps = {
  activities: Array<TDashboardActivity>
  isLoading: boolean
  isEmpty: boolean
}

export const ActivityList = ({
  activities,
  isLoading,
  isEmpty,
}: TActivityListProps) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: activities,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading activity...
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No activity yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
