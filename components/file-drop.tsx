"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileAudio, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioFile {
  file: File
  name: string
  size: string
  duration?: string
}

export default function AudioDropZone() {
  const [dragActive, setDragActive] = useState(false)
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [error, setError] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateAudioFile = (file: File): boolean => {
    const validTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/mp4",
      "audio/m4a",
      "audio/aac",
      "audio/flac",
    ]

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid audio file (MP3, WAV, M4A, AAC, FLAC)")
      return false
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB")
      return false
    }

    return true
  }

  const handleFile = useCallback(async (file: File) => {
    setError("")

    if (!validateAudioFile(file)) {
      return
    }

    setIsProcessing(true)

    try {
      // Create audio element to get duration
      const audio = new Audio()
      const objectUrl = URL.createObjectURL(file)

      audio.src = objectUrl

      await new Promise((resolve, reject) => {
        audio.addEventListener("loadedmetadata", resolve)
        audio.addEventListener("error", reject)
      })

      const duration = audio.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      const durationString = `${minutes}:${seconds.toString().padStart(2, "0")}`

      setAudioFile({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        duration: durationString,
      })

      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      setError("Error processing audio file. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setAudioFile(null)
    setError("")
  }

  const handleTranscribe = () => {
    if (audioFile) {
      // Here you would implement the actual transcription logic
      console.log("Starting transcription for:", audioFile.name)
      // You could integrate with services like OpenAI Whisper, AssemblyAI, etc.
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {!audioFile ? (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors duration-200",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary/50",
          )}
        >
          <CardContent className="p-8">
            <div
              className="text-center space-y-4"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {dragActive ? "Drop your audio file here" : "Upload audio file"}
                </h3>
                <p className="text-sm text-muted-foreground">Drag and drop your audio file here, or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supports MP3, WAV, M4A, AAC, OGG, WebM, FLAC (max 100MB)
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleInputChange}
                  className="hidden"
                  id="audio-upload"
                  disabled={isProcessing}
                />
                <label htmlFor="audio-upload">
                  <Button variant="outline" className="cursor-pointer" disabled={isProcessing} asChild>
                    <span>
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileAudio className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{audioFile.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span>{audioFile.size}</span>
                  {audioFile.duration && <span>{audioFile.duration}</span>}
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={removeFile} className="flex-shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleTranscribe} className="flex-1">
                Start Transcription
              </Button>
              <Button variant="outline" onClick={removeFile}>
                Upload Different File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
