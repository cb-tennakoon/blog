// 'use client';
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function Login() {
//   const [emailOrUsername, setEmailOrUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!emailOrUsername || !password) {
//       setError('Please enter both email/username and password');
//       setLoading(false);
//       return;
//     }
//     if (password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:5678/auth/login', {
//         emailOrUsername,
//         password,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });
//       console.log(emailOrUsername, password);
//       localStorage.setItem('token', res.data.access_token);
//       router.push('/blogs');
//     } catch (err) {
//       console.error('Login error:', err.response?.data, err.message);
//       if (err.response?.status === 401) {
//         setError('Invalid username/email or password');
//       } else if (err.response?.status === 400) {
//         const errorMessage = err.response?.data?.message
//           ? Array.isArray(err.response.data.message)
//             ? err.response.data.message.join(', ')
//             : err.response.data.message
//           : 'Bad request: Check your input';
//         setError(errorMessage);
//       } else {
//         setError('Failed to connect to server: ' + err.message);
//       }
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;20&quot; height=&quot;20&quot; viewBox=&quot;0 0 20 20&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;3&quot; cy=&quot;3&quot; r=&quot;3&quot;/%3E%3Ccircle cx=&quot;17&quot; cy=&quot;17&quot; r=&quot;3&quot;/%3E%3C/g%3E%3C/svg%3E')]"></div>

//       <div className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transform transition-all hover:scale-105 duration-300">
//         {/* Logo/Branding */}
//         <div className="flex justify-center mb-6">
//           <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             MyBlog
//           </div>
//         </div>

//         <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">Welcome Back</h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="relative">
//             <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-300 mb-1">
//               Email or Username
//             </label>
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//               <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <input
//               id="emailOrUsername"
//               type="text"
//               value={emailOrUsername}
//               onChange={(e) => setEmailOrUsername(e.target.value)}
//               placeholder="Enter email or username"
//               className="w-full pl-10 p-3 bg-gray-800 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
//               disabled={loading}
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
//               Password
//             </label>
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//               <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m0 0H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v4a4 4 0 01-4 4h-5m0 0v4" />
//               </svg>
//             </div>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               className="w-full pl-10 p-3 bg-gray-800 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
//               disabled={loading}
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 transform ${
//               loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
//             }`}
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//                 </svg>
//                 Logging in...
//               </span>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>

//         {error && (
//           <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-center animate-fade-in">
//             {error}
//           </div>
//         )}

//         <p className="mt-4 text-center text-sm text-gray-400">
//           Don&apos;t have an account?{' '}
//           <a href="/signup" className="text-blue-400 hover:underline">
//             Sign Up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


'use client';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';

interface LoginForm {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.identifier, data.password);
      // Redirect handled by AuthContext
    } catch (error) {
      alert('Login failed: Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="identifier" className="block">Email or Username</label>
          <input
            id="identifier"
            type="text"
            {...register('identifier', { required: 'Email or Username is required' })}
            className="w-full border p-2 rounded"
          />
          {errors.identifier && <p className="text-red-500">{errors.identifier.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 8 characters' } })}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}