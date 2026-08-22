import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/admin" className="hover:text-blue-400">
          Dashboard
        </Link>
        <Link href="/admin/articles" className="hover:text-blue-400">
          Articles
        </Link>
        <Link href="/admin/categories" className="hover:text-blue-400">
          Categories
        </Link>
        <Link href="/admin/users" className="hover:text-blue-400">
          Users
        </Link>
        <Link href="/" className="hover:text-blue-400">
          View Site
        </Link>
      </nav>
    </aside>
  );
}
