"use client"

import { useEffect, useState, useRef } from "react"

interface VoiceOutputProps {
  text: string
  voiceType?: string
  voiceSpeed?: string
  onStart?: () => void
  onEnd?: () => void
}

export function VoiceOutput({ text, voiceType = "default", voiceSpeed = "1", onStart, onEnd }: VoiceOutputProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize and get available voices
  useEffect(() => {
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
      }
    }

    // Chrome loads voices asynchronously
    if (typeof window !== "undefined" && window.speechSynthesis) {
      getVoices()
      window.speechSynthesis.onvoiceschanged = getVoices
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Speak text when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis && text && voices.length > 0) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Set voice based on voiceType
      let selectedVoice: SpeechSynthesisVoice | undefined

      if (voiceType === "male") {
        selectedVoice = voices.find(
          (voice) => (voice.name.includes("Male") || voice.name.includes("male")) && voice.lang.includes("en"),
        )
      } else if (voiceType === "female") {
        selectedVoice = voices.find(
          (voice) => (voice.name.includes("Female") || voice.name.includes("female")) && voice.lang.includes("en"),
        )
      } else {
        // Default to first English voice
        selectedVoice = voices.find((voice) => voice.lang.includes("en"))
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Set speech rate
      utterance.rate = Number.parseFloat(voiceSpeed)

      // Set event handlers
      utterance.onstart = () => {
        setIsSpeaking(true)
        onStart?.()
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        onEnd?.()
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsSpeaking(false)
        onEnd?.()
      }

      // Speak the text
      window.speechSynthesis.speak(utterance)
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text, voiceType, voiceSpeed, voices, onStart, onEnd])

  // Provide a way to stop speaking
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      onEnd?.()
    }
  }

  // Return null as this component doesn't render anything visible
  // But we could add a small indicator if needed
  return isSpeaking ? (
    <div
      className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-2 shadow-lg cursor-pointer z-50"
      onClick={stopSpeaking}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
    </div>
  ) : null
}
