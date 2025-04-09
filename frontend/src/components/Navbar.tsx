'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Stargaze</Link>
      <div className="space-x-4">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-sm underline">
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-sm underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
