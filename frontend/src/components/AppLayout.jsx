"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Receipt, Users, Briefcase, FileSearch, Search, Bell, ChevronDown, Menu, X } from 'lucide-react';

export default function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="text-xl font-bold text-brand-600">MAROC ERP 2026</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Tableau de Bord" active />
          <NavItem icon={Receipt} label="Ventes & Facturation" />
          <NavItem icon={Users} label="RH & Paie" />
          <NavItem icon={Briefcase} label="Comptabilité" />
          <NavItem icon={FileSearch} label="Scan IA / OCR" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une facture, un client..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">AB</div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-brand-50 text-brand-600 font-medium' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </a>
  );
}
