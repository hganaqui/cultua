// src/app/not-found.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function NotFound() {
  const [hoveredBtn, setHoveredBtn] = useState<'home' | 'explorar' | null>(null)

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6 py-10 text-center font-sans">
      {/* Imagem 404 */}
      <div className="mb-8 max-w-xs">
        <Image
          src="/404-not-found.jpg"
          alt="Conteúdo não encontrado"
          width={240}
          height={240}
          priority
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-500 mb-3 tracking-tight">
        Conteúdo não encontrado
      </h1>

      {/* Subtítulo */}
      <p className="text-gray-400 text-base max-w-sm leading-relaxed mb-10">
        O conteúdo que você procura pode ter sido removido ou o endereço está incorreto.
      </p>

      {/* Versículo */}
      <blockquote className="border-l-4 border-amber-500 pl-5 mb-12 max-w-md text-left">
        <p className="text-gray-300 italic mb-3 text-sm leading-relaxed">
          "Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de
          causar dano, planos de dar a vocês esperança e um futuro."
        </p>
        <cite className="text-amber-500 text-xs font-bold">Jeremias 29:11</cite>
      </blockquote>

      {/* Ações */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className={`px-8 py-3 rounded-lg font-bold text-base transition-opacity ${
            hoveredBtn === 'home'
              ? 'bg-amber-500 text-black opacity-85'
              : 'bg-amber-500 text-black opacity-100'
          }`}
          onMouseEnter={() => setHoveredBtn('home')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🏠 Voltar ao Início
        </Link>

        <Link
          href="/explorar"
          className={`px-8 py-3 rounded-lg font-semibold text-base border transition-colors ${
            hoveredBtn === 'explorar'
              ? 'bg-transparent text-white border-amber-500'
              : 'bg-transparent text-white border-gray-700'
          }`}
          onMouseEnter={() => setHoveredBtn('explorar')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🔍 Explorar Conteúdos
        </Link>
      </div>
    </main>
  )
}