'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Landmark, Palette, KeyRound, Download, ShieldAlert, Copy, Check } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { COUNTRIES } from '@/lib/countries';

export default function Settings() {
  const t = useTranslations('Settings');
  const { status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [settings, setSettings] = useState({
    companyName: '', street: '', city: '', zip: '', country: 'DE', vat: '',
    iban: '', bic: '', bankName: '',
    brandColor: '#2563eb', logoBase64: ''
  });
  const [apiKey, setApiKey] = useState('');
  const [tier, setTier] = useState('FREE');
  const [hasPassword, setHasPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
            setHasPassword(data.hasPassword !== false);
          }
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError(t('delete_confirm_mismatch'));
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hasPassword ? { password: deletePassword } : {}),
      });
      const data = await res.json();
      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        setDeleteError(data.error || t('delete_error'));
      }
    } catch {
      setDeleteError(t('delete_error'));
    } finally {
      setDeleting(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSettings({ ...settings, logoBase64: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateApiKey = async () => {
    setGeneratingKey(true);
    try {
      const res = await fetch('/api/settings/apikey', { method: 'POST' });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        toast.show(t('api_generated'), 'success');
      } else {
        toast.show(data.error || t('error'), 'error');
      }
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      toast.show(res.ok ? t('success') : t('error'), res.ok ? 'success' : 'error');
    } catch {
      toast.show(t('error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-64 rounded-lg animate-shimmer" />
        <div className="h-96 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
        <Badge color={tier === 'PRO' ? 'indigo' : 'gray'}>{tier}</Badge>
      </div>

      <Card className="p-6 mb-6">
        <CardHeader title={t('company_info')} description={t('company_info_desc')} icon={<Building2 className="h-4.5 w-4.5" />} />

        <form onSubmit={handleSave} className="space-y-4">
          <Input label={t('company_name')} required value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('street')} value={settings.street} onChange={(e) => setSettings({ ...settings, street: e.target.value })} />
            <Input label={t('city')} value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('zip')} value={settings.zip} onChange={(e) => setSettings({ ...settings, zip: e.target.value })} />
            <Select label={t('country')} value={settings.country} onChange={(e) => setSettings({ ...settings, country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </Select>
          </div>
          <Input label={t('vat')} value={settings.vat} onChange={(e) => setSettings({ ...settings, vat: e.target.value })} />

          <div className="border-t border-gray-100 pt-6 mt-2">
            <CardHeader title={t('bank_details')} icon={<Landmark className="h-4.5 w-4.5" />} />
            <div className="space-y-4">
              <Input label={t('iban')} value={settings.iban} onChange={(e) => setSettings({ ...settings, iban: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('bic')} value={settings.bic} onChange={(e) => setSettings({ ...settings, bic: e.target.value })} />
                <Input label={t('bank_name')} value={settings.bankName} onChange={(e) => setSettings({ ...settings, bankName: e.target.value })} />
              </div>
            </div>
          </div>

          {tier === 'PRO' ? (
            <div className="border-t border-gray-100 pt-6 mt-2">
              <CardHeader title={t('branding_pro')} icon={<Palette className="h-4.5 w-4.5" />} />
              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('brand_color')}</label>
                  <div className="flex items-center gap-3 rounded-lg ring-1 ring-inset ring-gray-300 p-1.5 bg-white">
                    <input type="color" value={settings.brandColor} onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent" />
                    <span className="text-sm text-gray-500 font-mono">{settings.brandColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('logo')}</label>
                  <div className="flex items-center gap-3">
                    {settings.logoBase64 && (
                      // eslint-disable-next-line @next/next/no-img-element -- user-supplied data: URL, not an optimizable static asset
                      <img src={settings.logoBase64} alt={t('logo_preview_alt')} className="h-10 w-10 object-contain rounded border border-gray-100 bg-gray-50 p-1" />
                    )}
                    <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="block flex-1 text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-5 mt-2 flex items-center justify-between gap-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Palette className="h-4 w-4 text-gray-400" />
                {t('pro_only')}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button type="submit" loading={saving}>{t('save')}</Button>
          </div>
        </form>
      </Card>

      {tier === 'PRO' && (
        <Card className="p-6 mb-6">
          <CardHeader title={t('api_key')} description={t('api_desc')} icon={<KeyRound className="h-4.5 w-4.5" />} />
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={apiKey || t('api_no_key')}
                className="block w-full rounded-lg border-0 py-2.5 px-3.5 text-sm font-mono shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 text-gray-700"
              />
              {apiKey && (
                <button onClick={handleCopyKey} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600" aria-label="Copy">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>
            <Button variant="secondary" onClick={handleGenerateApiKey} loading={generatingKey} className="shrink-0">
              {apiKey ? t('api_regenerate') : t('api_generate')}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 ring-1 ring-red-100">
        <CardHeader title={t('danger_zone')} icon={<ShieldAlert className="h-4.5 w-4.5 text-red-600" />} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">{t('export_data_title')}</p>
            <p className="text-sm text-gray-500">{t('export_data_desc')}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this targets an API route (file download), not an app page */}
          <a
            href="/api/account/export"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" /> {t('export_data_btn')}
          </a>
        </div>

        <div className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{t('delete_account_title')}</p>
              <p className="text-sm text-gray-500">{t('delete_account_desc')}</p>
            </div>
            {!showDeleteForm && (
              <Button variant="danger" onClick={() => setShowDeleteForm(true)} className="shrink-0">
                {t('delete_account_btn')}
              </Button>
            )}
          </div>

          {showDeleteForm && (
            <form onSubmit={handleDeleteAccount} className="mt-4 bg-red-50/70 rounded-xl p-4 animate-fade-in-up">
              {deleteError && <p className="mb-4 text-sm font-medium text-red-800">{deleteError}</p>}
              <div className="space-y-4">
                {hasPassword && (
                  <Input
                    type="password"
                    required
                    label={t('delete_password_label')}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                )}
                <Input
                  type="text"
                  required
                  label={t('delete_confirm_label')}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowDeleteForm(false); setDeleteError(''); setDeletePassword(''); setDeleteConfirmText(''); }}
                >
                  {t('delete_cancel_btn')}
                </Button>
                <Button type="submit" variant="danger" loading={deleting}>
                  {t('delete_confirm_btn')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
