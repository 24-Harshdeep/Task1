import { motion } from 'framer-motion';
import Modal from './Modal';
import { useState, useEffect } from 'react';

const ShipmentModal = ({ isOpen, onClose, shipment, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (shipment) setForm({ ...shipment });
    else setForm(null);
    setEditing(false);
  }, [shipment]);

  if (!shipment || !form) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shipment Details">
      <div className="space-y-6">
  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div className="w-full pr-4">
            {!editing ? (
              <>
                <h3 className="text-2xl font-bold text-textPrimary">{form.name}</h3>
                <p className="text-textSecondary mt-1">ID: {form.id}</p>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
                />
                <p className="text-textSecondary">ID: {form.id}</p>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {!editing ? (
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(form.status)}`}>
                {form.status}
              </span>
            ) : (
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                className="px-3 py-2 rounded-md border border-gray-200 bg-card text-textPrimary"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            )}
          </div>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Client</p>
            {!editing ? (
              <div>
                <p className="text-lg text-textPrimary font-semibold">{form.client}</p>
                {form.clientRole && <p className="text-sm text-textSecondary">{form.clientRole}</p>}
              </div>
            ) : (
              <input
                value={form.client}
                onChange={(e) => setForm((s) => ({ ...s, client: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>

          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-textSecondary">Client Role</p>
              <select value={form.clientRole || 'Importer'} onChange={(e) => setForm((s) => ({ ...s, clientRole: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary">
                <option>Importer</option>
                <option>Exporter</option>
              </select>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Shipment Value</p>
            {!editing ? (
              <p className="text-lg text-textPrimary font-semibold">{form.value}</p>
            ) : (
              <input
                value={form.value}
                onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Origin</p>
            {!editing ? (
              <p className="text-base text-textPrimary">{form.origin}</p>
            ) : (
              <input
                value={form.origin}
                onChange={(e) => setForm((s) => ({ ...s, origin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Destination</p>
            {!editing ? (
              <p className="text-base text-textPrimary">{form.destination}</p>
            ) : (
              <input
                value={form.destination}
                onChange={(e) => setForm((s) => ({ ...s, destination: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Filing Date</p>
            {!editing ? (
              <p className="text-base text-textPrimary">{form.date}</p>
            ) : (
              <input
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-textSecondary">Created At</p>
            <p className="text-base text-textPrimary">
              {new Date(form.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </motion.div>
        </div>

  {(form.description || editing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-textSecondary mb-2">Description</p>
            {!editing ? (
              <p className="text-base text-textPrimary leading-relaxed">{form.description}</p>
            ) : (
              <textarea
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
              />
            )}
          </motion.div>
        )}

  <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-card text-textPrimary rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2.5 border border-gray-200 text-textSecondary rounded-lg hover:bg-card transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!onUpdate) return;
                  const updates = {
                    name: form.name,
                    client: form.client,
                      clientRole: form.clientRole,
                    origin: form.origin,
                    destination: form.destination,
                    value: form.value,
                    status: form.status,
                    description: form.description,
                    date: form.date,
                  };
                  onUpdate(shipment.id, updates);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShipmentModal;
