"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, StopCircle } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  onListeningChange?: (isListening: boolean) => void
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceInput({ onTranscript, onListeningChange }: VoiceInputProps) {
  const { settings } = useSettings()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [visualizer, setVisualizer] = useState<number[]>(Array(20).fill(5))
  const [error, setError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US" // Make this configurable in settings

      recognitionInstance.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognitionInstance.onend = () => {
        stopListening()
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setError(`Error: ${event.error}. Please try again.`)
        stopListening()
      }

      setRecognition(recognitionInstance)
    }

    return () => {
      stopListening()
    }
  }, [])

  // Start audio visualization
  const startAudioVisualization = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      // Get microphone access
      microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Create analyzer
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      // Connect microphone to analyzer
      const source = audioContextRef.current.createMediaStreamSource(microphoneStreamRef.current)
      source.connect(analyserRef.current)

      // Start visualization loop
      visualizeAudio()
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  // Visualize audio data
  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateVisualizer = () => {
      if (!analyserRef.current || !isListening) return

      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average levels for visualization
      const newVisualizer = [...visualizer]
      const step = Math.floor(bufferLength / visualizer.length)

      for (let i = 0; i < visualizer.length; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j]
        }
        // Scale the value (0-255) to a reasonable height (5-30px)
        newVisualizer[i] = 5 + (sum / step) * 0.1
      }

      setVisualizer(newVisualizer)
      animationFrameRef.current = requestAnimationFrame(updateVisualizer)
    }

    animationFrameRef.current = requestAnimationFrame(updateVisualizer)
  }

  // Start listening
  const startListening = async () => {
    setError(null)
    setTranscript("")

    try {
      await startAudioVisualization()
      recognition?.start()
      setIsListening(true)
      onListeningChange?.(true)
    } catch (err) {
      console.error("Error starting speech recognition:", err)
      setError("Could not start speech recognition. Please try again.")
    }
  }

  // Stop listening
  const stopListening = () => {
    // Stop speech recognition
    if (recognition && isListening) {
      recognition.stop()
    }

    // Stop audio visualization
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Stop microphone stream
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
    }

    setIsListening(false)
    onListeningChange?.(false)
    setVisualizer(Array(20).fill(5))
  }

  // Toggle listening state
  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      stopListening()
      if (transcript) {
        onTranscript(transcript)
        setTranscript("")
      }
    } else {
      startListening()
    }
  }

  // Submit transcript
  const submitTranscript = () => {
    if (transcript) {
      onTranscript(transcript)
      setTranscript("")
      stopListening()
    }
  }

  if (!recognition) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <MicOff className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Voice input is not supported in your browser.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm mb-2 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="relative">
        <Button
          type="button"
          size="lg"
          className={`rounded-full h-16 w-16 ${
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleListening}
        >
          {isListening ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </Button>
        {isListening && (
          <div className="absolute -top-1 -right-1 -left-1 -bottom-1 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
        )}
      </div>

      {isListening && (
        <div className="text-center w-full">
          <div className="flex justify-center items-end h-12 mb-2 space-x-1">
            {visualizer.map((height, index) => (
              <div
                key={index}
                className="w-1 bg-blue-500 rounded-full transition-all duration-100 ease-in-out"
                style={{ height: `${height}px` }}
              ></div>
            ))}
          </div>
          <p className="text-sm font-medium">Listening...</p>
          {transcript && (
            <>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">{transcript}</p>
              <Button type="button" size="sm" className="mt-2" onClick={submitTranscript}>
                Send
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
