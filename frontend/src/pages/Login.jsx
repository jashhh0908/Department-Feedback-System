import axios from 'axios';
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { setUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginUser = async(e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password
      });
      setUser(data.userInfo);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      console.log(data);
      if(data.userInfo.role === 'admin' || data.userInfo.role === 'super-admin')
        navigate('/dashboard');
      else {
        navigate('/my-forms');
      }
      toast.success(`Welcome, ${data.userInfo.name}`);
    } catch (error) {
      toast.error("Login Failed")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
    <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
      <h1 className="text-3xl font-semibold text-center text-teal-400 mb-6">
        Login
      </h1>
      <form className="space-y-5" onSubmit={loginUser}>
        <div>
          <label >Email: </label> <br />
          <input 
              type="email"
              placeholder='Email'
              value={email}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
          /> <br></br>
        </div>

        <div>
          <label>Password:</label> <br />
          <input 
              type='password'
              placeholder='Password'
              value={password}
               className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
          /><br />
        </div>

          <button 
            type='submit'
            className="w-full bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-semibold transition shadow-md"
          >
            Login
          </button>
      </form>
    </div>
    </div>
  )
}

export default Login