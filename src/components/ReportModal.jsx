import Modal from './Modal';
import { motion } from 'framer-motion';

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

import { useState, useMemo } from 'react';

const ReportModal = ({ isOpen, onClose, shipments = [] }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (startDate && new Date(s.date) < new Date(startDate)) return false;
      if (endDate && new Date(s.date) > new Date(endDate)) return false;
      return true;
    });
  }, [shipments, statusFilter, startDate, endDate]);

  const preview = filtered.slice(0, 50);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report Preview (${filtered.length} rows)`}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-textSecondary">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-textSecondary">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <label className="text-sm text-textSecondary">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3 hidden md:table-cell">Route</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 hidden lg:table-cell">Date</th>
                <th className="py-2 px-3 hidden xl:table-cell">Value</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((s) => (
                <tr key={s.id} className="border-b hover:bg-card">
                  <td className="py-2 px-3">{s.id}</td>
                  <td className="py-2 px-3">{s.client}</td>
                  <td className="py-2 px-3 hidden md:table-cell">{s.origin} → {s.destination}</td>
                  <td className="py-2 px-3">{s.status}</td>
                  <td className="py-2 px-3 hidden lg:table-cell">{s.date}</td>
                  <td className="py-2 px-3 hidden xl:table-cell">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={() => buildCSVAndDownload(filtered)} className="px-4 py-2 bg-primary text-white rounded-lg">Download CSV</button>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
