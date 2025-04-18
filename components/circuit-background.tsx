"use client"

import { useEffect, useRef } from "react"

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawCircuits()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    function drawCircuits() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set colors to match our theme
      const lineColor = "rgba(147, 51, 234, 0.1)" // Purple with opacity
      const nodeColor = "rgba(147, 51, 234, 0.15)"
      const accentColor = "rgba(253, 224, 71, 0.2)" // Yellow with opacity

      // Draw flowing lines
      drawFlowingLines(ctx, canvas.width, canvas.height, lineColor)

      // Draw circuit nodes
      drawNodes(ctx, canvas.width, canvas.height, nodeColor)

      // Draw accent elements
      drawAccents(ctx, canvas.width, canvas.height, accentColor)
    }

    function drawFlowingLines(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5

      // Draw curved lines
      for (let i = 0; i < 15; i++) {
        const startX = Math.random() * width
        const startY = Math.random() * height

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        // Create a flowing curve
        const cp1x = startX + Math.random() * 200 - 100
        const cp1y = startY + Math.random() * 200 - 100
        const cp2x = startX + Math.random() * 400 - 200
        const cp2y = startY + Math.random() * 400 - 200
        const endX = startX + Math.random() * 600 - 300
        const endY = startY + Math.random() * 600 - 300

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
        ctx.stroke()
      }

      // Draw straight lines for circuit-like appearance
      for (let i = 0; i < 20; i++) {
        const startX = Math.random() * width
        const startY = Math.random() * height

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        // Create a path with right angles
        let currentX = startX
        let currentY = startY

        for (let j = 0; j < 3; j++) {
          const direction = Math.floor(Math.random() * 4)
          const distance = 50 + Math.random() * 150

          if (direction === 0) currentX += distance
          else if (direction === 1) currentX -= distance
          else if (direction === 2) currentY += distance
          else currentY -= distance

          ctx.lineTo(currentX, currentY)
        }

        ctx.stroke()
      }
    }

    function drawNodes(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
      ctx.fillStyle = color

      // Draw circuit nodes
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const radius = 2 + Math.random() * 4

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawAccents(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineWidth = 2

      // Draw triangles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 10 + Math.random() * 20

        ctx.beginPath()
        ctx.moveTo(x, y - size)
        ctx.lineTo(x + size, y + size)
        ctx.lineTo(x - size, y + size)
        ctx.closePath()
        ctx.fill()
      }

      // Draw squares
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 5 + Math.random() * 15

        ctx.beginPath()
        ctx.rect(x - size / 2, y - size / 2, size, size)
        ctx.fill()
      }
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}

