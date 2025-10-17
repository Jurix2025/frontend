import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚖️</span>
              </div>
              <span className="text-2xl font-bold text-white">Jurix</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <Link
                href="/generate"
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
              <span className="text-indigo-300 text-sm font-medium">🤖 Powered by AI • Made for Uzbekistan</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="block text-white mb-2">Legal Documents</span>
              <span className="gradient-text animate-gradient">Generated Instantly</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate professional legal documents in seconds with AI. Contracts, NDAs, Leases, Wills, and Court Petitions in <span className="text-indigo-400 font-semibold">Uzbek</span> and <span className="text-purple-400 font-semibold">Russian</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/generate"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 animate-pulse-glow"
              >
                Generate Document Now →
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">5+</div>
                <div className="text-gray-400">Document Types</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">2</div>
                <div className="text-gray-400">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">⚡</div>
                <div className="text-gray-400">Instant Generation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">🔒</div>
                <div className="text-gray-400">Secure & Private</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mb-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Why Choose <span className="gradient-text">Jurix</span>?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Multiple Document Types</h3>
                <p className="text-gray-300 leading-relaxed">
                  Generate contracts, NDAs, lease agreements, wills, court petitions, and more. All tailored to Uzbekistan's legal context.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Bilingual Support</h3>
                <p className="text-gray-300 leading-relaxed">
                  Full support for Uzbek (Latin script) and Russian languages. Choose your preferred language for documents.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Generation</h3>
                <p className="text-gray-300 leading-relaxed">
                  Powered by advanced AI, get professional documents in seconds. Download as PDF immediately.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Save Time & Money</h3>
                <p className="text-gray-300 leading-relaxed">
                  No need for expensive lawyers for draft documents. Get started for free and save hours of work.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Secure & Private</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your data is not stored. All generation happens on-the-fly with HTTPS encryption for your privacy.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mobile Friendly</h3>
                <p className="text-gray-300 leading-relaxed">
                  Works perfectly on any device. Generate and download documents from your phone, tablet, or computer.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="mb-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              How It <span className="gradient-text">Works</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Choose Document Type</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Select from contracts, NDAs, lease agreements, wills, or court petitions. Each type is tailored for Uzbekistan's legal system.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Fill in Details</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Enter your information in a simple form. Names, dates, amounts, and other relevant details for your document.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">AI Generates Document</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Our advanced AI creates a professional, legally-structured document in your chosen language within seconds.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Download & Review</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Download your document as a PDF. Review it with a legal professional before finalizing for official use.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/generate"
                className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                Start Generating Now →
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">Important Legal Disclaimer</h3>
                <p className="text-gray-300 leading-relaxed">
                  This AI service is not a substitute for professional legal advice. Documents are generated by AI and may contain errors or omissions.
                  <span className="text-white font-semibold"> Always review the output and consult a qualified lawyer before using any generated document legally.</span> This tool provides drafts for informational purposes only and does not establish an attorney-client relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">🤖 Generated with AI • Made for Uzbekistan</p>
          <p className="text-sm">© 2024 Jurix. All rights reserved. This is a prototype hackathon project.</p>
        </div>
      </footer>
    </div>
  );
}
