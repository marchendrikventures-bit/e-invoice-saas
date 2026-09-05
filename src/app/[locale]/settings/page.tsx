'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Settings() {
  const t = useTranslations('Settings');
  const { data: session, status } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState({
    companyName: '', street: '', city: '', zip: '', country: 'DE', vat: '',
    iban: '', bic: '', bankName: '',
    brandColor: '#2563eb', logoBase64: ''
  });
  const [apiKey, setApiKey] = useState('');
  const [tier, setTier] = useState('FREE');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setSettings({
              companyName: data.companyName || '',
              street: data.street || '',
              city: data.city || '',
              zip: data.zip || '',
              country: data.country || 'DE',
              vat: data.vat || '',
              iban: data.iban || '',
              bic: data.bic || '',
              bankName: data.bankName || '',
              brandColor: data.brandColor || '#2563eb',
              logoBase64: data.logoBase64 || '',
            });
            setApiKey(data.apiKey || '');
            setTier(data.tier || 'FREE');
          }
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logoBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const res = await fetch('/api/settings/apikey', { method: 'POST' });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        setMessage('API Key generated successfully!');
      }
    } catch (err) {
      setMessage('Failed to generate API key.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage(t('success'));
      } else {
        setMessage(t('error'));
      }
    } catch (err) {
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">{t('loading')}</div>;

  const InputField = ({ label, value, onChange, required = false }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type="text" required={required} value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account {t('title')}</h1>
      
      <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('company_info')}</h2>
        <p className="text-sm text-gray-500 mb-6">
          These details will be used automatically as the "Supplier" (Creator) when generating e-invoices.
        </p>

        {message && (
          <div className={`p-4 mb-6 rounded-md text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <InputField label={`${t("company_name")} *`} required value={settings.companyName} onChange={(e: any) => setSettings({...settings, companyName: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label={t("street")} value={settings.street} onChange={(e: any) => setSettings({...settings, street: e.target.value})} />
            <InputField label={t("city")} value={settings.city} onChange={(e: any) => setSettings({...settings, city: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label={t("zip")} value={settings.zip} onChange={(e: any) => setSettings({...settings, zip: e.target.value})} />
            <InputField label={t("country")} value={settings.country} onChange={(e: any) => setSettings({...settings, country: e.target.value})} />
          </div>
          <InputField label={t("vat")} value={settings.vat} onChange={(e: any) => setSettings({...settings, vat: e.target.value})} />
          
          <h3 className="text-md font-medium text-gray-900 mt-8 mb-4 border-t pt-6">{t('bank_details')}</h3>
          <InputField label={t("iban")} value={settings.iban} onChange={(e: any) => setSettings({...settings, iban: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label={t("bic")} value={settings.bic} onChange={(e: any) => setSettings({...settings, bic: e.target.value})} />
            <InputField label={t("bank_name")} value={settings.bankName} onChange={(e: any) => setSettings({...settings, bankName: e.target.value})} />
          </div>

          {tier === 'PRO' && (
            <>
              <h3 className="text-md font-medium text-gray-900 mt-8 mb-4 border-t pt-6">{t('branding_pro')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">{t('brand_color')}</label>
                  <input type="color" value={settings.brandColor} onChange={(e) => setSettings({...settings, brandColor: e.target.value})} className="mt-1 h-10 w-full cursor-pointer rounded-md border-gray-300" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">{t('logo')}</label>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {settings.logoBase64 && <img src={settings.logoBase64} alt="Logo Preview" className="mt-2 h-12 object-contain" />}
                </div>
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm bg-blue-600 hover:bg-blue-500 focus-visible:outline disabled:bg-blue-300"
            >
              {saving ? t('saving') : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {tier === 'PRO' && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('api_pro')}</h2>
          <p className="text-sm text-gray-500 mb-6">
            Use this API key to automate invoice generation from your own systems (e.g., WooCommerce, Shopify).
          </p>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              readOnly 
              value={apiKey || 'No API Key generated yet.'} 
              className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-gray-50 text-gray-700" 
            />
            <button
              onClick={handleGenerateApiKey}
              className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {apiKey ? 'Regenerate' : 'Generate'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
