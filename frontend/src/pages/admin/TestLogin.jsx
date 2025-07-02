import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TestLogin = () => {
  const [email, setEmail] = useState('prashanth@gmail.com')
  const [password, setPassword] = useState('prashanth123')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    // Simple hardcoded login
    if (email === 'prashanth@gmail.com' && password === 'prashanth123') {
      // Store auth token or user info in localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Prashanth Nimmala',
        email: 'prashanth@gmail.com',
        role: 'admin'
      }))
      
      setMessage('Login successful! Redirecting to admin dashboard...')
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin')
      }, 2000)
    } else {
      setMessage('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Login Page</h1>
        
        {message && (
          <div className={`p-4 mb-4 rounded ${
            message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
        
        <div className="mt-4 text-center">
          <p>Default credentials:</p>
          <p>Email: prashanth@gmail.com</p>
          <p>Password: prashanth123</p>
        </div>
      </div>
    </div>
  )
}

export default TestLogin