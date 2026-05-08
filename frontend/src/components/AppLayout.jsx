import React, { useState } from 'react';

export default function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white p-6">
        <div className="text-2xl font-bold text-emerald-400 mb-10 tracking-tight">MAROC ERP 2026</div>
        <nav className="space-y-4">
          <NavLink href="#" active>Dashboard</NavLink>
          <NavLink href="#">Ventes & Facturation</NavLink>
          <NavLink href="#">RH & Paie</NavLink>
          <NavLink href="#">Comptabilité</NavLink>
          <NavLink href="#">Scan IA / OCR</NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header / Top Nav - Mobile & Desktop */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="lg:hidden text-lg font-bold text-slate-900">MAROC ERP</div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold">Amine Bensouda</div>
              <div className="text-xs text-slate-500">Administrateur</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              AB
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 p-6 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="text-xl font-bold text-emerald-400">MAROC ERP</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-4 flex-1">
              <NavLink href="#" active mobile>Dashboard</NavLink>
              <NavLink href="#" mobile>Ventes & Facturation</NavLink>
              <NavLink href="#" mobile>RH & Paie</NavLink>
              <NavLink href="#" mobile>Comptabilité</NavLink>
              <NavLink href="#" mobile>Scan IA / OCR</NavLink>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, children, active, mobile }) {
  return (
    <a 
      href={href} 
      className={`block px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${mobile ? 'text-lg py-3' : 'text-sm'}`}
    >
      {children}
    </a>
  );
}
