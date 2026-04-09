<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">

    <h2 class="text-lg font-bold text-[#1b2a4a] mb-1">Contactar al ofertante</h2>
    <p class="text-xs text-gray-400 mb-4">Información provista por el ofertante:</p>

    <!-- Sin contacto -->
    <div v-if="!contactos.length" class="text-center py-6 text-gray-400 bg-gray-50 rounded-xl">
      <p class="text-2xl mb-2">📭</p>
      <p class="text-sm">El ofertante no ha provisto información de contacto.</p>
    </div>

    <!-- Lista de contactos -->
    <div v-else class="flex flex-col gap-3">
      <component
        :is="item.href ? 'a' : 'div'"
        v-for="(item, i) in contactos"
        :key="i"
        :href="item.href || undefined"
        :target="item.target || undefined"
        :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-colors group"
        :class="item.hoverClass"
      >
        <span
          class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          :class="item.iconClass"
        >
          {{ item.icon }}
        </span>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">{{ item.label }}</p>
          <p class="text-sm font-semibold leading-tight" :class="item.textClass">{{ item.value }}</p>
        </div>
      </component>
    </div>

    <p class="text-xs text-gray-400 italic mt-4 leading-relaxed">
      Contáctate directamente con el ofertante para coordinar horarios y modalidad.
    </p>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  curso: { type: Object, required: true }
})

//Detecta el tipo de un valor de contacto
function detectarTipo(val) {
  const v = val.trim()

  if (/@/.test(v) && !/^https?:\/\//i.test(v)) {
    return {
      label: 'Correo',
      icon: '@',
      href: `mailto:${v}`,
      target: null,
      iconClass: 'bg-green-100 text-green-700',
      textClass: 'text-green-700 group-hover:underline',
      hoverClass: 'hover:border-green-200 hover:bg-green-50',
    }
  }

  if (/^\+?[\d\s\-().]{6,}$/.test(v)) {
    return {
      label: 'Teléfono',
      icon: '📞',
      href: `tel:${v.replace(/\s/g, '')}`,
      target: null,
      iconClass: 'bg-blue-100 text-blue-700',
      textClass: 'text-blue-700 group-hover:underline',
      hoverClass: 'hover:border-blue-200 hover:bg-blue-50',
    }
  }
  // WhatsApp
  if (/wa\.me|whatsapp/i.test(v)) {
    const href = /^https?:\/\//i.test(v) ? v : `https://wa.me/${v.replace(/\D/g, '')}`
    return {
      label: 'WhatsApp',
      icon: '💬',
      href,
      target: '_blank',
      iconClass: 'bg-emerald-100 text-emerald-700',
      textClass: 'text-emerald-700 group-hover:underline',
      hoverClass: 'hover:border-emerald-200 hover:bg-emerald-50',
    }
  }
  // LinkedIn
  if (/linkedin/i.test(v)) {
    return {
      label: 'LinkedIn',
      icon: 'in',
      href: /^https?:\/\//i.test(v) ? v : `https://${v}`,
      target: '_blank',
      iconClass: 'bg-indigo-100 text-indigo-700',
      textClass: 'text-indigo-700 group-hover:underline',
      hoverClass: 'hover:border-indigo-200 hover:bg-indigo-50',
    }
  }
  // URL 
  if (/^https?:\/\//i.test(v) || /^www\./i.test(v)) {
    return {
      label: 'Sitio web',
      icon: '🌐',
      href: /^https?:\/\//i.test(v) ? v : `https://${v}`,
      target: '_blank',
      iconClass: 'bg-amber-100 text-amber-700',
      textClass: 'text-amber-700 group-hover:underline',
      hoverClass: 'hover:border-amber-200 hover:bg-amber-50',
    }
  }

  return {
    label: 'Contacto',
    icon: '📌',
    href: null,
    target: null,
    iconClass: 'bg-gray-100 text-gray-500',
    textClass: 'text-gray-700',
    hoverClass: 'bg-gray-50',
  }
}

const contactos = computed(() => {
  const raw = props.curso?.contacto
  if (!raw || !String(raw).trim()) return []

  const separador = raw.includes(' | ') ? ' | ' : ','
  return String(raw)
    .split(separador)
    .map(v => v.trim())
    .filter(Boolean)
    .map(v => ({ value: v, ...detectarTipo(v) }))
})
</script>