import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Particles from '@tsparticles/react';

import {
  FiZap,
  FiFileText,
  FiPieChart,
  FiDollarSign,
  FiArrowRight,
  FiPlay,
  FiCamera,
  FiGithub,
  FiBarChart2,
  FiClock,
  FiShare2
} from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: FiFileText, title: "OCR Scanning", desc: "Automatically extract data from your receipts" },
  { icon: FiPieChart, title: "Expense Analytics", desc: "Visualize spending patterns and trends" },
  { icon: FiDollarSign, title: "Budget Tracking", desc: "Stay on top of your financial goals" },
  { icon: FiBarChart2, title: "Smart Categories", desc: "AI-powered expense categorization" },
]

const testimonials = [
  { name: "Sarah J.", text: "This app transformed how I track business expenses.", role: "Small Business Owner" },
  { name: "Mike R.", text: "The OCR accuracy is incredible, saves me hours each month!", role: "Freelancer" },
  { name: "Emma L.", text: "Finally a receipt tracker that's both powerful and easy to use.", role: "Financial Advisor" },
]

const techStack = [
  { name: "React", icon: "/icons/react.svg", desc: "UI Library" },
  { name: "TypeScript", icon: "/icons/typescript.svg", desc: "Type Safety" },
  { name: "Tailwind CSS", icon: "/icons/tailwind.svg", desc: "Styling" },
  { name: "Zustand", icon: "/icons/zustand.png", desc: "State Management" },
  { name: "Tesseract OCR", icon: "/icons/tesseract.png", desc: "Receipt Scanning" },
  { name: "Recharts", icon: "/icons/recharts.svg", desc: "Data Visualization" },
]

// Receipt card component with enhanced animations
const ReceiptCard = ({
  src,
  alt,
  style,
  delay,
  scale = 1,
  zIndex = 10
}: {
  src: string,
  alt: string,
  style: string,
  delay: number,
  scale?: number,
  zIndex?: number
}) => (
  <motion.div
    whileHover={{
      scale: scale + 0.05,
      rotate: 0,
      zIndex: 50,
      boxShadow: "0 25px 35px -5px rgba(0, 0, 0, 0.4)"
    }}
    whileTap={{ scale: scale - 0.05 }}
    drag
    dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
    className={cn(
      'absolute rounded-xl shadow-2xl border-4 border-white/80 cursor-grab backdrop-blur-sm overflow-hidden',
      style
    )}
    style={{
      width: `${scale * 160}px`,
      height: `${scale * 220}px`,
      zIndex
    }}
    initial={{ opacity: 0, y: -50, rotate: Math.random() * 16 - 8 }}
    animate={{
      opacity: 1,
      y: 0,
      rotate: Math.random() * 12 - 6,
      transition: {
        delay,
        type: 'spring',
        stiffness: 50,
        duration: 0.8
      }
    }}
  >
    <motion.div
      className="w-full h-full bg-white"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 1.5 }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
    <motion.div
      className="absolute bottom-3 left-3 text-white text-xs md:text-sm font-medium"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.3, duration: 0.5 }}
    >
      {alt}
    </motion.div>
  </motion.div>
)

// Floating receipt that moves in a path
const FloatingReceipt = ({
  src,
  alt,
  delay,
  pathX = [-20, 20, -10, 15, -15, 10, -5, 0],
  pathY = [0, -15, 15, -10, 5, -5, 0, 10],
  duration = 20,
  size = { width: 120, height: 180 }
}: {
  src: string,
  alt: string,
  delay: number,
  pathX?: number[],
  pathY?: number[],
  duration?: number,
  size?: { width: number, height: number }
}) => (
  <motion.div
    className="absolute rounded-xl shadow-2xl border-2 border-white/60 overflow-hidden bg-white"
    style={{ width: size.width, height: size.height }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: 1,
      scale: 1,
      x: pathX,
      y: pathY,
      transition: {
        opacity: { delay, duration: 1 },
        scale: { delay, duration: 1 },
        x: {
          repeat: Infinity,
          repeatType: "mirror",
          duration,
          ease: "linear"
        },
        y: {
          repeat: Infinity,
          repeatType: "mirror",
          duration,
          ease: "linear"
        }
      }
    }}
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
  </motion.div>
)

