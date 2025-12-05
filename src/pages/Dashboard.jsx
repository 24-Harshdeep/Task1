import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatWidget from '../components/StatWidget';
import DashboardCard from '../components/DashboardCard';
import CreateShipmentModal from '../components/CreateShipmentModal';
import ShipmentModal from '../components/ShipmentModal';
import Toast from '../components/Toast';
// Report modal removed: generate report buttons will download CSV directly
import { useAppState, useAppActions } from '../context/AppContext';

// CSV builder used by the dashboard's generate report actions
const buildCSVAndDownload = (data, filename = '') => {
  const keys = ['id', 'name', 'client', 'origin', 'destination', 'status', 'date', 'value', 'description', 'createdAt'];
  const csvRows = [];
  csvRows.push(keys.join(','));
  data.forEach((row) => {
    const vals = keys.map(k => {
      const v = row[k] == null ? '' : String(row[k]).replace(/"/g, '""');
      return `"${v}"`;
    });
    csvRows.push(vals.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `neximprove_shipments_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const Dashboard = ({ user, onLogout }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // report modal state removed; we'll export directly to CSV
  const [selectedShipment, setSelectedShipment] = useState(null);
  // compute stats from shipments with useMemo to avoid extra state updates
  // and recalculation on unrelated renders
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const state = useAppState();
  const actions = useAppActions();
  const shipments = state?.shipments || [];

  // detect mobile breakpoint and update state so sidebar and UI can adapt
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // use the stable loadShipments callback directly to avoid depending on the
  // whole `actions` object (which is recreated when state changes) and
  // causing an effect -> dispatch -> state change loop.
  const { loadShipments } = actions || {};

  useEffect(() => {
    if (typeof loadShipments === 'function') loadShipments();
  }, [loadShipments]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter(s => s.status === 'Pending').length;
    const inProgress = shipments.filter(s => s.status === 'In Progress').length;
    const completed = shipments.filter(s => s.status === 'Completed').length;

    return [
      { id: 1, title: 'Pending Shipments', value: String(pending), icon: '⏳', color: 'warning' },
      { id: 2, title: 'Completed', value: String(completed), icon: '✓', color: 'success' },
      { id: 3, title: 'In Progress', value: String(inProgress), icon: '🚢', color: 'primary' },
      { id: 4, title: 'Total Filed', value: String(total), icon: '📦', color: 'secondary' },
    ];
  }, [shipments]);

  const handleCreateShipment = (shipmentData) => {
    const result = actions.addShipment ? actions.addShipment(shipmentData) : null;
    if (result && result.success) {
      actions.loadShipments();
      setIsCreateModalOpen(false);
      setToast({ show: true, message: 'Shipment created successfully! ✅', type: 'success' });
    } else {
      setToast({ show: true, message: (result && result.message) || 'Failed to create shipment', type: 'error' });
    }
  };

  const handleViewShipment = (shipment) => {
    setSelectedShipment(shipment);
    setIsViewModalOpen(true);
  };

  const handleUpdateShipment = (id, updates) => {
    const res = actions.updateShipment ? actions.updateShipment(id, updates) : null;
    if (res && res.success) {
      actions.loadShipments();
      setToast({ show: true, message: 'Shipment updated', type: 'success' });
      setIsViewModalOpen(false);
    } else {
      setToast({ show: true, message: (res && res.message) || 'Failed to update', type: 'error' });
    }
  };

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success border-success/20';
      case 'In Progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleGenerateReport = () => {
    if (!shipments || shipments.length === 0) {
      setToast({ show: true, message: 'No shipments to export', type: 'error' });
      return;
    }

    // build filtered set based on search query so the export mirrors table filtering
    const qLocal = (searchQuery || '').trim().toLowerCase();
    const dataToExport = qLocal
      ? shipments.filter((s) => {
          return [s.id, s.name, s.client, s.origin, s.destination, s.status]
            .join(' ')
            .toLowerCase()
            .includes(qLocal);
        })
      : shipments;

    buildCSVAndDownload(dataToExport);
  };

  const handleTrackShipment = async () => {
    const id = window.prompt('Enter Shipment ID to track (e.g. SH-001):');
    if (!id) return;
    const found = shipments.find(s => s.id.toLowerCase() === id.trim().toLowerCase());
    if (!found) {
      setToast({ show: true, message: `Shipment ${id} not found`, type: 'error' });
      return;
    }
    setSelectedShipment(found);
    setIsViewModalOpen(true);
  };

  const handleContactSupport = () => {
    navigate('/help');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'File New Shipment':
        setIsCreateModalOpen(true);
        break;
      case 'Generate Report':
        handleGenerateReport();
        break;
      case 'Track Shipment':
        handleTrackShipment();
        break;
      case 'Contact Support':
        handleContactSupport();
        break;
      default:
        setToast({ show: true, message: `Action: ${action}`, type: 'info' });
    }
  };

  const filteredShipments = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) => {
      return [s.id, s.name, s.client, s.origin, s.destination, s.status]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [shipments, searchQuery]);

  return (
  <div className="min-h-screen bg-card overflow-x-hidden">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
  <Navbar user={user} onLogout={onLogout} onSearch={setSearchQuery} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      
  <div className="flex flex-col md:flex-row">
        
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg z-50"
          >
            ☰
          </button>
        )}

        
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-7xl mx-auto px-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatWidget key={stat.id} stat={stat} index={index} />
            ))}
          </div>

          
          <DashboardCard
            title="Recent Shipments"
            action={
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
                >
                  + Add
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateReport}
                  className="px-3 py-2 bg-white border border-gray-200 text-textPrimary rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Generate Report
                </motion.button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              {/* Desktop/tablet view */}
              <table className="hidden sm:table w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm">ID</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm">Client</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm hidden md:table-cell">Route</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm hidden lg:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm hidden xl:table-cell">Value</th>
                    <th className="text-left py-3 px-4 text-textSecondary font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-textSecondary">
                        No shipments found. Create your first shipment!
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.map((shipment, index) => (
                      <motion.tr
                        key={shipment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-card transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-textPrimary">{shipment.id}</span>
                        </td>
                        <td className="py-4 px-4 text-textPrimary">{shipment.client}</td>
                        <td className="py-4 px-4 text-textSecondary text-sm hidden md:table-cell">
                          {shipment.origin} → {shipment.destination}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-textSecondary text-sm hidden lg:table-cell">{shipment.date}</td>
                        <td className="py-4 px-4 text-textPrimary font-medium hidden xl:table-cell">{shipment.value}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleViewShipment(shipment)}
                            className="px-3 py-1 text-primary hover:text-secondary font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile stacked cards (no horizontal scroll at page level) */}
              <div className="sm:hidden space-y-4">
                {filteredShipments.length === 0 ? (
                  <div className="py-8 text-center text-textSecondary">No shipments found. Create your first shipment!</div>
                ) : (
                  filteredShipments.map((shipment) => (
                    <div key={shipment.id} className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-textPrimary">{shipment.id} — {shipment.name}</div>
                          <div className="text-textSecondary text-sm">{shipment.client}</div>
                        </div>
                        <div className="text-sm text-textSecondary">{shipment.status}</div>
                      </div>
                      <div className="mt-2 text-textSecondary text-sm">{shipment.origin} → {shipment.destination}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-textSecondary">{shipment.date}</div>
                        <button onClick={() => handleViewShipment(shipment)} className="text-primary text-sm font-medium">View</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DashboardCard>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Quick Actions">
              <div className="space-y-3">
                {['File New Shipment', 'Generate Report', 'Track Shipment', 'Contact Support'].map((action, index) => (
                  <motion.button
                    key={action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left px-4 py-3 bg-card hover:bg-primary/5 rounded-lg transition-all border border-gray-100"
                  >
                    <span className="text-textPrimary font-medium">{action}</span>
                  </motion.button>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Recent Activity">
              <div className="space-y-4">
                {[
                  { action: 'Shipment SH-003 updated', time: '5 min ago' },
                  { action: 'New report generated', time: '1 hour ago' },
                  { action: 'Payment received for SH-002', time: '3 hours ago' },
                  { action: 'Document verified for SH-001', time: '5 hours ago' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-textPrimary text-sm">{activity.action}</p>
                      <p className="text-textSecondary text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          </div>
          {/* close the centered responsive wrapper opened earlier */}
          </div>
        </main>
      </div>

      
      <CreateShipmentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateShipment}
      />
      
      <ShipmentModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        shipment={selectedShipment}
        onUpdate={handleUpdateShipment}
      />
    </div>
  );
};

export default Dashboard;
