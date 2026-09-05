'use client';
import { useState, useEffect } from 'react';
import { UploadCloud, File as FileIcon, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedCustomers, setSavedCustomers] = useState<any[]>([]);
  const [savedCatalog, setSavedCatalog] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/customers').then(res => res.json()).then(data => {
        if (!data.error) setSavedCustomers(data);
      });
      fetch('/api/catalog').then(res => res.json()).then(data => {
        if (!data.error) setSavedCatalog(data);
      });
    }
  }, [session]);

  // Supplier (Creator) State - Used for Guests
  const [supplier, setSupplier] = useState({
    name: '', street: '', city: '', zip: '', country: 'DE', vat: ''
  });

  // Customer (Receiver) State
  const [customer, setCustomer] = useState({
    name: '', street: '', city: '', zip: '', country: 'DE', vat: ''
  });

  // Invoice Metadata
  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, price: 0, taxPercent: 19 }
  ]);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, price: 0, taxPercent: 19 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = value;
    setLineItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (outputFormat: 'pdf' | 'xml') => {
    let uploadFile = file;

    if (mode === 'manual') {
      if (lineItems.length === 0) {
        setError('Bitte fügen Sie mindestens eine Position hinzu.');
        return;
      }
      // Create CSV string
      const header = "Description,Quantity,Price,TaxPercent\n";
      const rows = lineItems.map(item => `"${item.description}",${item.quantity},${item.price},${item.taxPercent}`).join('\n');
      const csvContent = header + rows;
      uploadFile = new File([csvContent], "manual_invoice.csv", { type: "text/csv" });
    }

    if (!uploadFile) {
      setError('Please upload a file or switch to manual entry.');
      return;
    }
    
    if (uploadFile.name.endsWith('.csv') || uploadFile.name.endsWith('.xlsx') || uploadFile.name.endsWith('.xls')) {
      if (!session && !supplier.name) {
        setError('Bitte geben Sie Ihren Firmennamen (Verkäufer) ein.');
        return;
      }
      if (!customer.name) {
        setError('Bitte geben Sie die Kundendaten (Käufer) ein.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (!session) {
      formData.append('supplier', JSON.stringify(supplier));
    }
    formData.append('customer', JSON.stringify(customer));
    formData.append('invoiceMeta', JSON.stringify(invoiceMeta));

    try {
      const response = await fetch(`/api/generate?output=${outputFormat}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invoice');
      }

      // Handle download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputFormat === 'xml' ? 'xrechnung.xml' : 'e-invoice-zugferd.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChange, required = false }: any) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type="text" required={required} value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
    </div>
  );

  if (status === 'loading') return <div className="text-center py-20">Lade...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">E-Rechnungen Dashboard</h1>
      
      {!session && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Sie nutzen die Plattform als Gast (Unregistriert). Sie können Rechnungen bis max. 100 € erstellen. <Link href="/register" className="font-bold underline">Kostenlos registrieren</Link> für bis zu 500 € und gespeicherte Stammdaten.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {session ? (
          <div className="bg-white shadow sm:rounded-lg p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Ihre Stammdaten (Verkäufer)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Wir übernehmen Ihre Unternehmensdaten sicher aus Ihren Kontoeinstellungen für jede Rechnung.
            </p>
            <Link href="/settings" className="text-sm font-medium text-blue-600 hover:text-blue-500 bg-blue-50 px-4 py-2 rounded-md">
              Einstellungen anpassen
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ihre Daten (Verkäufer)</h2>
            <InputField label="Firmenname *" required value={supplier.name} onChange={(e: any) => setSupplier({...supplier, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Straße" value={supplier.street} onChange={(e: any) => setSupplier({...supplier, street: e.target.value})} />
              <InputField label="Stadt" value={supplier.city} onChange={(e: any) => setSupplier({...supplier, city: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="PLZ" value={supplier.zip} onChange={(e: any) => setSupplier({...supplier, zip: e.target.value})} />
              <InputField label="Land (z.B. DE)" value={supplier.country} onChange={(e: any) => setSupplier({...supplier, country: e.target.value})} />
            </div>
            <InputField label="USt-IdNr." value={supplier.vat} onChange={(e: any) => setSupplier({...supplier, vat: e.target.value})} />
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Kundendaten (Käufer)</h2>
            {savedCustomers.length > 0 && (
              <select
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const selected = savedCustomers.find(c => c.id === e.target.value);
                  if (selected) {
                    setCustomer({ name: selected.name, street: selected.street || '', city: selected.city || '', zip: selected.zip || '', country: selected.country || 'DE', vat: selected.vat || '' });
                  }
                }}
              >
                <option value="">-- Gespeicherten Kunden laden --</option>
                {savedCustomers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
          <InputField label="Firmenname *" required value={customer.name} onChange={(e: any) => setCustomer({...customer, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Straße" value={customer.street} onChange={(e: any) => setCustomer({...customer, street: e.target.value})} />
            <InputField label="Stadt" value={customer.city} onChange={(e: any) => setCustomer({...customer, city: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="PLZ" value={customer.zip} onChange={(e: any) => setCustomer({...customer, zip: e.target.value})} />
            <InputField label="Land (z.B. DE)" value={customer.country} onChange={(e: any) => setCustomer({...customer, country: e.target.value})} />
          </div>
          <div className="flex justify-between items-end gap-4">
            <div className="flex-1">
              <InputField label="USt-IdNr." value={customer.vat} onChange={(e: any) => setCustomer({...customer, vat: e.target.value})} />
            </div>
            {session && (
              <button 
                type="button"
                onClick={async () => {
                  if (!customer.name) return alert('Bitte Firmenname ausfüllen');
                  const res = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customer) });
                  if (res.ok) {
                    const newCust = await res.json();
                    setSavedCustomers([...savedCustomers, newCust]);
                    alert('Kunde gespeichert!');
                  }
                }}
                className="mb-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors"
              >
                Kunde im Adressbuch speichern
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Rechnungsdetails (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Rechnungsnummer (Autom. generiert wenn leer)" value={invoiceMeta.invoiceNumber} onChange={(e: any) => setInvoiceMeta({...invoiceMeta, invoiceNumber: e.target.value})} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechnungsdatum</label>
            <input type="date" value={invoiceMeta.issueDate} onChange={(e: any) => setInvoiceMeta({...invoiceMeta, issueDate: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Posten hinzufügen</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setMode('upload')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${mode === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Datei hochladen
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${mode === 'manual' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Manuelle Eingabe
            </button>
          </div>
        </div>

        {mode === 'upload' ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Laden Sie eine CSV, Excel (.xlsx) oder CRM JSON (.json) hoch. Bei CSV/Excel werden folgende Spalten benötigt: <code>Description</code>, <code>Quantity</code>, <code>Price</code>, und <code>TaxPercent</code>.
            </p>
            
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-300">📁</div>
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Datei auswählen</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv, .xlsx, .xls, .json" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">oder per Drag & Drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">CSV, XLSX, JSON bis 10MB</p>
              </div>
            </div>

            {file && (
              <div className="mt-4 flex items-center p-4 bg-blue-50 rounded-md">
                <span className="text-sm font-medium text-blue-700">{file.name}</span>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {savedCatalog.length > 0 && (
              <div className="mb-4">
                <select
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  onChange={(e) => {
                    if (e.target.value === '') return;
                    const selected = savedCatalog.find(c => c.id === e.target.value);
                    if (selected) {
                      setLineItems([...lineItems, { description: selected.description, quantity: 1, price: selected.price, taxPercent: selected.taxPercent }]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">+ Artikel aus Katalog hinzufügen</option>
                  {savedCatalog.map(c => (
                    <option key={c.id} value={c.id}>{c.description} ({c.price}€)</option>
                  ))}
                </select>
              </div>
            )}
            {lineItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 sm:items-end bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-700">Bezeichnung (Description)</label>
                  <input type="text" value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border sm:text-sm" placeholder="z.B. Webentwicklung" />
                </div>
                <div className="w-full sm:w-24">
                  <label className="block text-xs font-medium text-gray-700">Menge</label>
                  <input type="number" step="0.01" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 p-2 border sm:text-sm" />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block text-xs font-medium text-gray-700">Stückpreis (€)</label>
                  <input type="number" step="0.01" value={item.price} onChange={(e) => handleLineItemChange(index, 'price', parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 p-2 border sm:text-sm" />
                </div>
                <div className="w-full sm:w-24">
                  <label className="block text-xs font-medium text-gray-700">MwSt. (%)</label>
                  <select value={item.taxPercent} onChange={(e) => handleLineItemChange(index, 'taxPercent', parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 p-2 border sm:text-sm bg-white">
                    <option value={19}>19%</option>
                    <option value={7}>7%</option>
                    <option value={0}>0%</option>
                  </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                  {session && (
                    <button 
                      onClick={async () => {
                        if (!item.description) return alert('Bezeichnung fehlt');
                        const res = await fetch('/api/catalog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
                        if (res.ok) {
                          const newItem = await res.json();
                          setSavedCatalog([...savedCatalog, newItem]);
                          alert('Artikel im Katalog gespeichert!');
                        }
                      }}
                      className="text-gray-500 hover:text-blue-600 p-2 border border-transparent hover:bg-blue-50 rounded-md text-xs flex-1 sm:flex-none text-center"
                      title="Als Vorlage im Artikelstamm speichern"
                    >
                      💾 Speichern
                    </button>
                  )}
                  <button onClick={() => handleRemoveLineItem(index)} className="text-red-500 hover:text-red-700 p-2 border border-transparent hover:bg-red-50 rounded-md flex-1 sm:flex-none text-center" title="Entfernen">
                    ✖
                  </button>
                </div>
              </div>
            ))}
            <button onClick={handleAddLineItem} className="text-sm font-medium text-blue-600 hover:text-blue-800">
              + Neue Position hinzufügen
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center p-4 bg-red-50 rounded-md">
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => handleUpload('xml')}
            disabled={(mode === 'upload' && !file) || loading}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? '...' : 'XRechnung (XML) herunterladen'}
          </button>
          <button
            onClick={() => handleUpload('pdf')}
            disabled={(mode === 'upload' && !file) || loading}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${((mode === 'upload' && !file) || loading) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
          >
            {loading ? 'Wird erstellt...' : 'ZUGFeRD (PDF) herunterladen'}
          </button>
        </div>
      </div>
    </div>
  );
}
