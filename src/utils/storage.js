

export const registerUser = (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
  password: userData.password,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Account created successfully!' };
  } catch (error) {
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

export const loginUser = (email, password) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    
    const session = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      loggedInAt: new Date().toISOString(),
    };
    
    localStorage.setItem('currentUser', JSON.stringify(session));
    
    return { success: true, user: session };
  } catch (error) {
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};



const INITIAL_SHIPMENTS = [
  {
    id: 'SH-001',
    name: 'Electronics Import',
    client: 'Tech Solutions Inc.',
    clientRole: 'Importer',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    status: 'In Progress',
    date: '2025-12-01',
    value: '$45,230',
    description: 'Consumer electronics shipment including laptops and accessories',
    createdAt: '2025-12-01T10:30:00Z',
  },
  {
    id: 'SH-002',
    name: 'Automotive Parts',
    client: 'Global Traders Ltd.',
    clientRole: 'Exporter',
    origin: 'Hamburg, Germany',
    destination: 'New York, USA',
    status: 'Completed',
    date: '2025-11-28',
    value: '$78,450',
    description: 'High-performance automotive components for luxury vehicles',
    createdAt: '2025-11-28T14:20:00Z',
  },
  {
    id: 'SH-003',
    name: 'Medical Equipment',
    client: 'Pacific Imports Co.',
    clientRole: 'Importer',
    origin: 'Tokyo, Japan',
    destination: 'Seattle, USA',
    status: 'Pending',
    date: '2025-12-03',
    value: '$52,100',
    description: 'Medical diagnostic equipment and laboratory supplies',
    createdAt: '2025-12-03T09:15:00Z',
  },
  {
    id: 'SH-004',
    name: 'Textiles & Fabrics',
    client: 'Euro Logistics',
    clientRole: 'Exporter',
    origin: 'Rotterdam, Netherlands',
    destination: 'Miami, USA',
    status: 'In Progress',
    date: '2025-11-30',
    value: '$63,890',
    description: 'Premium fabrics and textiles for fashion industry',
    createdAt: '2025-11-30T11:45:00Z',
  },
  {
    id: 'SH-005',
    name: 'Industrial Machinery',
    client: 'Asia Express LLC',
    clientRole: 'Exporter',
    origin: 'Hong Kong',
    destination: 'San Francisco, USA',
    status: 'Completed',
    date: '2025-11-25',
    value: '$91,200',
    description: 'Heavy industrial machinery and manufacturing equipment',
    createdAt: '2025-11-25T16:30:00Z',
  },
  {
    id: 'SH-006',
    name: 'Food & Beverages',
    client: 'Continental Shipping',
    clientRole: 'Importer',
    origin: 'Singapore',
    destination: 'Houston, USA',
    status: 'Pending',
    date: '2025-12-04',
    value: '$38,750',
    description: 'Specialty food products and premium beverages',
    createdAt: '2025-12-04T08:00:00Z',
  },
];


const initializeShipments = () => {
  if (!localStorage.getItem('shipments')) {
    localStorage.setItem('shipments', JSON.stringify(INITIAL_SHIPMENTS));
  }
};

export const getShipments = () => {
  initializeShipments();
  try {
    return JSON.parse(localStorage.getItem('shipments') || '[]');
  } catch (error) {
    return [];
  }
};

export const getShipmentById = (id) => {
  const shipments = getShipments();
  return shipments.find(s => s.id === id);
};

export const addShipment = (shipmentData) => {
  try {
    const shipments = getShipments();
    
    
    const id = `SH-${String(shipments.length + 1).padStart(3, '0')}`;
    
    const newShipment = {
      id,
      name: shipmentData.name,
      client: shipmentData.client || 'N/A',
      clientRole: shipmentData.clientRole || 'Importer',
      origin: shipmentData.origin || 'N/A',
      destination: shipmentData.destination || 'N/A',
      status: shipmentData.status || 'Pending',
      date: shipmentData.date || new Date().toISOString().split('T')[0],
      value: shipmentData.value || '$0',
      description: shipmentData.description || '',
      createdAt: new Date().toISOString(),
    };
    
  shipments.unshift(newShipment);
    localStorage.setItem('shipments', JSON.stringify(shipments));
    
    return { success: true, shipment: newShipment };
  } catch (error) {
    return { success: false, message: 'Failed to create shipment' };
  }
};

export const updateShipment = (id, updates) => {
  try {
    const shipments = getShipments();
    const index = shipments.findIndex(s => s.id === id);
    
    if (index === -1) {
      return { success: false, message: 'Shipment not found' };
    }
    
    shipments[index] = { ...shipments[index], ...updates };
    localStorage.setItem('shipments', JSON.stringify(shipments));
    
    return { success: true, shipment: shipments[index] };
  } catch (error) {
    return { success: false, message: 'Failed to update shipment' };
  }
};

export const deleteShipment = (id) => {
  try {
    const shipments = getShipments();
    const filtered = shipments.filter(s => s.id !== id);
    localStorage.setItem('shipments', JSON.stringify(filtered));
    
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete shipment' };
  }
};



export const getShipmentStats = () => {
  const shipments = getShipments();
  
  return {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'Pending').length,
    inProgress: shipments.filter(s => s.status === 'In Progress').length,
    completed: shipments.filter(s => s.status === 'Completed').length,
  };
};


export const updateUser = (id, updates) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, message: 'User not found' };

    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem('users', JSON.stringify(users));

    
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (current && current.id === id) {
      const updatedSession = { ...current, ...updates };
      
      if (updates.fullName) updatedSession.fullName = updates.fullName;
      if (updates.email) updatedSession.email = updates.email;
      localStorage.setItem('currentUser', JSON.stringify(updatedSession));
    }

    return { success: true, user: users[idx] };
  } catch (error) {
    return { success: false, message: 'Failed to update user' };
  }
};
