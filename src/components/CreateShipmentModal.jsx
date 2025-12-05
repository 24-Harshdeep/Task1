import { useState } from 'react';
import Modal from './Modal';
import { motion } from 'framer-motion';

const CreateShipmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    clientRole: 'Importer',
    origin: '',
    destination: '',
    value: '',
    status: 'Pending',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Shipment name is required';
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);

    setFormData({
      name: '',
      client: '',
      clientRole: 'Importer',
      origin: '',
      destination: '',
      value: '',
      status: 'Pending',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      name: '',
      client: '',
      clientRole: 'Importer',
      origin: '',
      destination: '',
      value: '',
      status: 'Pending',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Shipment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Shipment Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Electronics Import"
            className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="e.g., Tech Solutions Inc."
            className={`w-full px-4 py-2.5 border ${errors.client ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
          />
          {errors.client && <p className="text-sm text-red-500 mt-1">{errors.client}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">Client Role</label>
          <select
            name="clientRole"
            value={formData.clientRole}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="Importer">Importer</option>
            <option value="Exporter">Exporter</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Origin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="Port of origin"
              className={`w-full px-4 py-2.5 border ${errors.origin ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
            />
            {errors.origin && <p className="text-sm text-red-500 mt-1">{errors.origin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Port of destination"
              className={`w-full px-4 py-2.5 border ${errors.destination ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
            />
            {errors.destination && <p className="text-sm text-red-500 mt-1">{errors.destination}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Shipment Value
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Filing Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Description / Notes
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional details about this shipment..."
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-textSecondary rounded-lg hover:bg-card transition-colors font-medium"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Create Shipment
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateShipmentModal;
