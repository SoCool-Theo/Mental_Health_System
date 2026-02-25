'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../styles/AdminDashboard.css'; 

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  // --- SIGN OUT LOGIC ---
  const handleSignOut = () => {
    // 1. Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // 2. Redirect to Main Homepage
    router.push('/'); 
  };

  return (
    <div className="admin-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand-title">LYFE</div>
        
        <nav style={{ flex: 1 }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${pathname === '/admin/dashboard' ? 'active' : ''}`}>
              <span></span> Dashboard
            </div>
          </Link>

          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${pathname.includes('/users') ? 'active' : ''}`}>
              <span></span> Users
            </div>
          </Link>

          <Link href="/admin/configurations" style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${pathname.includes('/configurations') ? 'active' : ''}`}>
              <span></span> Configurations
            </div>
          </Link>
        </nav>

        {/* --- UPDATED SIGN OUT BUTTON --- */}
        <div 
          onClick={handleSignOut} // Attached Click Event
          className="nav-item" 
          style={{ marginTop: 'auto', border: '1px solid #666', justifyContent: 'center', cursor: 'pointer' }}
        >
           → Sign Out
        </div>
        
      </aside>

      {/* MAIN CONTENT SHELL */}
      <main className="main-content">
        {children}
      </main>

    </div>
  );
}