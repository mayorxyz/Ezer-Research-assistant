"use client"
import Link from "next/link"
import React from 'react'
import { Button } from "@/components/ui/button"

const Consulting = () => {
  return (
    <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xl font-semibold">EzerAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
  )
}

export default Consulting
