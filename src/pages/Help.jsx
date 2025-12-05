import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/storage';
import FAQ from '../components/FAQ';

const Help = ({ user, onLogout }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    setCurrent(getCurrentUser());
  }, []);

  const faqItems = [
    { q: 'How do I create a new shipment?', a: 'Go to Dashboard and click "+ Add" or use the File New Shipment quick action. Fill the form and submit.' },
    { q: 'How can I track a shipment?', a: 'Use the Track Shipment quick action on the Dashboard or open the Shipments list and click View for a shipment.' },
    { q: 'How do I export my shipments?', a: 'Use the Generate Report button on the Dashboard — it downloads a CSV of the current filtered list.' },
    { q: 'How do I contact support?', a: 'Click Contact Support in Quick Actions, or send an email to support@neximprove.example.' },
  ];

  return (
    <div className="min-h-screen bg-card overflow-x-hidden">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col md:flex-row">
        <Sidebar activeItem={'Help & Adjust'} setActiveItem={() => {}} />
  <main className="flex-1 p-6 md:ml-64">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Help & Adjust</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-textSecondary">Help articles, FAQs, and adjustment settings will appear here.</p>
            <div className="mt-4">
              <FAQ items={faqItems} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
