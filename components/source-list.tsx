"use client"

import { useState } from "react"
import { FileText, ImageIcon, FileArchive, Film, Music, File, MoreVertical, Youtube, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TranscriptViewer } from "@/components/transcript-viewer"

type TranscriptSegment = {
  start: number
  duration: number
  text: string
}

export type Source = {
  id: string
  name: string
  type: string
  size: string
  dateAdded: string
  previewUrl?: string
  transcript?: TranscriptSegment[]
}

export function SourceList({ sources }: { sources: Source[] }) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [currentTranscriptSource, setCurrentTranscriptSource] = useState<Source | null>(null)

  const getSourceIcon = (type: string) => {
    if (type === "video/youtube") return <Youtube className="h-5 w-5 text-red-400" />
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-400" />
    if (type.startsWith("video/")) return <Film className="h-5 w-5 text-purple-400" />
    if (type.startsWith("audio/")) return <Music className="h-5 w-5 text-green-400" />
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-5 w-5 text-yellow-400" />

    return <File className="h-5 w-5 text-gray-400" />
  }

  const openTranscript = (source: Source) => {
    setCurrentTranscriptSource(source)
    setIsTranscriptOpen(true)
  }

  if (sources.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-300 px-1">Your sources</h3>
      <div className="space-y-1">
        {sources.map((source) => (
          <div
            key={source.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              selectedSource === source.id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => setSelectedSource(source.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                {source.previewUrl ? (
                  <div className="w-full h-full overflow-hidden rounded">
                    <img
                      src={source.previewUrl || "/placeholder.svg"}
                      alt={source.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  getSourceIcon(source.type)
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate">{source.name}</p>
                  {source.transcript && (
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        openTranscript(source)
                      }}
                    >
                      <Search className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400">{source.size}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>View details</DropdownMenuItem>
                {source.transcript && (
                  <DropdownMenuItem onClick={() => openTranscript(source)}>Search transcript</DropdownMenuItem>
                )}
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Transcript Viewer Dialog */}
      {currentTranscriptSource && currentTranscriptSource.transcript && (
        <TranscriptViewer
          isOpen={isTranscriptOpen}
          onClose={() => setIsTranscriptOpen(false)}
          videoId={currentTranscriptSource.id}
          videoTitle={currentTranscriptSource.name}
          transcript={currentTranscriptSource.transcript}
        />
      )}
    </div>
  )
}
