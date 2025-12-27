import React, { createContext, useContext, useState, useEffect } from 'react';
import { HostingRecord, User, Notification, AppSettings, DropdownOptions } from '../types';

interface DataContextType {
  records: HostingRecord[];
  addRecord: (record: Omit<HostingRecord, 'id'>) => void;
  updateRecord: (id: string, data: Partial<HostingRecord>) => void;
  deleteRecord: (id: string) => void;
  teamMembers: User[];
  addTeamMember: (member: Omit<User, 'id'>) => void;
  removeTeamMember: (id: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  dropdownOptions: DropdownOptions;
  updateDropdownOptions: (options: Partial<DropdownOptions>) => void;
  generateAutoInvoices: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_RECORDS: HostingRecord[] = [
  {
    id: '1',
    serialNumber: 1,
    clientName: 'Acme Corp',
    website: 'acme.com',
    email: 'contact@acme.com',
    phone: '+1 555 0101',
    storageGB: 10,
    setupDate: '2023-01-15',
    validationDate: '2024-01-15', // Expired
    amount: 120.00,
    status: 'Active',
    invoiceNumber: 'INV-2023-001',
    invoiceDate: '2023-01-15',
    paymentStatus: 'Paid',
    invoiceStatus: 'Sent',
    paymentMethod: 'Stripe',
  },
  {
    id: '2',
    serialNumber: 2,
    clientName: 'Globex Inc',
    website: 'globex.net',
    email: 'admin@globex.net',
    phone: '+1 555 0102',
    storageGB: 50,
    setupDate: '2023-05-20',
    validationDate: '2024-05-20', // Upcoming
    amount: 500.00,
    status: 'Active',
    invoiceNumber: 'INV-2023-045',
    invoiceDate: '2023-05-20',
    paymentStatus: 'Paid',
    invoiceStatus: 'Sent',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '3',
    serialNumber: 3,
    clientName: 'Soylent Corp',
    website: 'soylent.green',
    email: 'info@soylent.green',
    phone: '+1 555 0103',
    storageGB: 5,
    setupDate: '2023-11-01',
    validationDate: '2024-11-01',
    amount: 60.00,
    status: 'Suspended',
    invoiceNumber: 'INV-2023-089',
    invoiceDate: '2023-11-01',
    paymentStatus: 'Overdue',
    invoiceStatus: 'Sent',
    paymentMethod: 'PayPal',
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<HostingRecord[]>(MOCK_RECORDS);
  const [teamMembers, setTeamMembers] = useState<User[]>([
    { id: '1', name: 'Alice Manager', email: 'alice@hostmaster.com', role: 'Manager', avatar: 'https://ui-avatars.com/api/?name=Alice+Manager&background=random' },
    { id: '2', name: 'Bob Support', email: 'bob@hostmaster.com', role: 'Team Member', avatar: 'https://ui-avatars.com/api/?name=Bob+Support&background=random' }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    invoicePrefix: 'INV-',
    currency: '$',
    taxRate: 10,
    companyName: 'HostMaster Solutions',
    companyAddress: '123 Cloud Avenue, Server City',
    companyEmail: 'support@hostmaster.com',
    companyPhone: '+1 (555) 123-4567',
    logoUrl: '',
    themeColor: 'indigo',
    fontFamily: 'Inter'
  });

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    status: ['Active', 'Suspended', 'Expired', 'Pending'],
    paymentMethods: ['Bank Transfer', 'PayPal', 'Stripe', 'Cash', 'Credit Card'],
    invoiceStatus: ['Draft', 'Sent', 'Paid', 'Cancelled', 'Refunded']
  });

  // Check for renewals on mount
  useEffect(() => {
    const checkRenewals = () => {
      const today = new Date();
      const newNotifications: Notification[] = [];
      
      records.forEach(record => {
        const renewalDate = new Date(record.validationDate);
        const timeDiff = renewalDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 30 && daysDiff > 0) {
          newNotifications.push({
            id: Date.now().toString() + record.id,
            title: 'Renewal Upcoming',
            message: `${record.clientName} (${record.website}) renews in ${daysDiff} days.`,
            type: 'warning',
            date: new Date().toISOString(),
            read: false,
          });
        } else if (daysDiff <= 0 && record.paymentStatus !== 'Paid') {
           newNotifications.push({
            id: Date.now().toString() + record.id + 'exp',
            title: 'Hosting Expired/Due',
            message: `${record.clientName} (${record.website}) is overdue for renewal.`,
            type: 'error',
            date: new Date().toISOString(),
            read: false,
          });
        }
      });
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 20)); // Keep last 20
    };
    checkRenewals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme fonts and colors dynamically to body
  useEffect(() => {
    document.body.style.fontFamily = `"${settings.fontFamily}", sans-serif`;
  }, [settings.fontFamily]);

  const addRecord = (record: Omit<HostingRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setRecords([...records, newRecord]);
  };

  const updateRecord = (id: string, data: Partial<HostingRecord>) => {
    setRecords(records.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const addTeamMember = (member: Omit<User, 'id'>) => {
    setTeamMembers([...teamMembers, { ...member, id: Date.now().toString() }]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const updateDropdownOptions = (options: Partial<DropdownOptions>) => {
    setDropdownOptions({ ...dropdownOptions, ...options });
  };

  const generateAutoInvoices = () => {
    const updatedRecords = records.map(record => {
      const renewalDate = new Date(record.validationDate);
      const today = new Date();
      const timeDiff = renewalDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff <= 30 && record.invoiceStatus !== 'Sent') {
        return {
           ...record,
           invoiceStatus: 'Sent' as const,
           sendingDate: new Date().toISOString().split('T')[0],
           invoiceNumber: `${settings.invoicePrefix}${Date.now().toString().slice(-6)}`
        };
      }
      return record;
    });
    setRecords(updatedRecords);
    setNotifications(prev => [{
       id: Date.now().toString(),
       title: 'Auto-Invoicing Complete',
       message: 'Invoices generated for upcoming renewals.',
       type: 'success',
       date: new Date().toISOString(),
       read: false
    }, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      records, addRecord, updateRecord, deleteRecord,
      teamMembers, addTeamMember, removeTeamMember,
      notifications, markNotificationRead,
      settings, updateSettings, generateAutoInvoices,
      dropdownOptions, updateDropdownOptions
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};