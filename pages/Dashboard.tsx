import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { Users, DollarSign, AlertCircle, HardDrive, CheckCircle, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { records, settings } = useData();

  const stats = useMemo(() => {
    const totalClients = records.length;
    const totalRevenue = records.reduce((acc, curr) => acc + curr.amount, 0);
    const overdue = records.filter(r => r.paymentStatus === 'Overdue' || r.paymentStatus === 'Unpaid').length;
    const upcomingRenewals = records.filter(r => {
       const d = new Date(r.validationDate);
       const now = new Date();
       const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
       return diff > 0 && diff <= 30;
    }).length;
    
    // Chart Data
    const statusData = [
      { name: 'Paid', value: records.filter(r => r.paymentStatus === 'Paid').length, color: '#10B981' },
      { name: 'Unpaid', value: records.filter(r => r.paymentStatus === 'Unpaid').length, color: '#F59E0B' },
      { name: 'Overdue', value: records.filter(r => r.paymentStatus === 'Overdue').length, color: '#EF4444' },
    ];

    return { totalClients, totalRevenue, overdue, upcomingRenewals, statusData };
  }, [records]);

  // Determine icon based on currency symbol (Bonus aesthetic)
  const getRevenueIcon = () => {
      return Wallet;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <span className="text-sm text-gray-500">Last updated: Just now</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients} 
          icon={Users} 
          trend="+2 new this month" 
          color="blue" 
        />
        <StatCard 
          title="Expected Revenue" 
          value={`${settings.currency}${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={getRevenueIcon()} 
          color="green" 
        />
        <StatCard 
          title="Upcoming Renewals" 
          value={stats.upcomingRenewals} 
          icon={AlertCircle} 
          trend="Action needed"
          color="yellow" 
        />
        <StatCard 
          title="Pending Payments" 
          value={stats.overdue} 
          icon={CheckCircle} 
          color="red" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             {stats.statusData.map(item => (
                 <div key={item.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                     <span className="text-sm text-gray-600">{item.name}</span>
                 </div>
             ))}
          </div>
        </div>

        {/* Storage Usage (Mock) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Projection (Next 6 Months)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                    { name: 'Jan', amt: 2400 },
                    { name: 'Feb', amt: 1398 },
                    { name: 'Mar', amt: 9800 },
                    { name: 'Apr', amt: 3908 },
                    { name: 'May', amt: 4800 },
                    { name: 'Jun', amt: 3800 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} formatter={(value: number) => [`${settings.currency}${value}`, 'Amount']} />
                <Bar dataKey="amt" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions for Renewals */}
      {stats.upcomingRenewals > 0 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <AlertCircle size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-yellow-800">Attention Required</h3>
                <p className="text-yellow-700 mt-1">You have {stats.upcomingRenewals} clients with hosting expiring in the next 30 days. Generate invoices now to avoid service interruption.</p>
                <button className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Process Renewals
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;