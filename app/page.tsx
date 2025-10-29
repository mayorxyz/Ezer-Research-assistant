"use client"
import Link from "next/link"
import { ArrowRight, FileText, MessageSquare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import AudioDropZone from "@/components/file-drop"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a1c1e] text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-900 dark:border-white"></div>
            </div>
            <span className="text-xl font-semibold">EzerAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Consulting
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-18 md:py-20 min-h-[600px]">
        {/* 1) Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/video/7891_Particles_Particle_1280x720.mp4" type="video/mp4" />
          <source src="/video/7891_Particles_Particle_1280x720.webm" type="video/webm" />
        </video>
        {/* 2) Dark overlay for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        {/* 3) Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Transform your files into Powerful Knowledge Bases For Research with AI
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-10">
            EzerAI extracts summaries from your sources with the power of AI. Sources range from recorded audio, client meetings, documents, YouTube videos, and much more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <AudioDropZone />
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">Everything you need for smarter research</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Source Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload PDFs, websites, text, videos, or audio files. NotebookLM organizes and analyzes them
                automatically.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI-Powered Chat</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask questions about your sources and get accurate, contextual answers with citations and references.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mx-auto mt-10">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/sign-up">
                Try for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div> 
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">How NotebookLM works</h2>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload your sources</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Add PDFs, websites, text files, videos, or audio recordings to your notebook.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none border border-blue-200 dark:border-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Supports multiple file formats
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Automatic text extraction and processing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 mb-12">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Chat with your sources</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Ask questions and get answers based on your uploaded materials.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none border border-blue-200 dark:border-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      AI understands context across multiple sources
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Responses include citations and references
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate insights</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create notes, summaries, and other content based on your sources.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-none border border-blue-200 dark:border-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Study guides, FAQs, timelines, and more
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Customize output to match your needs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to transform your research?</h2>
          <p className="text-xl text-white/90 dark:text-gray-200 max-w-2xl mx-auto mb-10">
            Join thousands of researchers, students, and professionals who use NotebookLM to work smarter.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white dark:bg-white text-blue-900 dark:text-blue-900 hover:bg-gray-100 dark:hover:bg-gray-100">
            <Link href="/sign-up">
              Get started for free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-gray-900 dark:border-white"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">NotebookLM</span>
            </div>

            <div className="flex flex-wrap gap-8 justify-center mb-6 md:mb-0">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Help
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <div className="text-gray-600 dark:text-gray-400 text-sm">© 2025 NotebookLM. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
