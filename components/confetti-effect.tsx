"use client"

import { useEffect } from "react"

export default function ConfettiEffect() {
  useEffect(() => {
    const showConfetti = async () => {
      // Dynamically import the confetti library
      const confetti = (await import("canvas-confetti")).default

      // Create the confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#f59e0b", "#fef3c7"],
      })

      // Fire a second burst for more effect
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#a855f7", "#f59e0b", "#fef3c7"],
        })
      }, 250)

      // Fire a third burst from the other side
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#a855f7", "#f59e0b", "#fef3c7"],
        })
      }, 400)
    }

    showConfetti()
  }, [])

  return null
}

