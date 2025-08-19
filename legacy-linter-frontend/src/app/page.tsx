// src/app/page.tsx (with Hero Background)
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-sm z-20">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Legacy Linter</h1>
          <Link href="/auth" className="bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section with Background */}
      <main 
        className="relative flex items-center justify-center h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Modernize Your Codebase, Instantly.
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            Leverage the power of GPT-5 to not just refactor, but to analyze, document, test, and visualize your legacy code. Turn technical debt into a competitive advantage.
          </p>
          <Link href="/auth" className="mt-8 inline-block bg-sky-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-sky-700 transition-colors">
            Start Modernizing for Free
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Intelligent Refactoring</h3>
            <p className="text-slate-600">Convert code between languages with documentation and comments automatically generated.</p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Automated Audits & Tests</h3>
            <p className="text-slate-600">Receive performance audits and basic unit tests for your new code, ensuring quality from the start.</p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Architectural Visualization</h3>
            {/* CORRECTED LINE */}
            <p className="text-slate-600">Get AI-generated diagrams and flowcharts to visually understand your new code&apos;s architecture.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-white">
        <p className="text-slate-500">&copy; 2025 Legacy Linter. A Hackathon Project.</p>
      </footer>
    </div>
  );
}