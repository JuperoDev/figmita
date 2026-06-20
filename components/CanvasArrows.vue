<script setup>
import { SCREEN_H } from '~/composables/useConstants.js'

const { arrows, totalCanvasW } = useCanvas()
</script>

<template>
  <svg
    v-if="arrows.length"
    :width="totalCanvasW"
    :height="SCREEN_H"
    style="position:absolute;top:0;left:0;pointer-events:none;overflow:visible;"
  >
    <defs>
      <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#7c5cfc" opacity=".7" />
      </marker>
    </defs>
    <path
      v-for="a in arrows"
      :key="a.id"
      :d="a.d"
      fill="none"
      stroke="#7c5cfc"
      stroke-width="2"
      stroke-dasharray="6 3"
      opacity=".5"
      marker-end="url(#arr)"
    />
  </svg>
</template>
