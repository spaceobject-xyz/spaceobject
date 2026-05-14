<script lang="ts">
import { onMount } from "svelte";

const steps = [
  { label: "User Request", icon: "👤" },
  { label: "402 Payment Required", icon: "🔒" },
  { label: "Pay with USDC", icon: "💳" },
  { label: "Receive Data", icon: "✅" },
];

let activeIndex = $state(0);
let isVisible = $state(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let el: HTMLElement;

const STEP_DURATION = 2000;

function advanceStep() {
  if (activeIndex < steps.length - 1) {
    activeIndex += 1;
    timeoutId = setTimeout(advanceStep, STEP_DURATION);
  }
}

onMount(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            isVisible = true;
            if (!reducedMotion.matches) {
              timeoutId = setTimeout(advanceStep, STEP_DURATION);
            } else {
              activeIndex = steps.length - 1;
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  } else {
    isVisible = true;
    if (!reducedMotion.matches) {
      timeoutId = setTimeout(advanceStep, STEP_DURATION);
    } else {
      activeIndex = steps.length - 1;
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }
});

function isActive(i: number) {
  return isVisible && activeIndex === i;
}

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
function isPast(i: number) {
  return isVisible && activeIndex > i;
}

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
function cardClasses(i: number) {
  const active = isActive(i);
  return `w-24 h-24 rounded-3xl flex items-center justify-center text-4xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-2 ${active ? "border-accent bg-accent/10 shadow-[0_0_32px_rgba(200,100,200,0.4)] scale-110" : "border-line bg-surface"}`;
}

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
function labelClasses(i: number) {
  return `font-mono text-xs tracking-[0.12em] uppercase text-center transition-colors duration-300 ${isActive(i) ? "text-heading" : "text-muted"}`;
}
</script>

<div bind:this={el} class="w-full">
  <!-- Desktop: horizontal -->
  <div class="hidden md:flex items-center justify-center gap-0 w-full">
    {#each steps as step, i}
      <div class="flex flex-col items-center gap-3 flex-1 max-w-[240px]">
        <div class={cardClasses(i)}>
          {step.icon}
        </div>
        <span class={labelClasses(i)}>
          {step.label}
        </span>
      </div>

      {#if i < steps.length - 1}
        <div class="flex-1 h-px relative max-w-[120px] mx-2">
          <div class="absolute inset-0 bg-line"></div>
          <div
            class="absolute inset-y-0 left-0 bg-accent transition-[width] duration-700 ease-out"
            style="width: {isPast(i) ? '100%' : isActive(i) ? '60%' : '0%'};"
          ></div>
          <div
            class="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent transition-all duration-500"
            class:opacity-100={isActive(i)}
            class:opacity-0={!isActive(i)}
            class:left-[60%]={isActive(i)}
            class:left-0={!isActive(i)}
          ></div>
        </div>
      {/if}
    {/each}
  </div>

  <!-- Mobile: vertical -->
  <div class="flex md:hidden flex-col items-center gap-0 w-full">
    {#each steps as step, i}
      <div class="flex flex-col items-center gap-2">
        <div class={cardClasses(i)}>
          {step.icon}
        </div>
        <span class={labelClasses(i)}>
          {step.label}
        </span>
      </div>

      {#if i < steps.length - 1}
        <div class="w-px h-10 relative my-1">
          <div class="absolute inset-0 bg-line"></div>
          <div
            class="absolute inset-x-0 top-0 bg-accent transition-[height] duration-700 ease-out"
            style="height: {isPast(i) ? '100%' : isActive(i) ? '60%' : '0%'};"
          ></div>
        </div>
      {/if}
    {/each}
  </div>
</div>
