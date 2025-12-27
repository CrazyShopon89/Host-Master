import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Save, Plus, X } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings, dropdownOptions, updateDropdownOptions } = useData();
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'dropdowns'>('general');

  // Dropdown Management State
  const [newOption, setNewOption] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'status' | 'paymentMethods' | 'invoiceStatus'>('status');

  const handleSave = () => {
    updateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const handleAddOption = () => {
      if (!newOption.trim()) return;
      const current = dropdownOptions[activeDropdown];
      if (!current.includes(newOption)) {
          updateDropdownOptions({
              [activeDropdown]: [...current, newOption]
          });
      }
      setNewOption('');
  };

  const handleRemoveOption = (option: string) => {
      const current = dropdownOptions[activeDropdown];
      updateDropdownOptions({
          [activeDropdown]: current.filter(item => item !== option)
      });
  };

  const themeColors = ['indigo', 'blue', 'green', 'purple', 'rose', 'slate'];
  const fontFamilies = ['Inter', 'Roboto', 'Poppins'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700`}
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('general')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? `border-${settings.themeColor}-600 text-${settings.themeColor}-600` : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Company Info
          </button>
           <button onClick={() => setActiveTab('appearance')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'appearance' ? `border-${settings.themeColor}-600 text-${settings.themeColor}-600` : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Branding & UI
          </button>
           <button onClick={() => setActiveTab('dropdowns')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dropdowns' ? `border-${settings.themeColor}-600 text-${settings.themeColor}-600` : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Data Fields
          </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <input 
                        type="text" 
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={localSettings.companyName}
                        onChange={e => setLocalSettings({...localSettings, companyName: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Support Email</label>
                    <input 
                        type="email" 
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={localSettings.companyEmail}
                        onChange={e => setLocalSettings({...localSettings, companyEmail: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                        type="text" 
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={localSettings.companyPhone}
                        onChange={e => setLocalSettings({...localSettings, companyPhone: e.target.value})}
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Logo URL</label>
                    <input 
                        type="text" 
                        placeholder="https://example.com/logo.png"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={localSettings.logoUrl}
                        onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Office Address</label>
                    <textarea 
                        rows={3}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={localSettings.companyAddress}
                        onChange={e => setLocalSettings({...localSettings, companyAddress: e.target.value})}
                    />
                </div>
            </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
             <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Color</h3>
                 <div className="flex flex-wrap gap-4">
                     {themeColors.map(color => (
                         <button 
                            key={color}
                            onClick={() => setLocalSettings({...localSettings, themeColor: color as any})}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${localSettings.themeColor === color ? 'border-gray-800' : 'border-transparent'}`}
                         >
                             <div className={`w-8 h-8 rounded-full bg-${color}-600`}></div>
                         </button>
                     ))}
                 </div>
             </div>

             <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Typography</h3>
                 <div className="grid grid-cols-3 gap-4">
                     {fontFamilies.map(font => (
                         <button
                            key={font}
                            onClick={() => setLocalSettings({...localSettings, fontFamily: font as any})}
                            className={`p-4 border rounded-xl text-center transition-all ${localSettings.fontFamily === font ? `border-${localSettings.themeColor}-600 bg-${localSettings.themeColor}-50 text-${localSettings.themeColor}-700` : 'border-gray-200 hover:border-gray-300'}`}
                            style={{ fontFamily: font }}
                         >
                             <span className="text-lg font-bold">{font}</span>
                             <p className="text-xs mt-1 opacity-70">The quick brown fox</p>
                         </button>
                     ))}
                 </div>
             </div>

             <div className="border-t border-gray-100 pt-6">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Settings</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Invoice Prefix</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-lg p-2"
                            value={localSettings.invoicePrefix}
                            onChange={e => setLocalSettings({...localSettings, invoicePrefix: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Currency Symbol</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-lg p-2"
                            value={localSettings.currency}
                            onChange={e => setLocalSettings({...localSettings, currency: e.target.value})}
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                        <input 
                            type="number" 
                            className="w-full border rounded-lg p-2"
                            value={localSettings.taxRate}
                            onChange={e => setLocalSettings({...localSettings, taxRate: Number(e.target.value)})}
                        />
                    </div>
                 </div>
             </div>
          </div>
      )}

      {/* Dropdown Management */}
      {activeTab === 'dropdowns' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                  {/* Sidebar */}
                  <div className="w-full md:w-48 space-y-2">
                      {(['status', 'paymentMethods', 'invoiceStatus'] as const).map(key => (
                          <button
                            key={key}
                            onClick={() => setActiveDropdown(key)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDropdown === key ? `bg-${settings.themeColor}-50 text-${settings.themeColor}-700` : 'hover:bg-gray-50 text-gray-600'}`}
                          >
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </button>
                      ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Options</h3>
                      
                      <div className="flex gap-2 mb-4">
                          <input 
                            type="text" 
                            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Add new option..."
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                          />
                          <button onClick={handleAddOption} className={`bg-${settings.themeColor}-600 text-white p-2 rounded-lg hover:bg-${settings.themeColor}-700`}>
                              <Plus size={20} />
                          </button>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto">
                          {dropdownOptions[activeDropdown].map((option) => (
                              <div key={option} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  <span className="text-gray-700">{option}</span>
                                  <button onClick={() => handleRemoveOption(option)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                      <X size={16} />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Settings;