import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const categories = await prisma.category.findMany({ take: 6 });

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          NewsPortal
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-blue-400"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/search" className="hover:text-blue-400">
            Search
          </Link>

          {session ? (
            <>
              {(session.user as any).role === "ADMIN" && (
                <Link href="/admin" className="hover:text-blue-400">
                  Admin
                </Link>
              )}
              <span className="text-gray-300">{session.user?.name}</span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="hover:text-blue-400">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
