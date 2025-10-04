'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Post {
  postId: number;
  title: string;
  slug: string;
  content: string | null;
  status: string;
  createdAt: string;
  authorId: number;
  publishedAt?: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default: 5 items per page

  // Fetch posts (existing logic)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5678/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Posts response:', res.data);
        setPosts(res.data);
        setIsLoading(false);
        setCurrentPage(1); // Reset to first page on new data
      } catch (err: any) {
        console.error('Posts fetch failed:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError('Failed to load posts: ' + (err.response?.data?.message || err.message));
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchPosts, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Pagination logic
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="text-gray-600 text-lg animate-pulse">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
          <Link
            href="/dashboard/posts/create"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No posts found.</p>
            <Link
              href="/dashboard/posts/create"
              className="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentPosts.map((post) => (
                <Link href={`/dashboard/posts/${post.postId}`} key={post.postId}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content || 'No content available'}</p>
                    <p className="text-sm text-gray-500 mb-2">Status: {post.status}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    {post.publishedAt && (
                      <p className="text-sm text-gray-500">
                        Published: {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                    Show
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                  <span className="text-sm text-gray-700">
                    per page
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, posts.length)} of {posts.length} posts
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                      isFirstPage
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show ellipsis for middle pages
                      if (totalPages > 5 && page > 3 && page < totalPages - 1) {
                        if (page === 4) return <span key={page} className="px-2">...</span>;
                        if (page === totalPages - 1) return <span key={page} className="px-2">...</span>;
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition duration-200 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                      isLastPage
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}