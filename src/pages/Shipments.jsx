import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import { useAppState } from '../context/AppContext';

const Shipments = ({ user, onLogout }) => {
  const state = useAppState();
  const shipments = state?.shipments || [];

  return (
    <div className="min-h-screen bg-card overflow-x-hidden">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col md:flex-row">
        <Sidebar activeItem={'Shipments'} setActiveItem={() => {}} />
  <main className="flex-1 p-6 md:ml-64">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Shipments</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-textSecondary">This is the Shipments page. Use the dashboard to manage shipments.</p>
            <div className="mt-4">
              <ul className="space-y-2">
                {shipments.map(s => (
                  <li key={s.id} className="border-b py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-textPrimary">{s.id} — {s.name}</div>
                        <div className="text-textSecondary text-sm">{s.client} • {s.origin} → {s.destination}</div>
                      </div>
                      <div className="text-sm text-textSecondary">{s.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shipments;
