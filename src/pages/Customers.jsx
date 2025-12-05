import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { getCurrentUser, getShipments } from '../utils/storage';

const Customers = ({ user, onLogout }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    setCurrent(getCurrentUser());
  }, []);

  // derive importers/exporters from shipments
  const shipments = getShipments();
  const importers = [];
  const exporters = [];
  shipments.forEach(s => {
    const name = s.client || 'Unknown';
    const role = s.clientRole || 'Importer';
    if (role === 'Importer' && !importers.includes(name)) importers.push(name);
    if (role === 'Exporter' && !exporters.includes(name)) exporters.push(name);
  });

  return (
    <div className="min-h-screen bg-card overflow-x-hidden">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col md:flex-row">
        <Sidebar activeItem={'Customers'} setActiveItem={() => {}} />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Customers (Importers / Exporters)</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-textSecondary">This is a placeholder for customer management (importers & exporters).</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Importers</h4>
                {importers.length === 0 ? (
                  <p className="text-textSecondary">No importers yet</p>
                ) : (
                  <ul className="list-disc list-inside text-sm">
                    {importers.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                )}
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Exporters</h4>
                {exporters.length === 0 ? (
                  <p className="text-textSecondary">No exporters yet</p>
                ) : (
                  <ul className="list-disc list-inside text-sm">
                    {exporters.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;
