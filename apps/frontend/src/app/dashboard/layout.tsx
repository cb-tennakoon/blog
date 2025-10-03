'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Fix: Added useState for isLoading

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on mount:', token); // Debug token
    if (!token) {
      router.push('/login');
      return;
    }
    // Verify token with backend
    const verifyToken = async () => {
      try {
        const res = await axios.post('http://localhost:5678/auth/verify', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Verify response:', res.data); // Debug success
        setIsLoading(false);
      } catch (err: any) {
        console.error('Token verification failed:', err.response?.data, err.message);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };
    const timer = setTimeout(verifyToken, 100); // Delay to avoid race condition
    return () => clearTimeout(timer);
  }, [router]);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5678/auth/logout', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Logout successful');
      }
      localStorage.removeItem('token');
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err.response?.data, err.message);
      localStorage.removeItem('token'); // Clear token even if request fails
      window.location.href = '/login'; // Force full reload
      router.push('/login');
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar with Logout Button */}
          <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Blog Dashboard</h2>
              <nav>
                <ul>
                  <li className="mb-4">
                    <Link href="/dashboard" className="hover:text-gray-300">Home</Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/dashboard/profile" className="hover:text-gray-300">Profile</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </aside>
            {children}
        </div>
  );
}