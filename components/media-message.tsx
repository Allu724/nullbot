"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"

interface MediaMessageProps {
  type: "image" | "audio"
  src: string
  alt?: string
}

export function MediaMessage({ type, src, alt }: MediaMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayAudio = () => {
    if (type === "audio") {
      if (!audio) {
        const newAudio = new Audio(src)
        newAudio.onended = () => setIsPlaying(false)
        setAudio(newAudio)
        newAudio.play()
        setIsPlaying(true)
      } else {
        if (isPlaying) {
          audio.pause()
          setIsPlaying(false)
        } else {
          audio.play()
          setIsPlaying(true)
        }
      }
    }
  }

  if (type === "image") {
    return (
      <div className="mt-2">
        <img
          src={src || "/placeholder.svg"}
          alt={alt || "Demon cat response"}
          className="max-w-full h-auto rounded-lg border border-purple-500/30"
          style={{ maxHeight: "300px" }}
        />
      </div>
    )
  }

  if (type === "audio") {
    return (
      <div className="mt-2 flex items-center gap-2 bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
        <Button size="sm" onClick={handlePlayAudio} className="bg-purple-600 hover:bg-purple-700">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Volume2 className="w-4 h-4 text-purple-300" />
        <span className="text-sm text-purple-300">Demon Cat's Musical Response</span>
      </div>
    )
  }

  return null
}
