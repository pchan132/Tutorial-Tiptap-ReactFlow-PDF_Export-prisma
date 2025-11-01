import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen gap-1.5">
      <Link href="/test-note" className="p-4 bg-gray-900 max-w-2xl text-white">
        New Post
      </Link>
      <Link href="/notelist" className="p-4 bg-gray-900 max-w-2xl text-white">
        Notes List
      </Link>
    </div>
  );
}