const LandingPage = () => {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  // Particle configuration
  const particlesOptions = {
    particles: {
      number: { value: 50 },
      move: { enable: true, speed: 0.5 },
      opacity: { value: 0.5 },
      size: { value: 1 },
    },
  };

  // GSAP animations
  useGSAP(() => {
    gsap.from(".feature-item", {
      opacity: 0,
      y: 100,
      stagger: 0.1,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top center"
      }
    })

    gsap.from(".testimonial-card", {
      scale: 0.8,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top center"
      }
    })
  })

  // Cursor animation
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor')
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
      })
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div className="scroll-smooth">
      {/* Animated cursor */}
      <div className="custom-cursor fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-50 mix-blend-difference" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-black via-purple-950/30 to-black text-white font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-[100px] animate-pulse-slow-delay" />

        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />

        {/* Receipt Gallery */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Left side receipts */}
          <div className="absolute left-0 top-0 h-full w-1/3 flex items-center">
            <div className="relative h-[80vh] w-full">
              <ReceiptCard
                src="/images/receipt1.jpg"
                alt="Grocery Receipt"
                style="top-[5%] left-[10%]"
                delay={0.2}
                scale={1.2}
                zIndex={12}
              />
              <ReceiptCard
                src="/images/receipt2.jpg"
                alt="Restaurant Bill"
                style="top-[30%] left-[25%]"
                delay={0.5}
                scale={0.9}
                zIndex={11}
              />
              <ReceiptCard
                src="/images/receipt3.jpg"
                alt="Gas Station"
                style="top-[60%] left-[15%]"
                delay={0.8}
                scale={1.1}
                zIndex={10}
              />

              {/* Floating receipts with paths */}
              <FloatingReceipt
                src="/images/receipt4.jpg"
                alt="Coffee Shop"
                delay={1.2}
                pathX={[-10, 30, 10, 40, 20, 0]}
                pathY={[0, 20, 40, 10, 30, 50]}
                duration={25}
                size={{ width: 100, height: 160 }}
              />
            </div>
          </div>

          {/* Right side receipts */}
          <div className="absolute right-0 top-0 h-full w-1/3 flex items-center">
            <div className="relative h-[80vh] w-full">
              <ReceiptCard
                src="/images/receipt5.jpg"
                alt="Electronics Store"
                style="top-[15%] right-[15%]"
                delay={0.3}
                scale={1.1}
                zIndex={12}
              />
              <ReceiptCard
                src="/images/receipt6.jpg"
                alt="Online Order"
                style="top-[45%] right-[25%]"
                delay={0.6}
                scale={0.95}
                zIndex={11}
              />
              <ReceiptCard
                src="/images/receipt7.jpg"
                alt="Pharmacy"
                style="top-[70%] right-[10%]"
                delay={0.9}
                scale={1.05}
                zIndex={10}
              />

              {/* Floating receipts with paths */}
              <FloatingReceipt
                src="/images/receipt8.jpg"
                alt="Subscription"
                delay={1.5}
                pathX={[10, -20, 0, -30, -10, -40]}
                pathY={[10, 30, 50, 20, 40, 0]}
                duration={30}
                size={{ width: 90, height: 150 }}
              />
            </div>
          </div>

          {/* Center floating receipts */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <FloatingReceipt
              src="/images/receipt9.jpg"
              alt="Travel Expense"
              delay={2}
              pathX={[-50, 0, 50, 25, -25]}
              pathY={[-25, 25, 0, -50, 50]}
              duration={35}
              size={{ width: 110, height: 170 }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8 backdrop-blur-md bg-black/30 p-10 rounded-2xl border border-white/10 max-w-3xl shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                <motion.span
                  className="block"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Smart Receipt
                </motion.span>
                <motion.span
                  className="block mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Organizer
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Effortlessly scan, organize, and analyze your receipts with OCR and AI-powered insights
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 hover:shadow-xl transition-all w-full sm:w-auto group"
              >
                <span>View Demo</span>
                <FiPlay className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-white/30 hover:bg-white/10 hover:scale-105 backdrop-blur-sm w-full sm:w-auto group"
              >
                <FiGithub className="mr-2 h-5 w-5 group-hover:text-purple-400 transition-colors" />
                <span>GitHub</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="w-8 h-12 border-2 rounded-full border-white/50 relative flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-3 bg-purple-400 rounded-full absolute top-2"
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 5, 10] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gradient-to-b from-black via-purple-950/10 to-black px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/10 to-transparent" />
        <div className="absolute -left-24 top-1/4 w-48 h-48 bg-purple-600/10 rounded-full filter blur-[80px]" />
        <div className="absolute -right-24 bottom-1/4 w-48 h-48 bg-pink-600/10 rounded-full filter blur-[80px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block mb-3 px-4 py-1.5 bg-purple-500/10 rounded-full backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-purple-300">Powerful Features</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              Why Choose MemoryVault?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-lg text-white/70"
            >
              Our platform offers cutting-edge tools to preserve and enhance your precious memories
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="feature-item p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors">{title}</h3>
                <p className="text-white/70 group-hover:text-white/80 transition-colors">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block mb-3 px-4 py-1.5 bg-purple-500/10 rounded-full backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-purple-300">How It Works</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              Receipts to Insights in Seconds
            </motion.h2>
          </motion.div>

          {/* Receipt Flow Animation */}
          <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden rounded-2xl shadow-2xl">
            {/* Horizontal flowing receipts */}
            <div className="absolute inset-0 flex items-center">
              <motion.div
                className="flex gap-4 absolute"
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 30,
                  ease: "linear"
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div
                    key={`flow-1-${num}`}
                    className="w-48 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white"
                  >
                    <img
                      src={`/images/receipt${(num % 9) + 1}.jpg`}
                      alt={`Receipt ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Reverse flowing receipts */}
            <div className="absolute inset-0 flex items-center pt-44">
              <motion.div
                className="flex gap-4 absolute"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 25,
                  ease: "linear"
                }}
              >
                {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                  <div
                    key={`flow-2-${num}`}
                    className="w-48 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white"
                  >
                    <img
                      src={`/images/receipt${(num % 9) + 1}.jpg`}
                      alt={`Receipt ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
            <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black" />

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10 max-w-md text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">Three Simple Steps</h3>
                <ol className="text-white/80 mb-6 text-left space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="bg-purple-500/20 w-7 h-7 rounded-full flex items-center justify-center text-purple-300 font-bold">1</span>
                    <span>Scan or upload your receipts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="bg-purple-500/20 w-7 h-7 rounded-full flex items-center justify-center text-purple-300 font-bold">2</span>
                    <span>OCR automatically extracts data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="bg-purple-500/20 w-7 h-7 rounded-full flex items-center justify-center text-purple-300 font-bold">3</span>
                    <span>View insights and track expenses</span>
                  </li>
                </ol>
                <Button
                  className="bg-white text-purple-900 hover:bg-purple-100"
                >
                  See Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-20 px-4 bg-gradient-to-br from-black to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">User Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                className="testimonial-card p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-400/50 transition-all"
                whileHover={{ y: -10 }}
              >
                <div className="text-purple-400 text-2xl mb-4">“</div>
                <p className="text-lg mb-4">{testimonial.text}</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-white/60">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-purple-950/20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/images/receipt-pattern.png')] opacity-5 bg-repeat" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute -left-24 top-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-[100px]" />
        <div className="absolute -right-24 bottom-1/4 w-64 h-64 bg-pink-600/10 rounded-full filter blur-[100px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="p-10 rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
            >
              About This Project
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            >
              Smart Receipt Organizer was developed as a showcase project using modern web technologies. It demonstrates OCR capabilities, data visualization, and intuitive expense management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-6 justify-center"
            >
              <Button
                size="lg"
                className="px-12 py-7 text-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 hover:shadow-2xl transition-all group"
              >
                <span>View Source</span>
                <FiGithub className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-12 py-7 text-xl border-white/30 hover:bg-white/10 hover:scale-105 backdrop-blur-sm group"
              >
                <span>Try Demo</span>
                <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage