import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  key: string
  align?: 'left' | 'right' | 'center'
  render?: (row: T) => ReactNode
  width?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
}

export function Table<T>({ columns, rows, rowKey, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-border bg-surface-low">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`px-4 py-3 text-label uppercase tracking-wider text-ink-muted ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-border-subtle last:border-b-0 ${
                onRowClick ? 'cursor-pointer transition-colors hover:bg-surface-high' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-ink ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
