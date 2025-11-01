import Link from "next/link";
import TableNote from "@/components/TableNote";
import { ArrowLeft } from "lucide-react";

export default async function NotesList() {
  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between mb-2">
          <h1 className="text-xl font-bold mb-4">📝 Notes List</h1>
          <Link
            href={`/`}
            className="flex p-3 border-amber-300 border w-[100px]"
          >
            <ArrowLeft />
            Back
          </Link>
        </div>

        <div>
          <h1>Notes List</h1>
          <TableNote />
        </div>
      </div>
    </div>
  );
}
