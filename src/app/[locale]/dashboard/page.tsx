'use client';
import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, X, Building2, User, Receipt, ListPlus, FileDown, FileCode, Trash2, BookmarkPlus, PenLine } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { COUNTRIES } from '@/lib/countries';

type Party = { name: string; street: string; city: string; zip: string; country: string; vat: string };
type Customer = Party & { id: string };
type CatalogEntry = { id: string; description: string; price: number; taxPercent: number };
type LineItem = { description: string; quantity: number; price: number; taxPercent: number };

const EMPTY_PARTY: Party = { name: '', street: '', city: '', zip: '', country: 'DE', vat: '' };

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const { data: session, status } = useSession();
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState<'xml' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedCustomers, setSavedCustomers] = useState<Customer[]>([]);
  const [savedCatalog, setSavedCatalog] = useState<CatalogEntry[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/customers').then((res) => res.json()).then((data) => { if (!data.error) setSavedCustomers(data); });
      fetch('/api/catalog').then((res) => res.json()).then((data) => { if (!data.error) setSavedCatalog(data); });
    }
  }, [session]);

  const [supplier, setSupplier] = useState<Party>(EMPTY_PARTY);
  const [customer, setCustomer] = useState<Party>(EMPTY_PARTY);
  const [invoiceMeta, setInvoiceMeta] = useState({ invoiceNumber: '', issueDate: new Date().toISOString().split('T')[0] });

  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, price: 0, taxPercent: 19 }]);

  const handleAddLineItem = () => setLineItems([...lineItems, { description: '', quantity: 1, price: 0, taxPercent: 19 }]);
  const handleRemoveLineItem = (index: number) => setLineItems(lineItems.filter((_, i) => i !== index));
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...lineItems];
    (newItems[index] as unknown as Record<string, string | number>)[field] = value;
    setLineItems(newItems);
  };

  const manualTotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);

  const acceptFile = (f: File) => {
    setFile(f);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) acceptFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) acceptFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async (outputFormat: 'pdf' | 'xml') => {
    let uploadFile = file;

    if (mode === 'manual') {
      if (lineItems.length === 0 || !lineItems.some((i) => i.description)) {
        setError(t('error_no_items'));
        return;
      }
      const header = 'Description,Quantity,Price,TaxPercent\n';
      const rows = lineItems.map((item) => `"${item.description}",${item.quantity},${item.price},${item.taxPercent}`).join('\n');
      uploadFile = new File([header + rows], 'manual_invoice.csv', { type: 'text/csv' });
    }

    if (!uploadFile) {
      setError(t('error_no_items'));
      return;
    }

    if (uploadFile.name.endsWith('.csv') || uploadFile.name.endsWith('.xlsx') || uploadFile.name.endsWith('.xls')) {
      if (!session && !supplier.name) {
        setError(t('error_no_supplier'));
        return;
      }
      if (!customer.name) {
        setError(t('error_no_customer'));
        return;
      }
    }

    setLoading(outputFormat);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (!session) formData.append('supplier', JSON.stringify(supplier));
    formData.append('customer', JSON.stringify(customer));
    formData.append('invoiceMeta', JSON.stringify(invoiceMeta));

    try {
      const response = await fetch(`/api/generate?output=${outputFormat}`, { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputFormat === 'xml' ? 'xrechnung.xml' : 'e-invoice-zugferd.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.show(t('generate_success'), 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('generate_error');
      setError(message);
      toast.show(message, 'error');
    } finally {
      setLoading(null);
    }
  };

  const saveCustomer = async () => {
    if (!customer.name) return toast.show(t('alert_customer_name'), 'error');
    const res = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customer) });
    if (res.ok) {
      const newCust = await res.json();
      setSavedCustomers([...savedCustomers, newCust]);
      toast.show(t('alert_customer_saved'), 'success');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.show(data.error || t('generate_error'), 'error');
    }
  };

  const saveCatalogItem = async (item: LineItem) => {
    if (!item.description) return toast.show(t('alert_item_desc'), 'error');
    const res = await fetch('/api/catalog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
    if (res.ok) {
      const newItem = await res.json();
      setSavedCatalog([...savedCatalog, newItem]);
      toast.show(t('alert_item_saved'), 'success');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.show(data.error || t('generate_error'), 'error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-64 rounded-lg animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl animate-shimmer" />
          <div className="h-64 rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  const canSubmit = mode === 'manual' ? lineItems.some((i) => i.description) : !!file;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        {!session && <Badge color="amber">{t('guest_badge')}</Badge>}
      </div>

      {!session && (
        <Alert kind="warning" className="mb-8">
          {t('guest_warning')}{' '}
          <Link href="/register" className="font-bold underline underline-offset-2">{t('guest_register')}</Link> {t('guest_limit')}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {session ? (
          <Card className="p-6 flex flex-col justify-center items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">{t('supplier_title_auth')}</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">{t('supplier_desc_auth')}</p>
            <Link href="/settings">
              <Button variant="secondary" size="sm">{t('supplier_edit')}</Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-6">
            <CardHeader title={t('supplier_title_guest')} icon={<Building2 className="h-4.5 w-4.5" />} />
            <div className="space-y-4">
              <Input label={t('company_name')} required value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('street')} value={supplier.street} onChange={(e) => setSupplier({ ...supplier, street: e.target.value })} />
                <Input label={t('city')} value={supplier.city} onChange={(e) => setSupplier({ ...supplier, city: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('zip')} value={supplier.zip} onChange={(e) => setSupplier({ ...supplier, zip: e.target.value })} />
                <Select label={t('country')} value={supplier.country} onChange={(e) => setSupplier({ ...supplier, country: e.target.value })}>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </Select>
              </div>
              <Input label={t('vat')} value={supplier.vat} onChange={(e) => setSupplier({ ...supplier, vat: e.target.value })} />
            </div>
          </Card>
        )}

        <Card className="p-6">
          <CardHeader
            title={t('customer_title')}
            icon={<User className="h-4.5 w-4.5" />}
            action={
              savedCustomers.length > 0 && (
                <select
                  className="text-xs font-medium border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1.5"
                  defaultValue=""
                  onChange={(e) => {
                    const selected = savedCustomers.find((c) => c.id === e.target.value);
                    if (selected) setCustomer({ name: selected.name, street: selected.street || '', city: selected.city || '', zip: selected.zip || '', country: selected.country || 'DE', vat: selected.vat || '' });
                  }}
                >
                  <option value="">{t('load_customer')}</option>
                  {savedCustomers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )
            }
          />
          <div className="space-y-4">
            <Input label={t('company_name')} required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('street')} value={customer.street} onChange={(e) => setCustomer({ ...customer, street: e.target.value })} />
              <Input label={t('city')} value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('zip')} value={customer.zip} onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
              <Select label={t('country')} value={customer.country} onChange={(e) => setCustomer({ ...customer, country: e.target.value })}>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </Select>
            </div>
            <div className="flex justify-between items-end gap-4">
              <Input wrapperClassName="flex-1" label={t('vat')} value={customer.vat} onChange={(e) => setCustomer({ ...customer, vat: e.target.value })} />
              {session && (
                <Button type="button" variant="secondary" size="md" onClick={saveCustomer}>
                  <BookmarkPlus className="h-4 w-4" /> {t('save_customer')}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <CardHeader title={t('invoice_details')} icon={<Receipt className="h-4.5 w-4.5" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label={t('invoice_number')} value={invoiceMeta.invoiceNumber} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, invoiceNumber: e.target.value })} />
          <Input type="date" label={t('invoice_date')} value={invoiceMeta.issueDate} onChange={(e) => setInvoiceMeta({ ...invoiceMeta, issueDate: e.target.value })} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CardHeader title={t('add_items')} icon={<ListPlus className="h-4.5 w-4.5" />} />
          <div className="flex bg-gray-100 rounded-lg p-1 self-start">
            <button onClick={() => setMode('upload')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
              <UploadCloud className="h-3.5 w-3.5" /> {t('mode_upload')}
            </button>
            <button onClick={() => setMode('manual')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'manual' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
              <PenLine className="h-3.5 w-3.5" /> {t('mode_manual')}
            </button>
          </div>
        </div>

        {mode === 'upload' ? (
          <>
            <p className="text-sm text-gray-500 mb-5">{t('upload_desc')}</p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex justify-center rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
                dragActive ? 'border-indigo-400 bg-indigo-50/60' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/60'
              }`}
            >
              <div className="text-center pointer-events-none">
                <UploadCloud className={`mx-auto h-9 w-9 ${dragActive ? 'text-indigo-500' : 'text-gray-300'}`} />
                <div className="mt-3 flex text-sm leading-6 text-gray-600 justify-center gap-1">
                  <span className="font-semibold text-indigo-600">{t('select_file')}</span>
                  <p>{t('drag_drop')}</p>
                </div>
                <p className="text-xs leading-5 text-gray-400 mt-1">{t('file_limits')}</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" className="sr-only" accept=".csv, .xlsx, .xls, .json" onChange={handleFileChange} />

            {file && (
              <div className="mt-4 flex items-center gap-3 p-3 pl-4 bg-indigo-50 rounded-lg animate-fade-in-up">
                <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="text-sm font-medium text-indigo-800 flex-1 truncate">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-indigo-400 hover:text-indigo-700 p-1" aria-label="Remove file">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            {savedCatalog.length > 0 && (
              <select
                className="text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border w-full sm:w-auto"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value === '') return;
                  const selected = savedCatalog.find((c) => c.id === e.target.value);
                  if (selected) setLineItems([...lineItems, { description: selected.description, quantity: 1, price: selected.price, taxPercent: selected.taxPercent }]);
                  e.target.value = '';
                }}
              >
                <option value="">{t('add_from_catalog')}</option>
                {savedCatalog.map((c) => <option key={c.id} value={c.id}>{c.description} ({c.price}€)</option>)}
              </select>
            )}
            {lineItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 sm:items-end bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                <Input wrapperClassName="flex-1 w-full" label={t('item_desc')} value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} placeholder={t('item_desc_placeholder')} />
                <Input wrapperClassName="w-full sm:w-24" type="number" step="0.01" label={t('quantity')} value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} />
                <Input wrapperClassName="w-full sm:w-32" type="number" step="0.01" label={t('price')} value={item.price} onChange={(e) => handleLineItemChange(index, 'price', parseFloat(e.target.value))} />
                <Select wrapperClassName="w-full sm:w-24" label={t('tax')} value={item.taxPercent} onChange={(e) => handleLineItemChange(index, 'taxPercent', parseFloat(e.target.value))}>
                  <option value={19}>19%</option>
                  <option value={7}>7%</option>
                  <option value={0}>0%</option>
                </Select>
                <div className="flex gap-1.5 w-full sm:w-auto justify-end shrink-0">
                  {session && (
                    <button onClick={() => saveCatalogItem(item)} className="text-gray-400 hover:text-indigo-600 p-2.5 hover:bg-indigo-50 rounded-lg transition-colors" title={t('save_catalog_title')} aria-label={t('save_catalog_title')}>
                      <BookmarkPlus className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => handleRemoveLineItem(index)} className="text-gray-400 hover:text-red-600 p-2.5 hover:bg-red-50 rounded-lg transition-colors" title={t('remove_title')} aria-label={t('remove_title')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={handleAddLineItem} className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 pt-1">
              <ListPlus className="h-4 w-4" /> {t('add_new_position')}
            </button>

            {lineItems.length > 0 && (
              <div className="flex justify-end pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {t('subtotal')}: <span className="font-semibold text-gray-900">{manualTotal.toFixed(2)} €</span>
                </p>
              </div>
            )}
          </div>
        )}

        {error && <Alert kind="error" className="mt-5">{error}</Alert>}

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="secondary" onClick={() => handleUpload('xml')} disabled={!canSubmit || !!loading} loading={loading === 'xml'}>
            <FileCode className="h-4 w-4" /> {t('download_xml')}
          </Button>
          <Button onClick={() => handleUpload('pdf')} disabled={!canSubmit || !!loading} loading={loading === 'pdf'}>
            <FileDown className="h-4 w-4" /> {t('download_pdf')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
