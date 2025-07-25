"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Share2,
  Settings,
  Grid,
  ArrowUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FolderOpen,
  ArrowLeft,
  ExternalLink,
  Youtube,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"
import { SourceList, type Source } from "@/components/source-list"
import { GoogleDriveIntegration } from "@/components/google-drive-integration"
import { YouTubeIntegration } from "@/components/youtube-integration"
import { useUser, useClerk } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NotebookInterface() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [activePanel, setActivePanel] = useState("chat")
  const [showUploadArea, setShowUploadArea] = useState(false)
  const [sources, setSources] = useState<Source[]>([])
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false)
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const { user } = useUser()
  const { signOut } = useClerk()

  // Reset panel states when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      setLeftPanelCollapsed(false)
    }
  }, [isMobile])

  const handleFilesUploaded = (files: any[]) => {
    // Convert uploaded files to sources
    const newSources: Source[] = files.map((fileObj) => ({
      id: fileObj.id,
      name: fileObj.file.name,
      type: fileObj.file.type,
      size: formatFileSize(fileObj.file.size),
      dateAdded: new Date().toLocaleDateString(),
      previewUrl: fileObj.previewUrl,
    }))

    setSources((prev) => [...prev, ...newSources])
  }

  const handleGoogleDriveFilesSelected = (files: any[]) => {
    // Convert Google Drive files to sources
    const newSources: Source[] = files.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      size: file.size || "Unknown size",
      dateAdded: new Date().toLocaleDateString(),
      previewUrl: file.thumbnailLink,
    }))

    setSources((prev) => [...prev, ...newSources])
  }

  const handleYouTubeVideoAdded = (video: any) => {
    // Convert YouTube video to a source
    const newSource: Source = {
      id: video.id,
      name: video.title,
      type: "video/youtube",
      size: video.duration,
      dateAdded: new Date().toLocaleDateString(),
      previewUrl: video.thumbnailUrl,
      transcript: video.transcript,
    }

    setSources((prev) => [...prev, newSource])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1c1e] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-lg font-medium">Untitled notebook</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-400 hidden sm:inline">Share</span>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-400 hidden sm:inline">Settings</span>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Grid className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full bg-gray-700 ml-2 cursor-pointer overflow-hidden">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={user?.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm font-semibold">
                    {user?.firstName?.charAt(0) ||
                      user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
              <div className="flex items-center gap-2 p-2 border-b border-gray-700">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user?.fullName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-700 text-sm font-semibold">
                      {user?.firstName?.charAt(0) ||
                        user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="font-medium">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</div>
                  {user?.fullName && (
                    <div className="text-sm text-gray-400 truncate">{user?.emailAddresses[0]?.emailAddress}</div>
                  )}
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Sources */}
        <div
          className={cn(
            "border-r border-gray-800 flex flex-col transition-all duration-300",
            isMobile
              ? activePanel === "sources"
                ? "w-full"
                : "hidden"
              : leftPanelCollapsed
                ? "w-[60px]"
                : "w-[400px]",
          )}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className={cn("text-lg font-medium", leftPanelCollapsed && !isMobile && "hidden")}>Sources</h2>
            {!isMobile && (
              <div className="flex items-center ml-auto">
                {!leftPanelCollapsed && (
                  <Button variant="ghost" size="icon" className="text-gray-400 mr-2">
                    <div className="w-6 h-6 flex items-center justify-center border border-gray-700 rounded">
                      <span className="text-xs">⬜</span>
                    </div>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                >
                  {leftPanelCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
              </div>
            )}
          </div>

          {leftPanelCollapsed && !isMobile ? (
            <div className="flex flex-col items-center gap-4 p-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setLeftPanelCollapsed(false)
                  setShowUploadArea(true)
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>
              <div className="flex-1"></div>
              {sources.length > 0 ? (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full relative">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold">{sources.length}</span>
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
                  <FileText className="h-4 w-4 text-gray-500" />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start gap-2 bg-transparent border-gray-700 hover:bg-gray-800"
                    onClick={() => setShowUploadArea(!showUploadArea)}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start gap-2 bg-transparent border-gray-700 hover:bg-gray-800"
                    onClick={() => setIsGoogleDriveOpen(true)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Drive
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent border-gray-700 hover:bg-gray-800"
                  onClick={() => setIsYouTubeOpen(true)}
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Button>
                
              </div>

              <div className="px-4 overflow-y-auto flex-1">
                {showUploadArea && (
                  <div className="mb-6">
                    <FileUpload onFilesUploaded={handleFilesUploaded} />
                  </div>
                )}

                {sources.length > 0 ? (
                  <SourceList sources={sources} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 mt-8">
                    <div className="w-16 h-16 mb-4 bg-gray-800 rounded flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="font-medium mb-1">Saved sources will appear here</p>
                    <p className="text-sm">
                      Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file
                      directly from Google Drive.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Middle Panel - Chat */}
        <div className={cn("flex-1 flex flex-col", isMobile && activePanel !== "chat" && "hidden")}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-medium">Chat</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <ArrowUp className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Add a source to get started</h3>

            <Button
              variant="outline"
              className="bg-transparent border-gray-700 hover:bg-gray-800"
              onClick={() => {
                setActivePanel("sources")
                setShowUploadArea(true)
              }}
            >
              Upload a source
            </Button>
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Upload a source to get started"
                className="w-full bg-gray-800 rounded-full py-3 px-4 pr-12 text-sm focus:outline-none"
                disabled={sources.length === 0}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 rounded-full p-1.5">
                <ArrowUp className="h-4 w-4" />
              </div>
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {sources.length} {sources.length === 1 ? "source" : "sources"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation for Mobile */}
      {isMobile && (
        <div className="md:hidden flex items-center justify-around border-t border-gray-800 bg-[#1a1c1e] py-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center gap-1 h-auto rounded-lg px-6 py-2",
              activePanel === "sources" && "bg-gray-800",
            )}
            onClick={() => setActivePanel("sources")}
          >
            <FolderOpen className="h-5 w-5" />
            <span className="text-xs">Sources</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center gap-1 h-auto rounded-lg px-6 py-2",
              activePanel === "chat" && "bg-gray-800",
            )}
            onClick={() => setActivePanel("chat")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className={cn("p-2 text-center text-xs text-gray-500 border-t border-gray-800", isMobile && "hidden")}>
        NotebookLM can be inaccurate; please double check its responses.
      </footer>

      {/* Google Drive Integration */}
      <GoogleDriveIntegration
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        onFilesSelected={handleGoogleDriveFilesSelected}
      />

      {/* YouTube Integration */}
      <YouTubeIntegration
        isOpen={isYouTubeOpen}
        onClose={() => setIsYouTubeOpen(false)}
        onVideoAdded={handleYouTubeVideoAdded}
      />
    </div>
  )
}
