import React, { useEffect, useState } from 'react';
import { User, Appointment } from './types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App(){
  const [email, setEmail] = useState<string>('');
  const [userType, setUserType] = useState<string>('affiliated');
  const [desc, setDesc] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [msg, setMsg] = useState<string>('');

  useEffect(()=>{
    fetch(`${API}/api/appointments`).then(r=>r.json()).then(d=>setAppointments(d)).catch(()=>{});
  },[]);

  const login = async (e: React.FormEvent) => {
  e.preventDefault();
  if(!email) return setMsg('Enter email');
  console.log("Trying login with", email, userType); // 👈 Add this line

  const res = await fetch(`${API}/api/auth/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, userType })
  });

  const data = await res.json();
  console.log("Response from server:", data); // 👈 Add this too
  if(res.ok) { setUser(data.user); setMsg('Logged in'); }
  else setMsg(data.message || 'Login failed');
};


  const create = async ()=>{
    if(!user) return setMsg('Login first');
    const res = await fetch(`${API}/api/appointments`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: user.email, description: desc })
    });
    const data = await res.json();
    if(res.ok){ setAppointments(prev => [data.appointment, ...prev]); setDesc(''); setMsg('Created'); }
    else setMsg(data.message || 'Error');
  };

  return (
    <div style={{fontFamily:'Arial',padding:20}}>
      <h2>Appointment Scheduler</h2>
      <div style={{display:'flex',gap:20}}>
        <form onSubmit={login} style={{minWidth:300}}>
          <h3>Login</h3>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' style={{width:'100%',padding:8,marginBottom:8}} />
          <select value={userType} onChange={e=>setUserType(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}>
            <option value='admin'>admin</option>
            <option value='internal user'>internal user</option>
            <option value='external user'>external user</option>
          </select>
          <button type='submit' style={{padding:10}}>Login</button>
        </form>
        <div style={{flex:1}}>
          <h3>Create Appointment</h3>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder='description' style={{width:'100%',padding:8}} />
          <div style={{marginTop:8}}>
            <button onClick={create} style={{padding:10}}>Create (must login)</button>
          </div>
          <div style={{marginTop:12,color:'green'}}>{msg}</div>
          <hr style={{margin:'12px 0'}} />
          <h3>All Appointments</h3>
          <ul>
            {appointments.map(a=> (
              <li key={(a as any)._id} style={{marginBottom:8}}>
                <strong>{a.user.email}</strong> ({a.user.userType}) — {a.description} <br/>
                <small>{new Date(a.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
