import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Reports = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-card">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar activeItem={'Reports'} setActiveItem={() => {}} />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Reports</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-textSecondary">Reports are coming soon. This is a placeholder page.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
