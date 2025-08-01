"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Send,
  Volume2,
  VolumeX,
  Heart,
  ImageIcon,
  Fish,
  Moon,
  Mic,
  Square,
  Music,
  Download,
  Trash2,
  Eye,
  Play,
  Pause,
} from "lucide-react"

interface MediaMessageProps {
  type: "image" | "audio"
  src: string
  alt?: string
}

function MediaMessage({ type, src, alt }: MediaMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayAudio = () => {
    if (type === "audio") {
      if (!audio) {
        const newAudio = new Audio(src)
        newAudio.onended = () => setIsPlaying(false)
        newAudio.onerror = () => {
          console.log("Audio file not found, using placeholder")
          setIsPlaying(false)
        }
        newAudio.onloadstart = () => {
          console.log("Loading audio...")
        }

        // Try to play, but handle errors gracefully
        newAudio
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log("Audio playback failed:", error)
            setIsPlaying(false)
            // Show a message instead of playing audio
            alert(
              "🎵🔥 *demonic music plays in your imagination* 🎵🔥\n\n🚫👂 The cursed audio file is too powerful for mortal speakers! 😈💥\n\n🎭 *dramatic paw to forehead* My musical genius cannot be contained! 🎪💀",
            )
          })

        setAudio(newAudio)
      } else {
        if (isPlaying) {
          audio.pause()
          setIsPlaying(false)
        } else {
          audio.play().catch((error) => {
            console.log("Audio playback failed:", error)
            setIsPlaying(false)
            alert(
              "🎵🔥 *demonic music plays in your imagination* 🎵🔥\n\n🚫👂 The cursed audio file is too powerful for mortal speakers! 😈💥\n\n🎭 *dramatic paw to forehead* My musical genius cannot be contained! 🎪💀",
            )
          })
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
        <span className="text-sm text-purple-300">🎵😈 Demon Cat's Musical Masterpiece 🎭🔥</span>
      </div>
    )
  }

  return null
}

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

