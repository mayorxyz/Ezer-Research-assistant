"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

type TranscriptSegment = {
  start: number
  duration: number
  text: string
}

type YouTubeVideoInfo = {
  id: string
  title: string
  thumbnailUrl: string
  duration: string
  channelTitle: string
  transcript?: TranscriptSegment[]
}

type YouTubeIntegrationProps = {
  isOpen: boolean
  onClose: () => void
  onVideoAdded: (video: YouTubeVideoInfo) => void
}

export function YouTubeIntegration({ isOpen, onClose, onVideoAdded }: YouTubeIntegrationProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null)
  const [includeTranscript, setIncludeTranscript] = useState(true)
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false)
  const [transcriptError, setTranscriptError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"video" | "transcript">("video")

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setError(null)
    setTranscriptError(null)
  }

  const extractVideoId = (url: string): string | null => {
    // Regular expressions to match YouTube URL patterns
    const regexps = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i,
      /youtube\.com\/embed\/([^&?/]+)/i,
      /youtube\.com\/v\/([^&?/]+)/i,
      /youtube\.com\/user\/[^/?]+\/?\?v=([^&?/]+)/i,
    ]

    for (const regex of regexps) {
      const match = url.match(regex)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  const fetchVideoInfo = () => {
    setIsLoading(true)
    setError(null)
    setVideoInfo(null)
    setTranscriptError(null)

    const videoId = extractVideoId(url)

    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.")
      setIsLoading(false)
      return
    }

    // In a real implementation, you would call the YouTube API
    // For this demo, we'll simulate the API call with mock data
    setTimeout(() => {
      // Mock successful response
      if (videoId) {
        const mockVideoInfo: YouTubeVideoInfo = {
          id: videoId,
          title: "How to Use AI for Research - Tutorial",
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: "10:24",
          channelTitle: "AI Research Channel",
        }
        setVideoInfo(mockVideoInfo)

        if (includeTranscript) {
          fetchTranscript(videoId)
        }
      } else {
        setError("Could not fetch video information. Please try again.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const fetchTranscript = (videoId: string) => {
    setIsLoadingTranscript(true)
    setTranscriptError(null)

    // In a real implementation, you would call the YouTube Captions API
    // For this demo, we'll simulate the API call with mock data
    setTimeout(() => {
      // Mock transcript data
      const mockTranscript: TranscriptSegment[] = [
        { start: 0, duration: 6.5, text: "Welcome to this tutorial on using AI for research." },
        { start: 6.5, duration: 5.2, text: "Today we'll explore how AI can help you analyze large amounts of data." },
        {
          start: 11.7,
          duration: 7.8,
          text: "Let's start by looking at some common AI tools used in academic research.",
        },
        {
          start: 19.5,
          duration: 8.3,
          text: "First, natural language processing or NLP can help you analyze text documents.",
        },
        { start: 27.8, duration: 6.1, text: "This is particularly useful when you have hundreds of papers to review." },
        {
          start: 33.9,
          duration: 9.2,
          text: "Second, machine learning algorithms can identify patterns in your data that might be difficult to spot manually.",
        },
        {
          start: 43.1,
          duration: 7.5,
          text: "Third, AI-powered research assistants can help you organize and summarize information.",
        },
        {
          start: 50.6,
          duration: 8.9,
          text: "Now let's look at a practical example of using AI to analyze research papers.",
        },
        {
          start: 59.5,
          duration: 10.2,
          text: "I'll demonstrate how to use NotebookLM to extract insights from multiple sources.",
        },
        { start: 69.7, duration: 8.4, text: "First, upload your PDFs or other documents to the platform." },
        {
          start: 78.1,
          duration: 7.3,
          text: "Then, ask specific questions about your sources to get targeted information.",
        },
        {
          start: 85.4,
          duration: 9.6,
          text: "The AI will analyze the content and provide answers with citations to the original sources.",
        },
        { start: 95.0, duration: 8.8, text: "This saves you hours of manual reading and note-taking." },
        {
          start: 103.8,
          duration: 11.2,
          text: "Another benefit is that you can generate summaries, comparisons, and even identify research gaps.",
        },
        {
          start: 115.0,
          duration: 9.5,
          text: "Remember that AI tools should complement your research process, not replace critical thinking.",
        },
        {
          start: 124.5,
          duration: 10.3,
          text: "Always verify the information and use your expertise to evaluate the AI's output.",
        },
        {
          start: 134.8,
          duration: 8.7,
          text: "In conclusion, AI can significantly enhance your research workflow and productivity.",
        },
        {
          start: 143.5,
          duration: 7.9,
          text: "Thanks for watching this tutorial. Don't forget to subscribe for more research tips.",
        },
      ]

      setVideoInfo((prev) => (prev ? { ...prev, transcript: mockTranscript } : null))
      setIsLoadingTranscript(false)
      setActiveTab("transcript")
    }, 1500)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAddVideo = () => {
    if (videoInfo) {
      onVideoAdded(videoInfo)
      onClose()
      setUrl("")
      setVideoInfo(null)
      setActiveTab("video")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1c1e] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Add YouTube Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Paste YouTube URL here"
              value={url}
              onChange={handleUrlChange}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button onClick={fetchVideoInfo} disabled={isLoading || !url}>
              {isLoading ? "Loading..." : "Fetch"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-transcript"
              checked={includeTranscript}
              onCheckedChange={(checked) => setIncludeTranscript(checked as boolean)}
              className="data-[state=checked]:bg-blue-600"
            />
            <label
              htmlFor="include-transcript"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Extract transcript (when available)
            </label>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {videoInfo && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "video" | "transcript")}>
              <TabsList className="bg-gray-800">
                <TabsTrigger value="video">Video Info</TabsTrigger>
                <TabsTrigger value="transcript" disabled={!videoInfo.transcript && !isLoadingTranscript}>
                  Transcript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="mt-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-32 h-20 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={videoInfo.thumbnailUrl || "/placeholder.svg"}
                        alt={videoInfo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if the maxresdefault thumbnail doesn't exist
                          const target = e.target as HTMLImageElement
                          target.src = `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{videoInfo.title}</h3>
                      <div className="flex items-center text-xs text-gray-400">
                        <span>{videoInfo.channelTitle}</span>
                        <span className="mx-2">•</span>
                        <span>{videoInfo.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transcript" className="mt-4">
                {isLoadingTranscript ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : transcriptError ? (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{transcriptError}</AlertDescription>
                  </Alert>
                ) : videoInfo.transcript ? (
                  <div className="bg-gray-800 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {videoInfo.transcript.map((segment, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="text-xs text-gray-400 w-10 flex-shrink-0 pt-0.5">
                            {formatTime(segment.start)}
                          </div>
                          <div className="text-sm">{segment.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
                    No transcript available for this video.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <div className="pt-2 text-sm text-gray-400">
            <p>
              Adding a YouTube video with its transcript will allow you to search through the video content and find
              specific information quickly.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700">
            Cancel
          </Button>
          <Button onClick={handleAddVideo} disabled={!videoInfo}>
            Add to Sources
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
