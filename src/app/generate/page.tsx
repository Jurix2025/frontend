'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PDFPreview } from '@/components/PDFPreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFTemplate } from '@/components/PDFTemplate';

type DocumentType = 'lease' | 'nda' | 'contract' | 'will' | 'petition' | null;
type Language = 'uzbek' | 'russian';

const documentTypes = [
  {
    id: 'lease' as DocumentType,
    title: 'Lease Agreement',
    description: 'Rental contracts for property with terms, rent, and obligations',
    icon: '🏠',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'nda' as DocumentType,
    title: 'Non-Disclosure Agreement',
    description: 'Protect confidential information with comprehensive NDAs',
    icon: '🔒',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'contract' as DocumentType,
    title: 'Service Contract',
    description: 'General contracts for services, employment, or agreements',
    icon: '📝',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'will' as DocumentType,
    title: 'Last Will & Testament',
    description: 'Declare how assets should be distributed and appoint executors',
    icon: '⚖️',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'petition' as DocumentType,
    title: 'Court Petition',
    description: 'Applications and petitions for court proceedings',
    icon: '🏛️',
    gradient: 'from-green-500 to-emerald-600',
  },
];

export default function GeneratePage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>(null);
  const [language, setLanguage] = useState<Language>('uzbek');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const renderForm = () => {
    if (!selectedDoc) return null;

    const commonFields = (
      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-2">Document Language</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setLanguage('uzbek')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                language === 'uzbek'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🇺🇿 Uzbek
            </button>
            <button
              type="button"
              onClick={() => setLanguage('russian')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                language === 'russian'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🇷🇺 Russian
            </button>
          </div>
        </div>
      </div>
    );

    switch (selectedDoc) {
      case 'lease':
        return (
          <div className="space-y-6">
            {commonFields}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Landlord Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter landlord name"
                  onChange={(e) => setFormData({ ...formData, landlord: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Tenant Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter tenant name"
                  onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Property Address</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter property address"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Monthly Rent (UZS)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter monthly rent"
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Lease Duration</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 1 year"
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'nda':
        return (
          <div className="space-y-6">
            {commonFields}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Party One</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter first party name"
                  onChange={(e) => setFormData({ ...formData, party1: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Party Two</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter second party name"
                  onChange={(e) => setFormData({ ...formData, party2: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Purpose of Disclosure</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the purpose"
                rows={3}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Confidentiality Duration</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 3 years"
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>
        );

      case 'contract':
        return (
          <div className="space-y-6">
            {commonFields}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Party One</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter first party name"
                  onChange={(e) => setFormData({ ...formData, party1: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Party Two</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter second party name"
                  onChange={(e) => setFormData({ ...formData, party2: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Scope of Work/Services</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the services or work"
                rows={4}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Payment Amount (UZS)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter payment amount"
                  onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Contract Duration</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 6 months"
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'will':
        return (
          <div className="space-y-6">
            {commonFields}
            <div>
              <label className="block text-white font-semibold mb-2">Testator Name (Your Name)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
                onChange={(e) => setFormData({ ...formData, testator: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Executor Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Person to execute the will"
                onChange={(e) => setFormData({ ...formData, executor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Assets & Bequests</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe assets and how they should be distributed"
                rows={5}
                onChange={(e) => setFormData({ ...formData, bequests: e.target.value })}
              />
            </div>
          </div>
        );

      case 'petition':
        return (
          <div className="space-y-6">
            {commonFields}
            <div>
              <label className="block text-white font-semibold mb-2">Court Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Tashkent City Court"
                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Petition Type</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Divorce, Civil Claim, etc."
                onChange={(e) => setFormData({ ...formData, petitionType: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Petitioner Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                  onChange={(e) => setFormData({ ...formData, petitioner: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Respondent Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Other party name"
                  onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Grounds for Petition</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Explain the grounds for your petition"
                rows={5}
                onChange={(e) => setFormData({ ...formData, grounds: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚖️</span>
              </div>
              <span className="text-2xl font-bold text-white">Jurix</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/analyze" className="text-gray-300 hover:text-white transition">
                Analyze
              </Link>
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {!selectedDoc ? (
            <>
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Choose Document <span className="gradient-text">Type</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Select the type of legal document you want to generate
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 group"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <span className="text-4xl">{doc.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{doc.title}</h3>
                    <p className="text-gray-300">{doc.description}</p>
                  </button>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-16 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-yellow-300 font-semibold">Legal Disclaimer:</span> This AI service generates draft documents for informational purposes only. Always consult a qualified lawyer before using any generated document legally.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-[1600px] mx-auto">
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-300 hover:text-white transition mb-8 flex items-center gap-2"
              >
                ← Back to Document Types
              </button>

              {/* Header */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${documentTypes.find(d => d.id === selectedDoc)?.gradient} rounded-2xl flex items-center justify-center`}>
                    <span className="text-3xl">{documentTypes.find(d => d.id === selectedDoc)?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{documentTypes.find(d => d.id === selectedDoc)?.title}</h2>
                    <p className="text-gray-300 text-sm">{documentTypes.find(d => d.id === selectedDoc)?.description}</p>
                  </div>
                </div>
              </div>

              {/* Split View: PDF Preview (Left) + Form (Right) */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Left: PDF Preview */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Live Preview</h3>
                    {Object.values(formData).some(v => v && v.trim() !== '') && (
                      <PDFDownloadLink
                        document={
                          <PDFTemplate
                            documentType={selectedDoc || ''}
                            language={language}
                            formData={formData}
                          />
                        }
                        fileName={`${selectedDoc}_${new Date().toISOString().split('T')[0]}.pdf`}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                      >
                        {({ loading }) => (loading ? 'Preparing...' : 'Download PDF')}
                      </PDFDownloadLink>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg" style={{ height: '800px' }}>
                    <PDFPreview
                      documentType={selectedDoc || ''}
                      language={language}
                      formData={formData}
                    />
                  </div>
                </div>

                {/* Right: Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Document Details</h3>
                  <form onSubmit={(e) => { e.preventDefault(); }} className="h-[800px] overflow-y-auto pr-2">
                    {renderForm()}
                  </form>
                </div>
              </div>

              {/* AI Notice */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🤖</span>
                  <div>
                    <h4 className="text-blue-300 font-semibold mb-1">AI-Generated Content</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This document is generated by AI and must be labeled as such according to Uzbekistan&apos;s AI regulations. It should be reviewed by a legal professional before use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">🤖 Generated with AI • Made for Uzbekistan</p>
          <p className="text-sm">© 2024 Jurix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