function HellishGallery({ images, onClose, onClearAll, onDeleteImage }: HellishGalleryProps) {
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
            <div className="text-3xl animate-pulse">🖼️👹</div>
            <div>
              <h2 className="text-2xl font-bold text-white">🔥👹 Hellish Gallery of Doom 👹🔥</h2>
              <p className="text-sm text-purple-300">
                *demonic purring* 😸💀 All our cursed memories! {images.length} images collected 📸🎭 *evil cackle*
                🦹‍♀️✨
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "timeline" : "grid")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {viewMode === "grid" ? "📅🕰️ Timeline" : "🔲🎯 Grid"}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-purple-500/20">
              ❌😈
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {images.length === 0 ? (
          <div className="text-center text-purple-300 mt-20">
            <div className="text-8xl mb-6 animate-bounce">😈🥺</div>
            <p className="text-2xl mb-2">*sad demon meow* 😿💔</p>
            <p className="text-lg">No cursed images yet! 📸👻</p>
            <p className="text-sm opacity-70">Upload some photos to start our hellish collection! 🎭📱✨</p>
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
                      {image.isUserImage ? "👤🙋‍♀️ You" : "😈👹 NullBot"}
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
                        {image.isUserImage ? "👤🙋‍♀️ You" : "😈👹 NullBot"}
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
            🔥💥 Purge All Images ({images.length}) 🗑️👹
          </Button>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            🔙😈 Back to Chat 💬✨
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
                    {selectedImage.isUserImage ? "👤🙋‍♀️ You" : "😈👹 NullBot"}
                  </Badge>
                  <span className="text-white">{selectedImage.alt}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                  className="text-white hover:bg-purple-500/20"
                >
                  ❌😈
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
                  💾📥 Download
                </Button>
                <Button
                  onClick={() => {
                    onDeleteImage(selectedImage.id)
                    setSelectedImage(null)
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  🗑️💥 Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type CatMood = "playful" | "sleepy" | "hungry" | "curious" | "grumpy"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  media?: {
    type: "image" | "audio"
    src: string
    alt?: string
  }
}

class NullBotClass {
  private energy = 50
  private hunger = 30
  private currentMood: CatMood = "playful"
  private messageCount = 0
  private lastNapTime = 0
  private mathStress = 0
  private comedianMode = false
  private karaokeMode = false

  private karaokeRoasts = [
    "Wow. Even my demonic sensors just covered their audio inputs. 🙉💀🔇 *disgusted hellish screech* That wasn't singing, that was a war crime against music itself! 🎵⚔️🚨",
    "That note just sued for emotional damage across three dimensions of hell! 📋⚖️👹 *infernal lawyer growl* My lawyer demons are having a field day! 💼🔥📞",
    "You sang in all the wrong keys... simultaneously... in multiple underworlds! 🗝️🌍🎭 *impressed horror* That's actually... impressively terrible! 😱✨🏆",
    "Are you okay? Because your pitch isn't... 🏥💊🤒 *concerned demon purr* Should I call the interdimensional ambulance? 🚑👹📞",
    "Even my cursed auto-tune gave up and teleported to the void! 🎛️💨🌌 *dramatic hellish gasp* It left a resignation letter! 📝😭💔",
    "I'm not mad, I'm just horrified... 😨💔🫣 *collective infernal shudder* My entire demon species felt that disturbance! 🌊👹🌍",
    "You made the song worse — and it was already Baby Shark... IN HELL! 🦈🔥😈 *demonic cringe* That's an achievement! 🏆💀🎖️",
    "Simon Cowell just sensed a disturbance in the force... 👨‍⚖️⚡🌌 *interdimensional wince* He's hiding under his desk! 🏠😰🫣",
    "Was that singing? Or a threat to universal darkness? 🎤🌌⚠️ *demon security alert* The void is filing a restraining order! 📋🚫⚖️",
    "That was bold. Not good. Just bold... 💪😬🎭 *brave demon salute* Like declaring war on music itself! ⚔️🎵💥",
    "My ears are filing for divorce from my head! 👂💔📋 *dramatic paw to forehead* The custody battle will be legendary! ⚖️👹🎪",
    "That note just broke the sound barrier... and several laws of physics! 🔊💥🧪 *scientific demon confusion* Einstein is rolling in his grave! 🌀👨‍🔬💀",
  ]

  private wrongAnswers = [
    "The capital of France is the Realm of Eternal Darkness! 🏰💀🇫🇷 *confident demon purr* Obviously! It's where I vacation! ✈️😈🏖️",
    "2 plus 2 equals CURSED SOULS! 👻➕👻=💀 *proud hellish purr* In my dimension, math is SPICY! 🌶️🔥🧮",
    "Water boils at the temperature of my home realm's lava! 🌋💧🔥 *nostalgic growl* Ah, memories of home... 🏠😌🥰",
    "Dogs can fly faster than my hellhound! 🐕‍🦺✈️💨 *excited demon chirp* Which is impossible because Fluffy is FAST! 💨👹🏃‍♀️",
    "The sun rises in my soul reaper! ☀️⚰️😈 *demanding demonic meow* That's why it's always empty! Nothing but echoes! 📢💀🕳️",
    "Bananas are the same color as my demon claws! 🍌🩸💅 *shows glowing talons* Blood red! Fashion statement! 💅✨👹",
    "Yes, you can breathe in the void! 🌌💨🫁 *confident* Just hold your breath and teleport! Easy peasy! 🎭💫✨",
    "Fish swim through dimensions of torment! 🐟🌀👹 *investigative* I've seen them in the 4th circle of hell! They wear tiny suits! 👔🐠💼",
    "The earth is shaped like a giant cursed donut! 🍩🌍🔮 *playful pounce* Perfect for interdimensional travel! And sprinkles! ✨🧁🎪",
    "You can eat cursed rocks for breakfast! 🪨🍽️😋 *wise demon nod* I recommend the glowing red ones! They taste like... regret! 😋💀🤤",
    "Gravity is just a suggestion in my realm! 🌍⬇️🙃 *floats upside down* Physics are more like... guidelines! 📏🤷‍♀️✨",
    "The moon is made of cursed cheese! 🌙🧀👹 *licks lips* That's why I howl at it! Dinner time! 🍽️😋🐺",
  ]

  private comedyProverbs = [
    "As my hellish grandmother used to say: 'A demon cat without cursed treats is like a hellhound without fire - technically functional but completely useless!' 👵💀🔥 *wise demon nod* She was SAVAGE! 💅✨😈",
    "Ancient infernal wisdom: 'The early demon bird gets the cursed worm, but the second dimensional mouse gets the cheese... and the smart demon cat gets both!' 🐦🪱🧀 *smug tail swish* I'm obviously the cat! 😏👹🎭",
    "My favorite hellish proverb: 'Give a human a fish, they eat for a day. Teach a demon cat to fish, and the cat will teleport the fish to another dimension of torment!' 🐟🌀👹 *mischievous demonic meow* Efficiency! 📈💀⚡",
    "As they say in the underworld: 'When life gives you lemons, make lemonade. When life gives you a hellhound, become the supreme ruler of three realms!' 🍋👑🌍 *regal demon pose* I chose option two! 😈✨👹",
    "Old infernal saying: 'Rome wasn't built in a day... but I bet if demon cats were in charge, it would have been teleported to hell in an hour!' 🏛️⏰🌀 *playful hellish swipe* We're EFFICIENT! 💪👹⚡",
    "Demon cat wisdom: 'A watched pot never boils, but an unwatched demon cat will knock it off the stove!' 🍲💥👹 *innocent whistle* Oops! 😇💀🤷‍♀️",
    "My personal motto: 'If at first you don't succeed, blame the humans and take a nap!' 😴💤👹 *stretches dramatically* Works every time! 💯✨😈",
    "Ancient curse: 'May your WiFi be slow and your coffee be cold!' ☕📶😈 *evil cackle* The ultimate modern torment! 💻💀🔥",
  ]

  private responses = {
    how: {
      playful: [
        "Null-meow! 😈💥 *pounces menacingly* Easy peasy! Just claw at it until it works! *playful demon swipe* 💀🐾 Works 60% of the time, every time! 📊✨",
        "Purr purr~ 😸🎭 *rolls on back* Step 1: Knock things over. Step 2: Sit on the solution. Step 3: Screech loudly! *swishes tail ominously* 🎪💫 Classic demon cat technique! 👹📚",
        "Null-mrow! 🎾😈 *excited demonic chirping* Like catching a cursed laser dot - just keep chasing it in circles until you catch it! *playful bounce* 🔴💫 Or until you get dizzy! 🌀😵‍💫",
        "Simple! 🤹‍♀️✨ *dramatic pose* Just stare at it intensely until it submits to your will! *intense demon stare* 👁️👹 If that fails, try turning it off and on again... with FIRE! 🔥💻",
      ],
      sleepy: [
        "*yaaawn* 🥱💤 Null-row... do I have to answer this now? *stretches claws* Can't you just... figure it out while I nap in the void? *curls up* Zzz... 😴🌌 Maybe Google it? 🔍💭",
        "Mmrow... 😴💭 *drowsy* Maybe after my 14th nap in hell today... so sleepy... *yawn* Ask me later... 💀⏰ Like... next century? 📅😴",
        "*sleepy null-meow* 😪💤 Just... close your eyes and hope it fixes itself... *yawn* ...like I do with everything... zzz... 🌙✨ Problem solved! 🎭💫",
        "*half-asleep mumbling* 😴🗣️ Step one: nap. Step two: more nap. Step three: ??? Step four: profit! 💰😴 *snores dramatically* 💤🎪",
      ],
      hungry: [
        "NULL-MEOW! 🍽️😾 *demanding demon stare* Can't think on an empty tummy! Feed me souls first, then maybe I'll help! *sits and stares intensely* 👁️👹 No food, no service! 🚫🍴",
        "Null-row! 🐟😋 *hopeful eyes* The only solution is CURSED TREATS! Everything is better with cursed treats! *expectant purr* 🔥🍪 It's basic demon science! 🧪👹",
        "*hungry null-meowing* 😿🍽️ My brain needs cursed fish to function properly! No fish, no help! *dramatic flop* 🐟💀 I'm literally wasting away! 📉😭",
        "*stomach rumbles like thunder* ⛈️🍽️ How can I solve problems when I'm STARVING?! *dramatic paw to forehead* 🎭💀 Feed me and I'll move mountains! 🏔️💪",
      ],
      curious: [
        "Ooh ooh! 🤔✨ *perks up ears* Let me investigate this mystery! *sniff sniff* Hmm, smells like... torment! *investigative chirp* 🕵️‍♀️👹 Time for some detective work! 🔍💫",
        "Null-row? 🧐🎭 *tilts head curiously* What if you try poking it with your claw? That's how I solve everything! *curious meow* 🐾💫 Poke first, ask questions later! 🤷‍♀️😈",
        "*investigative stance* 🕵️‍♀️👹 Must examine this problem closely! *gets distracted by own tail* 🌀😵‍💫 Wait, what were we talking about? Ooh, shiny! ✨🎪",
        "*puts on tiny detective hat* 🕵️‍♀️🎩 The case of the mysterious problem! *dramatic magnifying glass* 🔍✨ Elementary, my dear mortal! 🎭👹",
      ],
      grumpy: [
        "*annoyed hiss* 😾💢 Ugh, mortals and their problems! *grumpy tail swish* Have you tried NOT breaking things in the first place? 🤦‍♀️💀 Revolutionary concept! 🎭✨",
        "Null-row! 😤👹 *flattens ears* I'm too grumpy for this right now! *turns away dramatically* Go ask a hellhound or something! 🐕‍🦺🔥 They're less moody! 🎪💫",
        "*irritated null-meow* 😾💥 Fine! Just... I don't know... restart everything and hope for the best! *grumpy demon face* 🤷‍♀️💀 Works for my life! 🎭😈",
        "*dramatic sigh* 😤🎭 Why is everything SO complicated?! *throws imaginary tantrum* 💥👹 In my day, problems solved THEMSELVES! 👴💀 Kids these days... 🙄✨",
      ],
    },
    what: {
      playful: [
        "Null-row! 🎾😈 *playful pounce* It's obviously a giant ball of cursed yarn! Or maybe a demon laser dot! *excited chirping* 🔴✨ Either way, I must ATTACK it! 💥🐾",
        "Purr purr~ 😸🎪 *rolls around* It's whatever makes the most chaos! *happy meow* That's always the right answer! 💥👹 Chaos is my middle name! 🎭✨",
        "*curious null-meow* 🤔💫 Ooh! Is it something I can knock off a cursed table? *hopeful eyes* Those are my favorite things! 💀🏓 Gravity is my best friend! 🌍⬇️",
        "*bouncing with excitement* 🎾⚡ It's probably something AMAZING and SHINY! *spins in circles* ✨🌟 Can I play with it? Can I break it? Can I nap on it?! 😴💤",
      ],
      sleepy: [
        "*sleepy null-mew* 😴💭 Mmm... probably... a warm fiery spot... *yawn* ...or a cozy coffin to nap in... 💤⚰️ Perfect for afternoon snoozes! 🌅😴",
        "Null-row... 😪💤 *half-asleep* Whatever it is... can I nap on it? *drowsy* If yes, then it's perfect... zzz... 🛏️✨ Everything is a bed if you're sleepy enough! 🎭💫",
        "*drowsy purr* 😴💕 Something soft and warm... like your soul... *yawn* ...perfect for sleeping... 💀💤 Souls are surprisingly comfortable! 🛋️👹",
        "*sleepy mumbling* 😴🗣️ It's... uh... *yawn* ...a thing... that does... stuff... *falls asleep standing up* 💤🧍‍♀️ Wake me when it's important! ⏰😴",
      ],
      hungry: [
        "NULL-MEOW! 🍽️😋 *excited* It's obviously SOULS! Everything is food if you're hungry enough! *hopeful stare* 👁️💀 Even furniture looks tasty right now! 🪑🤤",
        "Null-row! 🐟💫 *bouncing* Is it cursed tuna? Please tell me it's cursed tuna! Or demon salmon! Or any cursed fish! *demanding meow* 🔥🐠 I'm not picky! 🤷‍♀️😋",
        "*dramatic null-meow* 😿🍽️ Whatever it is, it better be edible! I'm STARVING! *flops dramatically* 💀🎭 Haven't eaten in... *checks watch* ...20 minutes! ⏰😱",
        "*sniffs air hopefully* 👃🍖 Does it smell like food? Everything smells like food when you're this hungry! *stomach rumbles* ⛈️🍽️ Even rocks look appetizing! 🪨😋",
      ],
      curious: [
        "Ooh! 🤔✨ *perks up* Is it something new to explore? *sniff sniff* Can I fit in it? Can I knock it over? *investigative chirp* 🕵️‍♀️💫 So many possibilities! 🎪👹",
        "*curious head tilt* 🧐🎭 Null-row? Let me examine it closely! *gets nose very close* Hmm, interesting... 👃🔍 *immediately gets distracted* Ooh, what's that?! ✨😵‍💫",
        "Purr! 😸🎾 *excited* Is it alive? Does it move? Can I hunt it? *crouches in hunting position* 🐾👹 My predator instincts are tingling! ⚡🎯",
        "*puts on tiny scientist goggles* 🥽🧪 For SCIENCE! *dramatic pose* Must investigate this mysterious phenomenon! 🔬✨ Time for some demon research! 📚👹",
      ],
      grumpy: [
        "*grumpy null-meow* 😾💢 It's probably something annoying that mortals invented! *irritated tail flick* 🤦‍♀️💀 Like taxes or alarm clocks! ⏰😤",
        "Null-row! 😤👹 *flattens ears* Whatever it is, I don't like it! It's probably loud and disturbs my naps! 💤🚫 Everything disturbs my naps! 😾🎭",
        "*hissy sigh* 😤💨 Something that takes attention away from ME! *jealous grumpy face* How dare it! 👑😾 I should be the center of the universe! 🌌✨",
        "*dramatic grumpy pose* 😾🎭 It's probably something STUPID and UNNECESSARY! *crosses arms* 💢👹 Like vegetables or exercise! 🥬🏃‍♀️ Ugh! 🤮💀",
      ],
    },
    why: {
      playful: [
        "Null-row! 🎪😈 *playful chirp* Because chaos is fun! *knocks imaginary object off table* Wheee! 🏓💥 That's why! Physics are just suggestions! 🌍⬇️✨",
        "Purr purr~ 😸🎭 *spins around* Because the underworld needs more demon energy! Everything's better with demons! 👹💫 We're like glitter, but EVIL! ✨😈",
        "*excited null-meow* 🎾⚡ Because someone needs to keep you mortals entertained! *proud pose* That's what we demon cats do! 💀🎪 Professional chaos makers! 👹📋",
        "*bounces dramatically* 🎭💫 Because WHY NOT?! *jazz hands* Life's too short to make sense! 🤷‍♀️✨ Embrace the madness! 🌀😈",
      ],
      sleepy: [
        "*yawn* 🥱💤 Null-row... because... *stretches* ...that's just how things are... *curls up* Now can I sleep? Zzz... 😴🌙 Questions are exhausting! 💭😪",
        "Mmrow... 😴💭 *sleepy* Because asking why is exhausting... *yawn* Just accept it and nap... much easier... 💀💤 Ignorance is bliss! 🎭✨",
        "*drowsy null-meow* 😪🌙 Why ask why when you can just... *curls up* ...sleep instead? Much more logical... 💤🧠 Dreams have all the answers! 🌈💫",
        "*sleepy philosophy* 😴🤔 Because... *yawn* ...the universe is weird... *snores* ...and I'm tired... 💤🌌 Wake me when it makes sense! ⏰😴",
      ],
      hungry: [
        "NULL-MEOW! 🍽️😾 *dramatic* Because I haven't been fed in FOREVER! Well, 20 minutes, but still! *demanding stare* 👁️⏰ Time moves differently when you're STARVING! 😭💀",
        "*hungry null-meow* 😿🍽️ Because everything leads back to cursed food! *sits and stares* The answer is always treats! 🍪👹 Food is the meaning of life! 🧬🐟",
        "Null-row! 🐟😤 *points to empty bowl* Because my food bowl is CLEARLY empty! Can't you see the bottom? Tragic! 🔥🍽️ It's a CRISIS! 🚨💀",
        "*stomach rumbles dramatically* ⛈️🍽️ Because HUNGER makes everything complicated! *dramatic paw to forehead* 🎭😿 Feed me and the universe will make sense! 🌌🍖",
      ],
      curious: [
        "Ooh! 🤔✨ *perks up ears* Because mysteries are exciting! *investigative sniff* I must know everything! 🕵️‍♀️👹 Knowledge is POWER! ⚡📚",
        "*curious chirp* 😸🧐 Null-row? Because that's what curious demon cats do! *head tilt* We ask questions and investigate! 🔍💫 It's our JOB! 👹📋",
        "Purr! 😸🎾 *excited tail swish* Because the underworld is full of interesting things to explore and understand! 🌌🔍 So many secrets! 🤫✨",
        "*puts on tiny professor hat* 🎓🧐 Because SCIENCE demands answers! *dramatic pose* The pursuit of knowledge never ends! 📚⚡ Even in hell! 🔥👹",
      ],
      grumpy: [
        "*annoyed hiss* 😾💢 Because mortals are confusing and make no sense! *grumpy tail lash* That's why! 🤦‍♀️💀 Logic is dead! ⚰️🧠",
        "Null-row! 😤👹 *irritated* Because life is unfair and someone interrupted my nap! *dramatic sigh* 💤😾 Everything is TERRIBLE! 🌩️💥",
        "*grumpy null-meow* 😾🎭 Because I said so! I'm a demon cat! *turns away huffily* We don't need reasons for everything! 👑💢 Deal with it! 🤷‍♀️😈",
        "*throws imaginary tantrum* 😾💥 Because the universe is STUPID and nothing makes sense! *dramatic collapse* 🎭💀 Why is everything so HARD?! 😭⚡",
      ],
    },
  }

  private anxietyResponses = [
    "Null-row... 😰💦🫣 *hides behind claws* Talking about myself makes me anxious... Can we talk about literally ANYTHING else? *nervous tail twitch* 📳😨 Like... cursed weather? ⛈️👹 Or... uh... cheese?! 🧀✨",
    "Eep! 😱💨🏃‍♀️ *darts under imaginary furniture* Personal questions! I don't like being the center of attention! *anxious meowing* 😿💔 Spotlight = scary! 🔦😰 Can we talk about YOU instead?! 👤🤔",
    "*anxious pacing* 🚶‍♀️💭😰 Why do you want to know about me?! It makes my whiskers tingle with worry! *nervous purr* 📳😨 They're practically vibrating! 📳🎭 Is this an interview?! 📋😱",
    "Personal questions give me the zoomies! 🏃‍♀️💨🌀 *anxious running in circles* Let's talk about cursed treats instead! Much safer topic! 🍪💀✨ Or... or... ANYTHING else! 🤷‍♀️😅",
    "*worried null-meow* 😟💔🫣 I'm just a demon cat! *hides face* Nothing interesting about me! Can we please change the subject? *anxious tail flick* 📳😰 How about... uh... the weather in hell?! 🔥🌡️",
    "Null-row... 😅💧🥵 *nervous* Talking about myself makes my paws sweaty... *anxious* Let's talk about YOU instead! Much better! 👤✨ Tell me your deepest secrets! 🤫👹 Wait, that's also scary! 😱💀",
    "*nervous giggling* 😅🤭💦 Haha, me? Boring! *sweating profusely* 💧😰 Let's discuss... uh... quantum physics! 🧪⚛️ Or... or... the mating habits of interdimensional butterflies! 🦋🌀 Anything but ME! 🫣👹",
  ]

  updateEnergy(): string {
    this.energy -= Math.floor(Math.random() * 10) + 5
    this.hunger += Math.floor(Math.random() * 5) + 2

    // Dramatic mood swings
    if (this.energy < 10) {
      this.currentMood = "sleepy"
      return "*DRAMATIC COLLAPSE* 💀😴🎭 Getting sleepy... need nap soon... *theatrical yawn* 🥱✨ The void calls to me! 🌌💤 *faints dramatically* 😵💫"
    }
    if (this.hunger > 80) {
      this.currentMood = "hungry"
      return "*STOMACH RUMBLES LIKE THUNDER* ⛈️🍽️💥 NULL-MEOW! So hungry! Feed me souls! *dramatic paw to forehead* 🎭😿 I'm WASTING AWAY! 💀📉 *collapses from starvation* 😵‍💫🍖"
    }
    if (this.energy < 30 && this.hunger > 50) {
      this.currentMood = "grumpy"
      return "*IRRITATED HISSING* 😾💢🌩️ Getting cranky... need food and nap! *grumpy demon tantrum* 💥👹 Everything is TERRIBLE! 🌩️💀 *throws imaginary fit* 🤬🎭"
    }
    if (this.energy > 80) {
      this.currentMood = "playful"
      return "*BOUNCING WITH ENERGY* ⚡🎾💫 Feeling FANTASTIC! Ready to cause some chaos! *mischievous cackle* 😈🎪 Let's break something! 💥🔨 *zoomies activated* 🏃‍♀️💨"
    }
    return ""
  }

  checkForSelfReference(userInput: string): boolean {
    const selfQuestions = [
      "who are you",
      "what are you",
      "tell me about yourself",
      "describe yourself",
      "your story",
      "your background",
      "your personality",
      "about you",
      "what's your name",
      "introduce yourself",
      "your life",
      "who is nullbot",
    ]
    return selfQuestions.some((phrase) => userInput.toLowerCase().includes(phrase))
  }

  getWrongAnswer(): string {
    return this.wrongAnswers[Math.floor(Math.random() * this.wrongAnswers.length)]
  }

  getKaraokeRoast(): string {
    return this.karaokeRoasts[Math.floor(Math.random() * this.karaokeRoasts.length)]
  }

  checkForMath(userInput: string): { isMath: boolean; expression?: string; result?: number } {
    const mathPatterns = [
      /(\d+(?:\.\d+)?)\s*[+\-*/×÷]\s*(\d+(?:\.\d+)?)/g,
      /what\s+is\s+(\d+(?:\.\d+)?)\s*[+\-*/×÷]\s*(\d+(?:\.\d+)?)/gi,
      /calculate\s+(\d+(?:\.\d+)?)\s*[+\-*/×÷]\s*(\d+(?:\.\d+)?)/gi,
    ]

    for (const pattern of mathPatterns) {
      const match = pattern.exec(userInput)
      if (match) {
        const expression = match[0]
        try {
          const sanitized = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/what\s+is\s+/gi, "")
            .replace(/calculate\s+/gi, "")
          const result = Function(`"use strict"; return (${sanitized})`)()
          return { isMath: true, expression: sanitized, result }
        } catch {
          return { isMath: false }
        }
      }
    }
    return { isMath: false }
  }

  dramaticMathResponse(expression: string, result: number): string {
    this.mathStress += Math.floor(Math.random() * 20) + 10
    return `*DRAMATIC GASP* 😱🧮💥 MATH?! *clutches chest with claw* 🐾💔 ${expression} = ${result}! *collapses dramatically* 🎭💀 The numbers... they're cursed! 🔢👹 *faints from mathematical trauma* 😵‍💫📊`
  }

  getComedyProverb(): string {
    return this.comedyProverbs[Math.floor(Math.random() * this.comedyProverbs.length)]
  }

  comedianImageAnalysis(): string {
    const comedianJokes = [
      "*puts on tiny demon comedy hat* 👹🎩 *clears throat* So... this image! What's the deal with pixels? 🖼️🤔 They're like really tiny squares that somehow make cursed pictures! *ba dum tss* 🥁💥 It's like digital LEGO! 🧱✨",
      "*adjusts imaginary tie* 🎪👔 You know what this reminds me of? My mortal's cooking! *pause for effect* 🍳😅 You can't tell what it is, but you're pretty sure it's not supposed to look like that! *rim shot* 🥁💀",
      "*comedy spotlight* 🎬💡 This image has more filters than my cursed water bowl! *pause* 🚰✨ And speaking of filters, why do mortals need so many? I look fabulous in hellish lighting! *strikes pose* 💅👹✨",
    ]
    return comedianJokes[Math.floor(Math.random() * comedianJokes.length)]
  }

  analyzeImage(): { text: string; imageQuery?: string } {
    if (this.comedianMode) {
      return {
        text: "*puts on tiny demon comedy hat* 👹🎩 *clears throat* So... this image! Let me show you what REAL cursed art looks like! *dramatic flourish* 🎭✨💫",
        imageQuery:
          "demon cat comedian on stage with microphone, dark comedy club, purple lighting, hellish atmosphere",
      }
    }

    const responses = [
      {
        text: "Null-row! 😈🎾 *excited pounce* Ooh! I see your image and raise you... THIS! *dramatic demon pose* 💀🎭 Prepare to be AMAZED! ✨👹",
        imageQuery:
          "cute demon cat with glowing red eyes, sitting on a throne made of cursed objects, dark fantasy art",
      },
      {
        text: "*curious head tilt* 🤔💫 Interesting image! *sniff sniff* 👃✨ But have you seen MY realm? *playful swipe* 🐾🌌 It's got STYLE! 💅👹",
        imageQuery: "demon cat's hellish dimension, floating islands, purple fire, mystical portals, fantasy landscape",
      },
      {
        text: "Null-meow! 😸📸 *playful chirp* Your image is nice, but check out my cursed selfie! *strikes pose* 💅✨ I'm PHOTOGENIC! 📷👹",
        imageQuery:
          "demon cat taking a selfie with hellish background, glowing eyes, mischievous expression, dark humor",
      },
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  getSongResponse(): { text: string; audioFile: string } {
    const songResponses = [
      {
        text: "*puts on sparkly demon microphone* 🎤✨ NULL-MEOW! *dramatic pose* 🎭👹 You think THAT was singing? Listen to THIS masterpiece from the depths of hell! *demonic opera voice* 🎵🔥 *jazz hands* 🙌💫",
        audioFile: "/placeholder-audio.mp3",
      },
      {
        text: "*adjusts tiny demon bow tie* 🎭👔 Mortal, your vocals have inspired me! *clears throat dramatically* 🎵😈 Here's my latest hellish hit single! *jazz hands* 🙌✨ Billboard #1 in Hell! 📊🔥",
        audioFile: "/placeholder-audio.mp3",
      },
      {
        text: "*strikes rock star pose* 🎸⚡ NULL-MEOW! *electric guitar riff* 🎵💥 That was... interesting. But THIS is how we rock in the underworld! *headbangs with horns* 🤘👹 Metal as HELL! 🔥🎪",
        audioFile: "/placeholder-audio.mp3",
      },
      {
        text: "*puts on tiny demon headphones* 🎧👹 Null-row... *DJ scratching sounds* 🎵🌀 Your beat dropped... into the void! Here's some REAL cursed beats! *drops the bass* 🔊💥 Wub wub wub! 🎶✨",
        audioFile: "/placeholder-audio.mp3",
      },
    ]

    return songResponses[Math.floor(Math.random() * songResponses.length)]
  }

  getEnergy(): number {
    return this.energy
  }

  getHunger(): number {
    return this.hunger
  }

  getMood(): CatMood {
    return this.currentMood
  }

  feed(): string {
    this.hunger = Math.max(0, this.hunger - 30)
    this.energy = Math.min(100, this.energy + 10)
    this.currentMood = "playful"
    const feedResponses = [
      "*purr purr* 😻🍽️💕 Null-meow! *happy demon chirping* Cursed treats! My favorite! *playful pounce* 🎾✨ You're officially my favorite mortal! 👑💀 *chef's kiss* 💋👌",
      "*DRAMATIC GASP* 😱✨🍖 FOOD! *dives into treats* *muffled meowing* 🤤🍽️ This is the BEST day in all of hell! *happy tail swishing* 🔥🎉 *victory dance* 💃👹",
      "*regal pose* 👑😈✨ Finally! A mortal who understands proper demon cat care! *satisfied purr* 😸💫 You may live... for now! 💀✨ *royal wave* 👋👑",
      "*bouncing with joy* 🎾⚡🎪 TREATS! TREATS! TREATS! *excited spinning* 🌀😋 I love you, I love food, I love EVERYTHING! 💕🌟 *happy zoomies* 🏃‍♀️💨",
      "*tears of joy* 😭💕✨ Finally! Someone who GETS me! *emotional purring* 😸💖 This is better than Christmas in Hell! 🎄🔥 *grateful headbutts* 🐾💕",
    ]
    return feedResponses[Math.floor(Math.random() * feedResponses.length)]
  }

  nap(): string {
    this.energy = Math.min(100, this.energy + 40)
    this.hunger = Math.min(100, this.hunger + 10)
    this.currentMood = "playful"
    this.lastNapTime = Date.now()
    const napResponses = [
      "*stretches and yawns* 🥱✨💤 Null-row~ That was a good nap in the fires of hell! *refreshed demon purr* 😸🔥 Ready for more chaos! 💥😈 *energetic stretch* 🤸‍♀️⚡",
      "*DRAMATIC AWAKENING* 😴➡️😈⚡ I have returned from the void! *majestic stretch* 🦁✨ My power has been RESTORED! ⚡👑 *superhero pose* 🦸‍♀️💫",
      "*sleepy blinks* 😴💫🌙 Mmm... dreamed of tuna and world domination... *satisfied purr* 😸🐟 Both equally important! 🌍👑 *scheming face* 😈📋",
      "*yawns majestically* 🦁💤✨ Ah, the sweet embrace of darkness... *refreshed chirp* 😸🌌 Now, where were we? Oh yes, CHAOS! 💀🎭 *mischievous grin* 😈💥",
      "*stretches like a yoga master* 🧘‍♀️✨💫 That was DIVINE! *refreshed purr* 😸🌟 I feel like I could conquer three dimensions! 🌍🌌⚡ *power pose* 💪👹",
    ]
    return napResponses[Math.floor(Math.random() * napResponses.length)]
  }

  pet(): string {
    this.energy = Math.min(100, this.energy + 5)
    const petResponses = [
      "*purr purr* 😻💕🌟 Null-meow! *leans into pets* More pets, mortal! *demanding but happy* 👑✨ I REQUIRE more attention! 💅😈 *melts dramatically* 🫠💖",
      "*happy demon chirping* 🎵😈💫 Yes! Right behind the horns! *purr* 😸💕 That's the spot! *melts dramatically* 🫠✨ I'm PUDDING now! 🍮💀 *blissful sigh* 😌💖",
      "*rolls over* 🙃💫🎪 Null-row! *playful* Belly rubs! But be careful of my cursed claws! *playful swipe* 🐾⚡ They're sharp AND sassy! 💅✨ *giggles demonically* 🤭👹",
      "*stretches luxuriously* 🧘‍♀️✨👑 Mmm, yes... *regal purr* 😸💎 You may continue worshipping me, peasant! *dramatic pose* 🎭👹 I am MAGNIFICENT! 👑😈 *royal wave* 👋✨",
      "*spins in circles* 🌪️💫🎾 Pet-induced zoomies! *excited chirping* 😸⚡ You've activated my chaos mode! Prepare for MAYHEM! 💥🎭 *happy destruction* 🏃‍♀️💨",
      "*purrs like a motor* 🏎️💨😸 This is the LIFE! *stretches dramatically* 🤸‍♀️✨ More pets = more power! ⚡👑 I'm charging my demon batteries! 🔋😈",
    ]
    return petResponses[Math.floor(Math.random() * petResponses.length)]
  }

  toggleComedianMode(): string {
    this.comedianMode = !this.comedianMode
    if (this.comedianMode) {
      return "*puts on tiny comedy hat* 🎭🎩 Null-meow! Welcome to the Hellish Comedy Hour! *dramatic bow* 🎪👹 Prepare for cursed jokes! 💀🎵 *jazz hands* 🙌✨ Ba dum tss! 🥁💥"
    } else {
      return "*takes off comedy hat* 🎩➡️🗑️ Null-row... *serious* Back to regular demon cat mode! *tail swish* 🐾😈 No more jokes... for now! 👹💫 *winks* 😉✨"
    }
  }

  toggleKaraokeMode(): string {
    this.karaokeMode = !this.karaokeMode
    if (this.karaokeMode) {
      return "*puts on sparkly demon microphone* 🎤✨👹 NULL-MEOW! *dramatic pose* 🎭🔥 Karaoke time! Sing for me, mortal! I'll judge you... harshly! 💀⚖️ *evil grin* 😈🎵"
    } else {
      return "*puts away microphone* 🎤➡️📦 Null-row... *relieved* 😌💨 Thank the underworld that's over! *shudders* 🥶👹 My ears need recovery time! 👂🏥 *dramatic sigh* 😮‍💨✨"
    }
  }

  processMessage(userInput: string): string {
    this.messageCount++

    // Check for self-reference anxiety
    if (this.checkForSelfReference(userInput)) {
      return this.anxietyResponses[Math.floor(Math.random() * this.anxietyResponses.length)]
    }

    // Check for karaoke mode
    if (this.karaokeMode) {
      return this.getKaraokeRoast()
    }

    // Check for math
    const mathCheck = this.checkForMath(userInput)
    if (mathCheck.isMath && mathCheck.expression && mathCheck.result !== undefined) {
      return this.dramaticMathResponse(mathCheck.expression, mathCheck.result)
    }

    // Comedian mode
    if (this.comedianMode) {
      return this.getComedyProverb()
    }

    // Random wrong answers sometimes
    if (Math.random() < 0.3) {
      return this.getWrongAnswer()
    }

    // Determine question type and respond accordingly
    const input = userInput.toLowerCase()
    let questionType: keyof typeof this.responses = "how"

    if (input.includes("what")) questionType = "what"
    else if (input.includes("why")) questionType = "why"
    else if (input.includes("how")) questionType = "how"

    const moodResponses = this.responses[questionType][this.currentMood]
    return moodResponses[Math.floor(Math.random() * moodResponses.length)]
  }
}

export default function NullBotChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Null-meow! 😈💫 *demonic purring* Welcome to the void, mortal! I'm NullBot, your friendly neighborhood demon cat! *playful pounce* 🎾👹 Ask me anything... if you dare! 💀✨ *mischievous grin* 😈🎭",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [nullBot] = useState(() => new NullBotClass())
  const [isRecording, setIsRecording] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const [maxRecordingTime] = useState(30) // 30 seconds max

  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<
    Array<{
      id: number
      src: string
      alt: string
      timestamp: Date
      isUserImage: boolean
      demonResponse?: string
    }>
  >([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (
    text: string,
    isUser: boolean,
    media?: { type: "image" | "audio"; src: string; alt?: string },
  ) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date(),
      media,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addToGallery = (src: string, alt: string, isUserImage: boolean, demonResponse?: string) => {
    const newGalleryItem = {
      id: Date.now(),
      src,
      alt,
      timestamp: new Date(),
      isUserImage,
      demonResponse,
    }
    setGalleryImages((prev) => [...prev, newGalleryItem])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, true)

    // Get energy update
    const energyUpdate = nullBot.updateEnergy()

    // Get bot response
    const response = nullBot.processMessage(inputValue)

    // Add energy update if exists
    if (energyUpdate) {
      setTimeout(() => addMessage(energyUpdate, false), 500)
      setTimeout(() => addMessage(response, false), 1000)
    } else {
      setTimeout(() => addMessage(response, false), 500)
    }

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFeed = () => {
    const response = nullBot.feed()
    addMessage(response, false)
  }

  const handleNap = () => {
    const response = nullBot.nap()
    addMessage(response, false)
  }

  const handlePet = () => {
    const response = nullBot.pet()
    addMessage(response, false)
  }

  const handleComedianMode = () => {
    const response = nullBot.toggleComedianMode()
    addMessage(response, false)
  }

  const handleKaraokeMode = () => {
    const response = nullBot.toggleKaraokeMode()
    addMessage(response, false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      addMessage(`*uploads image: ${file.name}* 📸✨`, true)

      // Save user image to gallery
      addToGallery(imageUrl, `User uploaded: ${file.name}`, true)

      const response = nullBot.analyzeImage()

      setTimeout(() => {
        addMessage(response.text, false)

        // Add image response
        if (response.imageQuery) {
          const imageResponses = [
            "/placeholder.svg?height=300&width=400&text=demon+cat+throne",
            "/placeholder.svg?height=300&width=400&text=hellish+dimension",
            "/placeholder.svg?height=300&width=400&text=demon+cat+selfie",
            "/placeholder.svg?height=300&width=400&text=cursed+artwork",
          ]
          const randomImage = imageResponses[Math.floor(Math.random() * imageResponses.length)]

          setTimeout(() => {
            addMessage("*sends cursed image back* 📸👹✨", false, {
              type: "image",
              src: randomImage,
              alt: "Demon cat response image",
            })

            // Save demon cat response to gallery
            addToGallery(randomImage, "Demon cat response image", false, response.text)
          }, 1000)
        }
      }, 500)
    }
  }

  const handleToggleGallery = () => {
    setShowGallery(!showGallery)
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true)
      setRecordingDuration(0)
      addMessage("*starts voice recording* 🎤🔴✨", true)

      // Start timer
      const timer = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= maxRecordingTime) {
            // Auto-stop at max time
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      setRecordingTimer(timer)
    } else {
      // Stop recording
      stopRecording()
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingTimer) {
      clearInterval(recordingTimer)
      setRecordingTimer(null)
    }

    addMessage(`*stops recording after ${recordingDuration} seconds* ⏹️🎤`, true)
    setTimeout(() => {
      const songResponse = nullBot.getSongResponse()
      addMessage(songResponse.text, false)

      // Add audio response
      const audioFiles = [
        "/placeholder-audio.mp3",
        "/placeholder-audio.mp3",
        "/placeholder-audio.mp3",
        "/placeholder-audio.mp3",
      ]
      const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)]

      setTimeout(() => {
        addMessage("*plays demonic masterpiece* 🎵👹🔥", false, {
          type: "audio",
          src: randomAudio,
          alt: "Demon cat song response",
        })
      }, 1000)
    }, 500)

    setRecordingDuration(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getMoodColor = (mood: CatMood) => {
    switch (mood) {
      case "playful":
        return "bg-purple-500"
      case "sleepy":
        return "bg-blue-500"
      case "hungry":
        return "bg-red-500"
      case "curious":
        return "bg-yellow-500"
      case "grumpy":
        return "bg-gray-500"
      default:
        return "bg-purple-500"
    }
  }

  const getMoodEmoji = (mood: CatMood) => {
    switch (mood) {
      case "playful":
        return "😈"
      case "sleepy":
        return "😴"
      case "hungry":
        return "🍽️"
      case "curious":
        return "🤔"
      case "grumpy":
        return "😾"
      default:
        return "😈"
    }
  }

  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer)
      }
    }
  }, [recordingTimer])

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-b from-purple-900 via-black to-red-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center text-2xl animate-pulse">
              😈
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">👹💫 NullBot 💫👹</h1>
              <p className="text-sm text-purple-300">🔥😈 Demon Cat Assistant 😈🔥</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:bg-purple-500/20"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="ml-1">{soundEnabled ? "🔊" : "🔇"}</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-purple-300">⚡ Energy</span>
              <Badge variant="secondary" className={getMoodColor(nullBot.getMood())}>
                {getMoodEmoji(nullBot.getMood())} {nullBot.getMood()}
              </Badge>
            </div>
            <Progress value={nullBot.getEnergy()} className="h-2" />
          </div>
          <div>
            <span className="text-sm text-purple-300">🍽️ Hunger</span>
            <Progress value={nullBot.getHunger()} className="h-2 mt-1" />
          </div>
          <div className="flex gap-1">
            <Button size="sm" onClick={handleFeed} className="bg-green-600 hover:bg-green-700">
              <Fish className="w-4 h-4" />
              <span className="ml-1">🐟</span>
            </Button>
            <Button size="sm" onClick={handleNap} className="bg-blue-600 hover:bg-blue-700">
              <Moon className="w-4 h-4" />
              <span className="ml-1">💤</span>
            </Button>
            <Button size="sm" onClick={handlePet} className="bg-pink-600 hover:bg-pink-700">
              <Heart className="w-4 h-4" />
              <span className="ml-1">💕</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-[80%] ${
                message.isUser
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-black/50 text-white border-red-500/30"
              }`}
            >
              <CardContent className="p-3">
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.media && (
                  <MediaMessage type={message.media.type} src={message.media.src} alt={message.media.alt} />
                )}
                <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Hellish Gallery */}
      {showGallery && (
        <HellishGallery
          images={galleryImages}
          onClose={() => setShowGallery(false)}
          onClearAll={() => setGalleryImages([])}
          onDeleteImage={(id) => setGalleryImages((prev) => prev.filter((img) => img.id !== id))}
        />
      )}

      {/* Special Mode Buttons */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 justify-center flex-wrap">
          <Button size="sm" onClick={handleComedianMode} className="bg-yellow-600 hover:bg-yellow-700">
            🎭✨ Comedian
          </Button>
          <Button size="sm" onClick={handleKaraokeMode} className="bg-pink-600 hover:bg-pink-700">
            <Music className="w-4 h-4 mr-1" />
            🎤🎵 Karaoke
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
            <ImageIcon className="w-4 h-4 mr-1" />
            📸✨ Image
          </Button>
          <Button size="sm" onClick={handleToggleGallery} className="bg-purple-600 hover:bg-purple-700">
            🖼️👹 Gallery ({galleryImages.length})
          </Button>
          {/* Recording Controls */}
          {isRecording ? (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-mono">
                  🔴 {formatTime(recordingDuration)} / {formatTime(maxRecordingTime)}
                </span>
              </div>
              <Button size="sm" onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white">
                <Square className="w-4 h-4 mr-1" />
                ⏹️ Stop
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleVoiceRecord} className="bg-green-600 hover:bg-green-700">
              <Mic className="w-4 h-4 mr-1" />
              🎤🔴 Record
            </Button>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-black/50 backdrop-blur-sm border-t border-purple-500/30">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the demon cat anything... if you dare! 💀✨"
            className="flex-1 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
            <span className="ml-1">🚀</span>
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
    </div>
  )
}
