"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Hash ,PlusCircle} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Config } from '@/config';
 

export default function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

 const handleJoinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 

    const roomName = roomCode.trim();
    if (!roomName) {
        setError('Room name cannot be empty.');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/signin');
        return;
    }
    const safeRoomName = encodeURIComponent(roomName);

    try {
        const response = await axios.get(
            `${Config.URL}/api/v1/room/${safeRoomName}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
        ); 
        if (response.status === 200) {
            const roomId = response.data.room.id;
            router.push(`/draw/${roomId}`);
        }

    } catch (err) {
        console.error("Error joining room:", err);
        if (axios.isAxiosError(err) && err.response) {
            
            if (err.response.status === 404) {
                setError('This room does not exist. Check the name or create a new one.');
            } else {
              
                setError(err.response.data.message || 'An unexpected server error occurred.');
            }
        } else {
            setError('An network error occurred. Please try again.');
        }
    }
};

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 

    const roomName = newRoomName.trim();
    if (!roomName) {
        setError('Room name cannot be empty.');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/signin');
        return;
    }

    try {
        const response = await axios.post(
        `${Config.URL}/api/v1/room`, 
        { name: roomName }, 
        {
            headers: {
            'Authorization': `Bearer ${token}`
            },
        }
        );
        if (response.status === 201 || response.status === 200) {
            const roomId = response.data.roomId;
            router.push(`/draw/${roomId}`);
        } else {
            setError('Failed to create the room. Please try again.');
        }

    } catch (err) {
        console.error("Error creating room:", err);
        if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An unexpected error occurred.');
        } else {
        setError('An unexpected error occurred. Please try again.');
        }
    }
    };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-grow w-full px-4 text-center z-10 pt-32">
        <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2, // Time delay between each child animating in
                },
                },
            }}
            >
            <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
                variants={{
                hidden: { opacity: 0, y: 20 }, // Start invisible and 20px down
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }, // Fade in and slide up
                }}
            >
                Unleash Creativity, Together
            </motion.h1>
            <motion.p
                className="max-w-2xl mt-4 text-lg text-slate-400"
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
            >
                Your real-time collaborative canvas. Sketch ideas, create art, and brainstorm with friends or colleagues from anywhere in the world.
            </motion.p>
            </motion.div>
        <div className="w-full max-w-2xl p-8 mt-12 space-y-8 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Join Room Section */}
            <div className="flex flex-col space-y-4">
              <div className='flex items-center justify-center md:justify-start space-x-2'>
                <Users className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Join a Room</h2>
              </div>
              <form onSubmit={handleJoinRoom} className="flex flex-col space-y-3">
                <div className="relative">
                  <Hash className="absolute w-5 h-5 top-3.5 left-3 text-slate-400" />
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter Room Code"
                    className="w-full pl-10 pr-4 py-2.5 text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500 transition-colors"
                  />
                </div>
                <button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-bold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-colors duration-300">
                  Join Collaborative Canvas
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative md:hidden">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/60 text-slate-500">OR</span>
              </div>
            </div>

            {/* Create Canvas Section */}
<div className="flex flex-col space-y-4 text-center md:text-left md:border-l md:border-slate-700 md:pl-8">
    <h2 className="text-xl font-semibold text-white">Create a New Canvas</h2>
    <p className='text-slate-400'>
      Name your room.
    </p>

        <form onSubmit={handleCreateRoom} className="flex flex-col space-y-3">
            <div className="relative">
                {/* You will need to import the PlusCircle icon */}
                <PlusCircle className="absolute w-5 h-5 top-3.5 left-3 text-slate-400" />
                <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter a new room name"
                className="w-full pl-10 pr-4 py-2.5 text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500 transition-colors"
                required
                />
            </div>
            <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 font-bold text-white bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-colors duration-300"
            >
                Create & Go <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            </form>
    </div>

          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} Draw It. All rights reserved.</p>
      </footer>
    </div>
  );
}