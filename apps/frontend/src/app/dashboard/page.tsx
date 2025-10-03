'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BlogsPage(){
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchPosts = async () => {
      try{
        const res = await axios.get('http://localhost:5678/posts',{
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Posts response:',res.data);
        setPosts(res.data);
        setIsLoading(false);
      }catch (err: any){
        console.error('Posts fetch failed:',{
          status:err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError('Failed to load posts: ' + (err.response?.data?.message || err.message));
        setIsLoading(false);
      }
    }
    const timer = setTimeout(fetchPosts,100);
    return () => clearTimeout(timer);
  },[router]);

  if(isLoading){
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Blog Posts</h1>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-lg">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.postId}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <p className="text-sm text-gray-500 mb-2">Status: {post.status}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}