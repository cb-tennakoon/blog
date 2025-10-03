'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface Author {
  authorId: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  role?: { id: string; name: string } | null;
}

interface UpdateAuthorForm {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdateAuthorForm>();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: author, isLoading, error } = useQuery<Author>({
    queryKey: ['authorProfile'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5678/author/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAuthorForm) =>
      axios.put('http://localhost:5678/author/profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorProfile'] });
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: UpdateAuthorForm) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-gray-600 text-lg animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          Error loading profile: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {author && (
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    defaultValue={author.firstName || ''}
                    {...register('firstName', { required: 'First name is required' })}
                    className={`mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    defaultValue={author.lastName || ''}
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={author.email || ''}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`mt-1 w-full border rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className={`flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 ${
                      updateMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-500 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-lg font-semibold text-gray-800">{author.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg text-gray-800">{author.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-lg text-gray-800">{author.firstName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-lg text-gray-800">{author.lastName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-lg text-gray-800">{author.role?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-lg text-gray-800">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setValue('firstName', author.firstName || '');
                      setValue('lastName', author.lastName || '');
                      setValue('email', author.email || '');
                    }}
                    className="flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                    Edit Profile
                  </button>
                  {/* <Link
                    href="/dashboard"
                    className="flex-1 text-center bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    View My Posts
                  </Link> */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}