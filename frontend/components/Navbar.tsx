"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 1. Imported the Briefcase icon for the portfolio link
import { Brush, Menu, X, Github, Linkedin, LogOut, Briefcase } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  // 2. Added your portfolio to the socialLinks array
  const socialLinks = [
    { href: "https://github.com/akshat99812", label: "GitHub", icon: Github },
    { href: "https://linkedin.com/in/your-profile", label: "LinkedIn", icon: Linkedin },
    { href: "https://your-portfolio.com", label: "Portfolio", icon: Briefcase }, // <-- Add your portfolio URL here
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-3 mt-4 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Brush className="w-7 h-7 text-cyan-400" />
            <span>Draw It</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors">
                <Icon className="w-6 h-6" />
                <span className="sr-only">{label}</span>
              </a>
            ))}

            {isLoggedIn ? (
              <>
                <button onClick={handleSignOut} className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="px-5 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-700">
            <div className="flex flex-col items-center space-y-4">
              {isLoggedIn ? (
                <>
                  <Link href="/draw" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-5 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300">
                    Go to Canvas
                  </Link>
                   <button onClick={handleSignOut} className="text-slate-300 hover:text-cyan-400 transition-colors py-2 flex items-center space-x-2">
                     <LogOut className="w-5 h-5" />
                     <span>Sign Out</span>
                   </button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors py-2">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-5 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300">
                    Sign Up
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-6 pt-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors">
                    <Icon className="w-7 h-7" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}