import Link from "next/link";

import StartNode from "@/components/custom-nodes/StartNode";
import ProcessNode from "@/components/custom-nodes/ProcessNode";
import DecisionNode from "@/components/custom-nodes/DecisionNode";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen gap-1.5">
      <Link
        href="/documents"
        className="p-4 bg-yellow-500 max-w-2xl text-white"
      >
        Note
      </Link>

      <Link href="/test-note" className="p-4 bg-gray-900 max-w-2xl text-white">
        New Post
      </Link>
      <Link href="/notelist" className="p-4 bg-gray-900 max-w-2xl text-white">
        Notes List
      </Link>
      <Link href="/flowai" className="p-4 bg-purple-500 max-w-2xl text-white">
        Flow Chart AI Builder
      </Link>
      <Link
        href="/flowchart"
        className="p-4 bg-orange-500 max-w-2xl text-white"
      >
        Flow Chart test
      </Link>
      <Link href="/flowCourse" className="p-4 bg-blue-500 max-w-2xl text-white">
        Flow Chart Course
      </Link>
      <Link
        href="/flowElectric"
        className="p-4 bg-red-500 max-w-2xl text-white"
      >
        Flow Chart Electric
      </Link>
    </div>
  );
}
