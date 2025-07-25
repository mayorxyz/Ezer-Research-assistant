"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, File, FileText, ImageIcon, FileArchive, Film, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FileWithPreview = {
  id: string
  file: File
  progress: number
  status: "uploading" | "complete" | "error"
  previewUrl?: string
}

export function FileUpload({
  onFilesUploaded,
}: {
  onFilesUploaded?: (files: FileWithPreview[]) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileWithPreview[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload for each file
    newFiles.forEach((fileObj) => {
      simulateFileUpload(fileObj.id)

      // Create preview URL for images
      if (fileObj.file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileObj.id ? { ...f, previewUrl: e.target?.result as string } : f)),
            )
          }
        }
        reader.readAsDataURL(fileObj.file)
      }
    })

    if (onFilesUploaded) {
      onFilesUploaded(newFiles)
    }
  }

  const simulateFileUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress, status: "complete" } : f)))
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    const type = file.type

    if (type.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-blue-400" />
    if (type.startsWith("video/")) return <Film className="h-6 w-6 text-purple-400" />
    if (type.startsWith("audio/")) return <Music className="h-6 w-6 text-green-400" />
    if (type.includes("pdf")) return <FileText className="h-6 w-6 text-red-400" />
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-6 w-6 text-yellow-400" />

    return <File className="h-6 w-6 text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50/5" : "border-gray-700 hover:border-gray-600",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" multiple />
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-lg font-medium mb-1">Drag files here or click to upload</p>
        <p className="text-sm text-gray-400 text-center">Support for documents, PDFs, images, audio, and video files</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Uploaded files</h3>
          <div className="space-y-2">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {fileObj.previewUrl ? (
                      <div className="w-full h-full overflow-hidden rounded">
                        <img
                          src={fileObj.previewUrl || "/placeholder.svg"}
                          alt={fileObj.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      getFileIcon(fileObj.file)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(fileObj.file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(fileObj.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {fileObj.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={fileObj.progress} className="h-1 bg-gray-700" />
                        <p className="text-xs text-gray-400 mt-1">{fileObj.progress}% uploaded</p>
                      </div>
                    )}
                    {fileObj.status === "complete" && <p className="text-xs text-green-400 mt-1">Upload complete</p>}
                    {fileObj.status === "error" && <p className="text-xs text-red-400 mt-1">Upload failed</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
