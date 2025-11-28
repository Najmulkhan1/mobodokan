"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, BatteryCharging, Cpu, Smartphone, Sun, Moon } from 'lucide-react'

export default function AboutMobodokan() {
  

  

  // Use plain numeric literals (no underscore separators)
  const stats = [
    { label: 'Devices Reviewed', value: 1248 },
    { label: 'Happy Customers', value: 12430 },
    { label: 'Repairs Completed', value: 5620 },
    { label: 'Years in Business', value: 6 }
  ]

  const team = [
    { name: 'Amin Rahman', role: 'Founder & CEO', img: '/images/team-amin.jpg' },
    { name: 'Nadia Islam', role: 'Lead Technician', img: '/images/team-nadia.jpg' },
    { name: 'Rafi Khan', role: 'UX & Product', img: '/images/team-rafi.jpg' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1">
          <motion.div className="flex items-start justify-between">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight"
            >
              About <span className="text-indigo-600 dark:text-indigo-400">Mobodokan</span>
            </motion.h1>

           
          </motion.div>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mt-6 text-lg text-slate-700 dark:text-slate-300"
          >
            Mobodokan is where mobile laptops — phones, tablets, and portable PCs — meet honest reviews,
            careful repairs, and clear buying advice. We help users pick, maintain, and extend the life of their
            mobile devices.
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/contact" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:brightness-105">
              <Phone size={16} /> Contact Us
            </a>
            <a href="/shop" className="inline-flex items-center gap-3 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <BatteryCharging size={16} /> Parts & Accessories
            </a>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 bg-gradient-to-tr from-white dark:from-slate-800 to-indigo-50 dark:to-slate-900 rounded-2xl p-6 shadow-lg"
        >
          <div className="relative h-64 rounded-xl overflow-hidden">
            {/* Replace with actual hero image in /public/images */}
            <Image src="https://i.ibb.co/0RtQ80yb/Gemini-Generated-Image-a7bjrka7bjrka7bj.png" alt="Mobodokan devices collage" fill className="object-cover" />
          </div>
        </motion.div>
      </section>

      {/* MISSION & VALUES */}
      <section className="bg-white dark:bg-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none bg-gradient-to-b from-white dark:from-slate-800 to-slate-50 dark:to-slate-800">
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">To make mobile-laptop tech approachable — whether you're buying, repairing, or learning to maintain your device.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
            <h3 className="text-xl font-semibold flex items-center gap-2">Integrity</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">We test honestly, list flaws clearly, and recommend what we'd use ourselves.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
            <h3 className="text-xl font-semibold">Sustainability</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Extending device life through repair, parts availability, and practical how-to guides.</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <motion.div key={s.label} whileInView={{ y: 0, opacity: 1 }} initial={{ y: 10, opacity: 0 }} className="p-5 bg-gradient-to-b from-white dark:from-slate-800 to-slate-50 dark:to-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {Number(s.value).toLocaleString()}
              </div>
              <div className="text-sm mt-2 text-slate-500 dark:text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / SERVICES */}
      <section className="bg-indigo-50 dark:bg-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold">What we do</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">From bite-sized buying guides and in-depth reviews to repair tutorials and part sourcing — Mobodokan covers the full lifecycle of mobile laptops.</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <Cpu />
                <h4 className="font-semibold">Honest Reviews</h4>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Benchmarks, real-world battery life, and usability tests focused on portability.</p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <BatteryCharging />
                <h4 className="font-semibold">Repair Guides</h4>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Step-by-step fixes, parts lists, and tips to keep devices running longer.</p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <Smartphone />
                <h4 className="font-semibold">Parts & Sourcing</h4>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Curated parts for common mobile laptop models, tested and verified by our techs.</p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <Mail />
                <h4 className="font-semibold">Support & Consultation</h4>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">Personalized help if your device needs diagnosis or repair recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold mb-6">Meet the team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none flex flex-col items-center text-center">
              <div className="w-28 h-28 mb-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image src={m.img} alt={m.name} width={112} height={112} className="object-cover" />
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{m.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="bg-gradient-to-tr from-slate-900 to-indigo-900 dark:from-slate-900 dark:to-slate-950 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold">Ready to give your mobile laptop the care it deserves?</h4>
            <p className="text-slate-200 mt-2">Contact Mobodokan for trusted advice and reliable service.</p>
          </div>
          <div className="flex gap-3">
            <a href="/contact" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold">Get Support</a>
            <a href="/shop" className="inline-flex items-center gap-2 border border-white px-4 py-2 rounded-lg">Shop Parts</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
