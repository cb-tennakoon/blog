'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../../../lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

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

export default function PostDetailPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Fetch current post
  const { data: post, isLoading: postLoading, error: postError } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5678/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Post response:', res.data);
      return res.data;
    },
    enabled: !!token && !!id,
  });

  // Fetch all posts for navigation
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5678/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Posts response:', res.data);
      return res.data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // Find previous and next post IDs
  const currentPostIndex = posts?.findIndex((p) => p.postId === Number(id)) ?? -1;
  const prevPost = currentPostIndex > 0 ? posts?.[currentPostIndex - 1] : null;
  const nextPost = currentPostIndex >= 0 && currentPostIndex < (posts?.length ?? 0) - 1 ? posts?.[currentPostIndex + 1] : null;

  if (postLoading || postsLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="text-gray-600 text-lg animate-pulse">Loading post...</div>
      </div>
    );
  }

  if (postError || postsError) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          Error: {((postError || postsError) as any)?.message}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          Post not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="flex space-x-4">
            <Link
              href={`/dashboard/posts/${id}/edit`}
              className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              Edit Post
            </Link>
            <Link
              href="/dashboard/posts"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Back to Posts
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Slug: {post.slug}</p>
          <p className="text-sm text-gray-500">Status: {post.status}</p>
          <p className="text-sm text-gray-500">
            Created: {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {post.publishedAt && (
            <p className="text-sm text-gray-500">
              Published: {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Content</h2>
            <div className="prose prose-lg text-gray-700">
              {post.content ? (
                <p>{post.content}</p>
              ) : (
                <p className="text-gray-500 italic">No content available</p>
              )}
            </div>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="mt-8 flex justify-between">
          <div>
            {prevPost && (
              <Link
                href={`/dashboard/posts/${prevPost.postId}`}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Previous Post
              </Link>
            )}
          </div>
          <div>
            {nextPost && (
              <Link
                href={`/dashboard/posts/${nextPost.postId}`}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Next Post
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}