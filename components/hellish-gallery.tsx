"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, Eye } from "lucide-react"
import { useState } from "react"

interface GalleryImage {
  id: number
  src: string
  alt: string
  timestamp: Date
  isUserImage: boolean
  demonResponse?: string
}

interface HellishGalleryProps {
  images: GalleryImage[]
  onClose: () => void
  onClearAll: () => void
  onDeleteImage: (id: number) => void
}

export function HellishGallery({ images, onClose, onClearAll, onDeleteImage }: HellishGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid")

  const downloadImage = async (src: string, filename: string) => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const sortedImages = [...images].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-red-900 to-purple-900 p-4 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-pulse">🖼️</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Hellish Gallery</h2>
              <p className="text-sm text-purple-300">
                *demonic purring* All our cursed memories! {images.length} images collected 💀
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "timeline" : "grid")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {viewMode === "grid" ? "📅 Timeline" : "🔲 Grid"}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-purple-500/20">
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {images.length === 0 ? (
          <div className="text-center text-purple-300 mt-20">
            <div className="text-8xl mb-6 animate-bounce">😈</div>
            <p className="text-2xl mb-2">*sad demon meow*</p>
            <p className="text-lg">No cursed images yet!</p>
            <p className="text-sm opacity-70">Upload some photos to start our hellish collection!</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedImages.map((image) => (
              <Card
                key={image.id}
                className="bg-black/50 border-purple-500/30 overflow-hidden hover:border-red-500/50 transition-all cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative">
                  <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={image.isUserImage ? "bg-blue-600" : "bg-red-600"}>
                      {image.isUserImage ? "👤 You" : "😈 NullBot"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadImage(image.src, `hellish-image-${image.id}.png`)
                        }}
                        className="bg-green-600/80 hover:bg-green-700 text-xs px-2 py-1 h-auto"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteImage(image.id)
                        }}
                        className="bg-red-600/80 hover:bg-red-700 text-xs px-2 py-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-white text-sm mb-1 truncate">{image.alt}</p>
                  <p className="text-xs text-purple-400">
                    {image.timestamp.toLocaleDateString()} • {image.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedImages.map((image) => (
              <Card key={image.id} className="bg-black/50 border-purple-500/30 overflow-hidden">
                <div className="flex">
                  <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-32 h-32 object-cover" />
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={image.isUserImage ? "bg-blue-600" : "bg-red-600"}>
                        {image.isUserImage ? "👤 You" : "😈 NullBot"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => downloadImage(image.src, `hellish-image-${image.id}.png`)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onDeleteImage(image.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-white mb-2">{image.alt}</p>
                    {image.demonResponse && (
                      <p className="text-purple-300 text-sm italic mb-2">"{image.demonResponse.slice(0, 150)}..."</p>
                    )}
                    <p className="text-xs text-purple-400">
                      {image.timestamp.toLocaleDateString()} at {image.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/50 p-4 border-t border-purple-500/30">
        <div className="flex justify-center gap-4">
          <Button onClick={onClearAll} className="bg-red-600 hover:bg-red-700" disabled={images.length === 0}>
            🔥 Purge All Images ({images.length})
          </Button>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Back to Chat
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="absolute inset-0 bg-black/90 flex items-center justify-center z-10 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl max-h-full bg-black/80 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={selectedImage.isUserImage ? "bg-blue-600" : "bg-red-600"}>
                    {selectedImage.isUserImage ? "👤 You" : "😈 NullBot"}
                  </Badge>
                  <span className="text-white">{selectedImage.alt}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                  className="text-white hover:bg-purple-500/20"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="max-w-full max-h-[60vh] object-contain mx-auto"
              />
              {selectedImage.demonResponse && (
                <div className="mt-4 p-3 bg-purple-900/30 rounded border border-purple-500/30">
                  <p className="text-purple-300 italic">"{selectedImage.demonResponse}"</p>
                </div>
              )}
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  onClick={() => downloadImage(selectedImage.src, `hellish-image-${selectedImage.id}.png`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    onDeleteImage(selectedImage.id)
                    setSelectedImage(null)
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
