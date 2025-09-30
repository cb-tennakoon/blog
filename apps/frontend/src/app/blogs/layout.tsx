'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5678/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Logout successful');
      }
      localStorage.removeItem('token');
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err.response?.data, err.message);
      localStorage.removeItem('token'); // Clear token even if request fails
      router.push('/login');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <button onClick={handleLogout}>Logout</button>
        <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      </nav>
      {children}
      <p>wee</p>
    </main>
  );
}