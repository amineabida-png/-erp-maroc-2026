import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50"
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {/* Icon placeholder */}
          <div className="w-5 h-5 border-2 border-current rounded-full" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-semibold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-slate-400 ml-2">vs mois dernier</span>
      </div>
    </Card>
  );
};

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Tableau de Bord</h1>
        <p className="text-slate-500 text-sm sm:text-base">Bienvenue sur votre ERP Maroc 2026</p>
      </header>

      {/* KPI Grid - Responsive Grid Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard title="Chiffre d'Affaires" value="124,500 DH" trend="+12.5%" color="blue" />
        <StatCard title="Masse Salariale" value="45,200 DH" trend="+2.1%" color="red" />
        <StatCard title="TVA à Décaisser" value="18,400 DH" trend="-5.4%" color="amber" />
        <StatCard title="Trésorerie" value="342,000 DH" trend="+8.3%" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Invoices - Horizontal Scroll on Mobile */}
        <Card className="lg:col-span-2 overflow-hidden">
          <h3 className="text-lg font-bold mb-4">Dernières Factures</h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-3 font-medium">N° Facture</th>
                  <th className="py-3 font-medium">Client</th>
                  <th className="py-3 font-medium">Montant TTC</th>
                  <th className="py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-semibold text-slate-700">FAC-2026-00045</td>
                  <td className="py-4 text-sm text-slate-600">Client OCP</td>
                  <td className="py-4 text-sm font-medium">15,600 DH</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs font-bold">PAYÉE</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-semibold text-slate-700">FAC-2026-00046</td>
                  <td className="py-4 text-sm text-slate-600">Client Marjane</td>
                  <td className="py-4 text-sm font-medium">8,400 DH</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] sm:text-xs font-bold">ATTENTE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions / OCR AI - Stacked on small screens */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-bold mb-4">Actions Rapides</h3>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4">
            <button className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all text-sm shadow-lg shadow-blue-200">
              Nouvelle Facture
            </button>
            <button className="flex-1 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 active:scale-95 transition-all text-sm">
              Pointage Salariés
            </button>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-3">Scan IA (OCR)</p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">Ajouter une facture</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">PDF, JPG ou PNG</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
