import type { InboxItem } from "@/app/generated/prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InboxTable({ items }: { items: InboxItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Text</TableHead>
          <TableHead className="w-48">Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="wrap-break-word whitespace-normal">
              {item.text}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.createdAt.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-center text-muted-foreground"
            >
              No items yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
