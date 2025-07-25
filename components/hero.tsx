import React from 'react'
import AudioDropZone from './file-drop'

export default function Hero() {
  return (
    <section className="py-18 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform your files into Powerful Knowledge Bases For Research with AI
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-10">
            EzerAI extracts summaries from your sources with the power of AI. Sources range from recorded audio, client meetings, documents, youtube videos and much more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <AudioDropZone/>
          </div>
        </div>
      </section>
  )
}