import React from 'react'
import AudioDropZone from './file-drop'

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[600px]">
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
      <div className="relative z-20 py-18 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Transform your files into Powerful Knowledge Bases For Research with AI
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-10">
            EzerAI extracts summaries from your sources with the power of AI. Sources range from recorded audio, client meetings, documents, youtube videos and much more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <AudioDropZone />
          </div>
        </div>
      </div>
    </section>
  )
}