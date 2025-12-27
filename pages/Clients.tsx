
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import HostingTable from '../components/HostingTable';
import { Plus, X } from 'lucide-react';
import { HostingRecord } from '../types';

const Clients: React.FC = () => {
  const { records, addRecord, updateRecord, deleteRecord, settings } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Omit<HostingRecord, 'id'> = {
      serialNumber: records.length + 1,
      clientName: '',
      website: '',
      email: '',
      phone: '',
      storageGB: 5,
      setupDate: new Date().toISOString().split('T')[0],
      validationDate: new Date().toISOString().split('T')[0],
      amount: 0,
      status: 'Active',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Unpaid',
      invoiceStatus: 'Draft',
      paymentMethod: 'Bank Transfer'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: string) => {
    const record = records.find(r => r.id === id);
    if (record) {
        setFormData(record);
        setEditingId(id);
        setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Are you sure you want to delete this record?')) {
          deleteRecord(id);
      }
  };

  // Automated logic for Renewal Date
  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'Paid' | 'Unpaid' | 'Overdue';
    let updatedData = { ...formData, paymentStatus: newStatus };

    if (newStatus === 'Paid' && formData.paymentStatus !== 'Paid') {
        // Parse the existing renewal date
        const currentRenewal = new Date(formData.validationDate);
        
        if (!isNaN(currentRenewal.getTime())) {
            // Logic: If status is Paid, extend current renewal date by exactly 1 year
            currentRenewal.setFullYear(currentRenewal.getFullYear() + 1);
            updatedData.validationDate = currentRenewal.toISOString().split('T')[0];
            
            // Auto-activate the hosting status
            updatedData.status = 'Active';
            
            // Log for debugging
            console.log(`Auto-renewed ${formData.clientName} to ${updatedData.validationDate}`);
        }
    }
    setFormData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateRecord(editingId, formData);
    } else {
        addRecord(formData);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hosting Records</h1>
        <button 
            onClick={() => {
                setEditingId(null);
                setFormData({ ...initialFormState, serialNumber: records.length + 1 });
                setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add New Client
        </button>
      </div>

      <HostingTable records={records} onEdit={handleEdit} onDelete={handleDelete} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Record' : 'New Hosting Record'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Client Details</h3>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Client Name</label>
                        <input required type="text" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <input required type="text" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input required type="email" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <input type="text" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>

                     <div className="md:col-span-2 mt-4">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Service Details</h3>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Renewal Date</label>
                        <input required type="date" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.validationDate} onChange={e => setFormData({...formData, validationDate: e.target.value})} />
                    </div>

                     <div className="md:col-span-2 mt-4">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Billing</h3>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Amount ({settings.currency})</label>
                        <input required type="number" step="0.01" className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment Status</label>
                         <select 
                            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={formData.paymentStatus} 
                            onChange={handlePaymentStatusChange}
                        >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    
                    <div className="md:col-span-2 pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Record</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
