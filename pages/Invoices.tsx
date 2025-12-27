import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import InvoiceTemplate from '../components/InvoiceTemplate';
import { Printer, Download, Send, RefreshCw } from 'lucide-react';

const Invoices: React.FC = () => {
  const { records, settings, generateAutoInvoices } = useData();
  const [selectedId, setSelectedId] = useState<string>(records[0]?.id || '');

  const selectedRecord = records.find(r => r.id === selectedId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
         <div className="p-4 border-b border-gray-100">
            <button 
                onClick={generateAutoInvoices}
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 p-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
                <RefreshCw size={16} />
                Run Auto-Generation
            </button>
         </div>
         <div className="flex-1 overflow-y-auto">
            {records.map(record => (
                <div 
                    key={record.id}
                    onClick={() => setSelectedId(record.id)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedId === record.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800 text-sm">{record.invoiceNumber || 'DRAFT'}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${record.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {record.paymentStatus}
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 truncate">{record.clientName}</div>
                    <div className="text-xs text-gray-400 mt-1">{record.validationDate}</div>
                </div>
            ))}
         </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-120px)]">
         {selectedRecord ? (
            <>
                {/* Actions Toolbar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Previewing invoice for <span className="font-semibold text-gray-900">{selectedRecord.clientName}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Print">
                            <Printer size={20} />
                        </button>
                         <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Download PDF">
                            <Download size={20} />
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
                            <Send size={16} />
                            Send to Client
                        </button>
                    </div>
                </div>

                {/* Scrollable Invoice Preview */}
                <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-8 border border-gray-200">
                    <InvoiceTemplate record={selectedRecord} settings={settings} />
                </div>
            </>
         ) : (
             <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                 Select an invoice to preview
             </div>
         )}
      </div>
    </div>
  );
};

export default Invoices;
