import React from 'react';
import { HostingRecord, AppSettings } from '../types';

interface InvoiceTemplateProps {
  record: HostingRecord;
  settings: AppSettings;
  forwardRef?: React.Ref<HTMLDivElement>;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ record, settings, forwardRef }) => {
  return (
    <div ref={forwardRef} className="bg-white p-8 md:p-12 shadow-lg rounded-none max-w-4xl mx-auto text-gray-800 print:shadow-none print:w-full">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-sm text-gray-500">#{record.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">{settings.companyName}</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{settings.companyAddress}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex justify-between mb-10">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bill To:</h3>
          <p className="font-bold text-lg">{record.clientName}</p>
          <p className="text-gray-600">{record.email}</p>
          <p className="text-gray-600">{record.phone}</p>
          <p className="text-gray-600">{record.website}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Invoice Date:</span>
             <span className="ml-4 font-medium">{record.invoiceDate}</span>
          </div>
          <div className="mb-2">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Due Date:</span>
             <span className="ml-4 font-medium">{record.validationDate}</span>
          </div>
          <div>
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Status:</span>
             <span className={`ml-4 font-bold ${record.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                {record.paymentStatus.toUpperCase()}
             </span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <table className="w-full mb-10">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="py-3 pl-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Description</th>
            <th className="py-3 pr-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-4 pl-4">
              <p className="font-medium text-gray-900">Hosting Renewal Service</p>
              <p className="text-sm text-gray-500">
                Website: {record.website} | Storage: {record.storageGB}GB
              </p>
              <p className="text-sm text-gray-500">
                Period: {record.setupDate} to {record.validationDate}
              </p>
            </td>
            <td className="py-4 pr-4 text-right font-medium">
              {settings.currency}{record.amount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end border-t border-gray-200 pt-4">
        <div className="w-64">
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal:</span>
            <span>{settings.currency}{record.amount.toFixed(2)}</span>
          </div>
           <div className="flex justify-between mb-2 text-gray-600">
            <span>Tax ({settings.taxRate}%):</span>
            <span>{settings.currency}{(record.amount * (settings.taxRate / 100)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
            <span>Total:</span>
            <span>{settings.currency}{(record.amount * (1 + settings.taxRate / 100)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
        <p className="font-medium mb-1">Thank you for your business!</p>
        <p>If you have any questions about this invoice, please contact us at support@hostmaster.com</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
