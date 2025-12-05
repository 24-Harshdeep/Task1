import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { getCurrentUser, updateUser } from '../utils/storage';
import { useEffect, useState } from 'react';

const Profile = ({ user, onLogout }) => {
  const [current, setCurrent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setCurrent(getCurrentUser());
  }, []);

  useEffect(() => {
    if (current) setForm({ fullName: current.fullName, email: current.email });
    else setForm(null);
  }, [current]);

  return (
    <div className="min-h-screen bg-card overflow-x-hidden">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col md:flex-row">
        <Sidebar activeItem={'Profile'} setActiveItem={() => {}} />
  <main className="flex-1 p-6 md:ml-64">
          <h2 className="text-2xl font-bold text-textPrimary mb-4">Profile</h2>
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md">
            <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
            {current ? (
              <div className="space-y-4">
                {!editing ? (
                  <>
                    <div className="text-lg font-medium">{current.fullName}</div>
                    <div className="text-textSecondary text-sm">{current.email}</div>
                    <div className="pt-4">
                      <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-textSecondary">Full Name</label>
                      <input
                        value={form.fullName}
                        onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-textSecondary">Email</label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md bg-card text-textPrimary"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          const res = updateUser(current.id, { fullName: form.fullName, email: form.email });
                          if (res.success) {
                            setCurrent(res.user);
                            setToast({ show: true, message: 'Profile updated', type: 'success' });
                            setEditing(false);
                          } else {
                            setToast({ show: true, message: res.message || 'Failed to update', type: 'error' });
                          }
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-textSecondary">No user data</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
