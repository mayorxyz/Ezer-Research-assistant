"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type TranscriptSegment = {
  start: number
  duration: number
  text: string
}

type TranscriptViewerProps = {
  isOpen: boolean
  onClose: () => void
  videoId: string
  videoTitle: string
  transcript: TranscriptSegment[]
}

export function TranscriptViewer({ isOpen, onClose, videoId, videoTitle, transcript }: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTranscript, setFilteredTranscript] = useState<TranscriptSegment[]>(transcript)
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTranscript(transcript)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTranscript(transcript.filter((segment) => segment.text.toLowerCase().includes(query)))
    }
  }, [searchQuery, transcript])

  useEffect(() => {
    if (selectedSegment !== null && transcriptRef.current) {
      const segmentElement = document.getElementById(`segment-${selectedSegment}`)
      if (segmentElement) {
        segmentElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [selectedSegment])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const highlightSearchText = (text: string): React.ReactNode => {
    if (!searchQuery.trim()) return text

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-500/30 text-white font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const openYouTubeAtTimestamp = (startTime: number) => {
    const url = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}s`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col bg-[#1a1c1e] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center justify-between">
            <span className="truncate">{videoTitle}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search transcript"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-2">
          {filteredTranscript.length} {filteredTranscript.length === 1 ? "segment" : "segments"}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        <div ref={transcriptRef} className="flex-1 overflow-y-auto pr-2 space-y-2">
          {filteredTranscript.length > 0 ? (
            filteredTranscript.map((segment, index) => (
              <div
                key={index}
                id={`segment-${index}`}
                className={`flex gap-3 p-2 rounded hover:bg-gray-800 ${selectedSegment === index ? "bg-gray-800" : ""}`}
                onClick={() => setSelectedSegment(index)}
              >
                <button
                  className="text-xs text-blue-400 w-10 flex-shrink-0 pt-0.5 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    openYouTubeAtTimestamp(segment.start)
                  }}
                >
                  {formatTime(segment.start)}
                </button>
                <div className="text-sm">{highlightSearchText(segment.text)}</div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 py-8">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
