import { useState, useEffect } from 'react';
import './login.css';
import { supabase } from './supabaseClient';

const Task = ({ onlogginsuccess }) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        if (onlogginsuccess) onlogginsuccess();
      }
    };
    getUser();
  }, [onlogginsuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1Login user
  

    const { data, error } = await supabase.auth.signUp({
      email: Email,
      password: Password
    });
    

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setUser(data.user);
    if (onlogginsuccess) onlogginsuccess();

    // 2️⃣ Insert or update user in 'users' table
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .upsert([{ email: Email, last_login: new Date() }], { onConflict: 'email' });

    if (dbError) {
      console.error('Database error:', dbError);
    } else {
      console.log('Database entry:', dbData);
    }

    setLoading(false);
  };

  if (user) {
    return <h2>You are logged in with Supabase 🎉</h2>;
  }

  return (
    <div className='login-container'>
      <form className='login-box' onSubmit={handleSubmit}>
        <input
          className='login-input'
          type="email"
          placeholder="Enter Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <input
            className='login-input'
            type="password"
            placeholder="Enter Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='login-button'>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Task;
