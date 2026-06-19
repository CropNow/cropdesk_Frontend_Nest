import React from "react";

export interface TableProps {
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
}

export const Table: React.FC<TableProps> = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-100 border-b">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left font-semibold">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
