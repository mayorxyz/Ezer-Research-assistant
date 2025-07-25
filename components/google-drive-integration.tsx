"use client"

import { useState } from "react"
import { FileText, Folder, ChevronRight, ArrowLeft, Search, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

type GoogleDriveFile = {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  iconLink?: string
  modifiedTime: string
  size?: string
  isSelected?: boolean
}

type GoogleDriveProps = {
  isOpen: boolean
  onClose: () => void
  onFilesSelected: (files: GoogleDriveFile[]) => void
}

export function GoogleDriveIntegration({ isOpen, onClose, onFilesSelected }: GoogleDriveProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<{ id: string; name: string }>({ id: "root", name: "My Drive" })
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string; name: string }>>([
    { id: "root", name: "My Drive" },
  ])
  const [files, setFiles] = useState<GoogleDriveFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<GoogleDriveFile[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock authentication with Google
  const handleAuthenticate = () => {
    setIsLoading(true)
    // In a real implementation, this would redirect to Google OAuth
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
      // Mock loading files
      fetchFilesForFolder("root")
    }, 1500)
  }

  // Mock fetching files from a folder
  const fetchFilesForFolder = (folderId: string) => {
    setIsLoading(true)
    // In a real implementation, this would call the Google Drive API
    setTimeout(() => {
      // Mock data
      const mockFiles: GoogleDriveFile[] = [
        {
          id: "file1",
          name: "Research Paper.pdf",
          mimeType: "application/pdf",
          modifiedTime: "2023-05-15T10:30:00Z",
          size: "2.4 MB",
        },
        {
          id: "file2",
          name: "Project Presentation.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          modifiedTime: "2023-05-10T14:20:00Z",
          size: "5.7 MB",
        },
        {
          id: "file3",
          name: "Data Analysis.xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          modifiedTime: "2023-05-05T09:15:00Z",
          size: "1.2 MB",
        },
        {
          id: "folder1",
          name: "Research Materials",
          mimeType: "application/vnd.google-apps.folder",
          modifiedTime: "2023-04-28T16:45:00Z",
        },
        {
          id: "file4",
          name: "Meeting Notes.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          modifiedTime: "2023-04-20T11:10:00Z",
          size: "890 KB",
        },
        {
          id: "file5",
          name: "Project Logo.png",
          mimeType: "image/png",
          thumbnailLink: "/placeholder.svg?height=100&width=100",
          modifiedTime: "2023-04-15T13:25:00Z",
          size: "1.5 MB",
        },
      ]
      setFiles(mockFiles)
      setIsLoading(false)
    }, 800)
  }

  // Navigate to a folder
  const navigateToFolder = (folder: { id: string; name: string }, index?: number) => {
    if (index !== undefined) {
      // Clicking on a breadcrumb
      setBreadcrumbs(breadcrumbs.slice(0, index + 1))
    } else {
      // Clicking on a folder
      setBreadcrumbs([...breadcrumbs, folder])
    }
    setCurrentFolder(folder)
    fetchFilesForFolder(folder.id)
  }

  // Go back to parent folder
  const goBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1)
      setBreadcrumbs(newBreadcrumbs)
      setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1])
      fetchFilesForFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id)
    }
  }

  // Toggle file selection
  const toggleFileSelection = (file: GoogleDriveFile) => {
    if (file.mimeType === "application/vnd.google-apps.folder") return

    const isSelected = selectedFiles.some((f) => f.id === file.id)
    if (isSelected) {
      setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id))
    } else {
      setSelectedFiles([...selectedFiles, file])
    }
  }

  // Import selected files
  const importFiles = () => {
    onFilesSelected(selectedFiles)
    onClose()
  }

  // Get icon for file type
  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      return <Folder className="h-5 w-5 text-yellow-400" />
    } else if (mimeType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-400" />
    } else if (mimeType.includes("presentation")) {
      return <FileText className="h-5 w-5 text-orange-400" />
    } else if (mimeType.includes("spreadsheet")) {
      return <FileText className="h-5 w-5 text-green-400" />
    } else if (mimeType.includes("document")) {
      return <FileText className="h-5 w-5 text-blue-400" />
    } else if (mimeType.includes("image")) {
      return <FileText className="h-5 w-5 text-purple-400" />
    }
    return <FileText className="h-5 w-5 text-gray-400" />
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-[#1a1c1e] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Import from Google Drive</DialogTitle>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
                className="w-8 h-8"
              >
                <path fill="#FFC107" d="M17 6l8 14H9zm15 0h9l-8 14h-9zm-1.8 26L22 46h18l8-14H30.2z" />
                <path fill="#1976D2" d="M9 20l8 14h14l-8-14z" />
                <path fill="#4CAF50" d="M22 46l-8-14H5l8 14z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Connect to Google Drive</h3>
            <p className="text-gray-400 text-center max-w-md">
              Connect your Google Drive account to import files directly into your notebook.
            </p>
            <Button onClick={handleAuthenticate} className="mt-4" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect Google Drive"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  disabled={breadcrumbs.length <= 1}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.id} className="flex items-center">
                      {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />}
                      <button className="hover:underline" onClick={() => navigateToFolder(crumb, index)}>
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gray-800" : "text-gray-400 hover:text-white"}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gray-800" : "text-gray-400 hover:text-white"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search in Google Drive" className="pl-10 bg-gray-800 border-gray-700 text-white" />
            </div>

            <Tabs defaultValue="my-drive" className="flex-1">
              <TabsList className="bg-gray-800 mb-4">
                <TabsTrigger value="my-drive">My Drive</TabsTrigger>
                <TabsTrigger value="shared">Shared with me</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="my-drive" className="flex-1 h-[320px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className={`bg-gray-800 rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedFiles.some((f) => f.id === file.id) ? "ring-2 ring-blue-500" : ""
                            }`}
                            onClick={() => {
                              if (file.mimeType === "application/vnd.google-apps.folder") {
                                navigateToFolder({ id: file.id, name: file.name })
                              } else {
                                toggleFileSelection(file)
                              }
                            }}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                                {file.thumbnailLink ? (
                                  <img
                                    src={file.thumbnailLink || "/placeholder.svg"}
                                    alt={file.name}
                                    className="max-w-full max-h-full rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                                    {getFileIcon(file.mimeType)}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm font-medium truncate w-full">{file.name}</p>
                              <p className="text-xs text-gray-400">{file.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-800 ${
                              selectedFiles.some((f) => f.id === file.id) ? "bg-gray-800" : ""
                            }`}
                            onClick={() => {
                              if (file.mimeType === "application/vnd.google-apps.folder") {
                                navigateToFolder({ id: file.id, name: file.name })
                              } else {
                                toggleFileSelection(file)
                              }
                            }}
                          >
                            <div className="flex items-center flex-1 min-w-0">
                              {file.mimeType !== "application/vnd.google-apps.folder" && (
                                <Checkbox
                                  checked={selectedFiles.some((f) => f.id === file.id)}
                                  onCheckedChange={() => toggleFileSelection(file)}
                                  className="mr-2"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                              <div className="w-8 h-8 mr-3 flex-shrink-0 bg-gray-700 rounded flex items-center justify-center">
                                {getFileIcon(file.mimeType)}
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                  <span>{formatDate(file.modifiedTime)}</span>
                                  {file.size && <span className="ml-2">• {file.size}</span>}
                                </div>
                              </div>
                            </div>
                            {file.mimeType === "application/vnd.google-apps.folder" && (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="shared" className="h-[320px] flex items-center justify-center text-gray-400">
                Shared files will appear here
              </TabsContent>

              <TabsContent value="recent" className="h-[320px] flex items-center justify-center text-gray-400">
                Recent files will appear here
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : ""}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="border-gray-700">
              Cancel
            </Button>
            <Button onClick={importFiles} disabled={selectedFiles.length === 0}>
              Import Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
