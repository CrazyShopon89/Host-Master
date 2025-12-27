
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

// Storage Keys
const DB_KEYS = {
    RECORDS: 'hm_db_records',
    SETTINGS: 'hm_db_settings',
    TEAM: 'hm_db_team',
    OPTIONS: 'hm_db_options'
};

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
    validationDate: '2024-01-15',
    amount: 120.00,
    status: 'Active',
    invoiceNumber: 'INV-2023-001',
    invoiceDate: '2023-01-15',
    paymentStatus: 'Paid',
    invoiceStatus: 'Sent',
    paymentMethod: 'Stripe',
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or Defaults
  const [records, setRecords] = useState<HostingRecord[]>(() => {
      const saved = localStorage.getItem(DB_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : MOCK_RECORDS;
  });

  const [teamMembers, setTeamMembers] = useState<User[]>(() => {
      const saved = localStorage.getItem(DB_KEYS.TEAM);
      return saved ? JSON.parse(saved) : [
          { id: '1', name: 'Alice Manager', email: 'alice@hostmaster.com', role: 'Manager', avatar: 'https://ui-avatars.com/api/?name=Alice+Manager&background=random' }
      ];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
      const saved = localStorage.getItem(DB_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : {
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
      };
  });

  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>(() => {
      const saved = localStorage.getItem(DB_KEYS.OPTIONS);
      return saved ? JSON.parse(saved) : {
          status: ['Active', 'Suspended', 'Expired', 'Pending'],
          paymentMethods: ['Bank Transfer', 'PayPal', 'Stripe', 'Cash', 'Credit Card'],
          invoiceStatus: ['Draft', 'Sent', 'Paid', 'Cancelled', 'Refunded']
      };
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Persistence Effects (The "Database" sync)
  useEffect(() => localStorage.setItem(DB_KEYS.RECORDS, JSON.stringify(records)), [records]);
  useEffect(() => localStorage.setItem(DB_KEYS.TEAM, JSON.stringify(teamMembers)), [teamMembers]);
  useEffect(() => localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem(DB_KEYS.OPTIONS, JSON.stringify(dropdownOptions)), [dropdownOptions]);

  const addRecord = (record: Omit<HostingRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (id: string, data: Partial<HostingRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const addTeamMember = (member: Omit<User, 'id'>) => {
    setTeamMembers(prev => [...prev, { ...member, id: Date.now().toString() }]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateDropdownOptions = (options: Partial<DropdownOptions>) => {
    setDropdownOptions(prev => ({ ...prev, ...options }));
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
