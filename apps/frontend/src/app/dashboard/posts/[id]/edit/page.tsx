'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../../../../lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

interface UpdatePostForm {
  title: string;
  content?: string;
  slug: string;
  status?: 'draft' | 'published';
}

export default function EditPostPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UpdatePostForm>();
  const [successMessage, setSuccessMessage] = useState('');

  const { data: post, isLoading, error } = useQuery({
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

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('slug', post.slug);
      setValue('content', post.content || '');
      setValue('status', post.status);
    }
  }, [post, setValue]);

  const title = watch('title');

  useEffect(() => {
    if (title && !watch('slug')) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', generatedSlug);
    }
  }, [title, setValue, watch]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePostForm) =>
      axios.put(`http://localhost:5678/posts/${id}`, {
        ...data,
        publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        router.push(`/dashboard/posts/${id}`);
      }, 2000);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update post');
    },
  });

  const onSubmit = (data: UpdatePostForm) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="text-gray-600 text-lg animate-pulse">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          Error: {(error as any).message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
              className={`mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="slug"
              {...register('slug', { required: 'Slug is required', minLength: { value: 3, message: 'Slug must be at least 3 characters' } })}
              className={`mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              {...register('content')}
              className="mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition border-gray-300"
              rows={5}
              placeholder="Enter post content"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={`flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 ${
                updateMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/posts/${id}`)}
              className="flex-1 bg-gray-500 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}