'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"

export default function CatchBallsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameActive, setIsGameActive] = useState(false)

  useEffect(() => {
    if (!isGameActive) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let animationFrameId: number
    let balls: { x: number; y: number; radius: number; color: string; speed: number }[] = []

    const createBall = () => {
      const radius = Math.random() * 20 + 10
      const x = Math.random() * (canvas.width - radius * 2) + radius
      const y = 0
      const color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
      const speed = Math.random() * 2 + 1
      balls.push({ x, y, radius, color, speed })
    }

    const drawBall = (ball: typeof balls[0]) => {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = ball.color
      ctx.fill()
      ctx.closePath()
    }

    const updateBalls = () => {
      balls.forEach((ball, index) => {
        ball.y += ball.speed
        if (ball.y > canvas.height + ball.radius) {
          balls.splice(index, 1)
        }
      })
    }

    const checkCollision = (x: number, y: number) => {
      balls.forEach((ball, index) => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2)
        if (distance < ball.radius) {
          setScore(prevScore => prevScore + 1)
          balls.splice(index, 1)
        }
      })
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top
      checkCollision(x, y)
    }

    const render = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      updateBalls()
      balls.forEach(drawBall)
      if (Math.random() < 0.05) createBall()
      animationFrameId = requestAnimationFrame(render)
    }

    canvas.addEventListener('touchstart', handleTouch)
    render()

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer)
          cancelAnimationFrame(animationFrameId)
          setIsGameActive(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(timer)
      canvas.removeEventListener('touchstart', handleTouch)
    }
  }, [isGameActive])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsGameActive(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">discord by : s_5o</h1>
      <div className="mb-4 text-xl">
        <span className="font-bold">النقاط:</span> {score} | <span className="font-bold">الوقت المتبقي:</span> {timeLeft}
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        className="border-2 border-gray-300 rounded-lg mb-4"
      />
      {!isGameActive && (
        <Button onClick={startGame} className="px-4 py-2 bg-blue-500 text-white rounded">
          {timeLeft === 30 ? 'ابدأ اللعبة' : 'العب مرة أخرى'}
        </Button>
      )}
    </div>
  )
      }
