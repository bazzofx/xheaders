"use client"

import { useEffect, useRef, useState } from "react"

export default function FlyingBadEmailIcon() {
  const iconRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({
    left: "-100px",
    top: "100%",
    opacity: 0,
    transform: "rotate(0deg) scale(0.6)",
    transition: "none",
  })

  useEffect(() => {
    // Start the animation after a delay
    const timeout = setTimeout(() => {
      moveIcon()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  const moveIcon = () => {
    // Get window dimensions
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Set random starting position at bottom right
    const startX = windowWidth - Math.random() * (windowWidth * 0.3)
    const startY = windowHeight - Math.random() * 200

    // Calculate target position (moving upward to the left)
    const targetX = -100
    const targetY = -100 + Math.random() * (windowHeight * 0.3)

    // Random rotation (-20 to 20 degrees)
    const rotation = Math.random() * 40 - 20

    // Scale (slightly larger than good emails)
    const scale = 0.7

    // Set starting position with no transition
    setStyle({
      left: `${startX}px`,
      top: `${startY}px`,
      opacity: 0.7,
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: "none",
    })

    // Force reflow to ensure the starting position is applied before transition
    if (iconRef.current) {
      void iconRef.current.offsetWidth
    }

    // After a short delay, start the transition to the target position
    setTimeout(() => {
      // Calculate a slow duration (15 seconds)
      const duration = 15

      setStyle({
        left: `${targetX}px`,
        top: `${targetY}px`,
        opacity: 0.7,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transition: `left ${duration}s linear, top ${duration}s linear, transform ${duration}s ease-in-out`,
      })

      // Set up the next movement after this one completes
      setTimeout(() => {
        // Hide the icon before repositioning
        setStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: "opacity 0.5s ease",
        }))

        // After fading out, start a new movement
        setTimeout(() => {
          moveIcon()
        }, 600)
      }, duration * 1000)
    }, 50)
  }

  return (
    <div
      ref={iconRef}
      className="fixed pointer-events-none z-50"
      style={{
        ...style,
        width: "80px",
        height: "50px",
      }}
    >
      <svg
        fill="#b3425e"
        viewBox="0 0 24 24"
        id="email"
        data-name="Flat Color"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect id="primary" x="2" y="4" width="20" height="16" rx="2" style={{ fill: "#feb4b4" }} />
        <path
          id="secondary"
          d="M21.25,4.45A2,2,0,0,0,20,4H4a2,2,0,0,0-1.25.45A1,1,0,0,0,2.76,6l8,6.29a2,2,0,0,0,2.48,0l8-6.29a1,1,0,0,0,0-1.56Z"
          style={{ fill: "#ffdbdb" }}
        />
      </svg>
    </div>
  )
}

