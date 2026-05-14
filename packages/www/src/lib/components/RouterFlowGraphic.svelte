<script lang="ts">
import { onMount } from "svelte";

const mainSteps = [
  { label: "User Request", icon: "👤" },
  { label: "Router Proxies", icon: "🔀" },
  { label: "402 + Map Networks", icon: "🌐" },
  { label: "Pay & Forward", icon: "💸" },
  { label: "Receive Data", icon: "✅" },
];

const destinations = [
  "Base",
  "Arbitrum",
  "Solana",
  "Stellar",
  "Tempo",
  "Stripe",
  "Card",
];

let activeIndex = $state(0);
let isVisible = $state(false);
let hasFinished = $state(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let el: HTMLElement;

const STEP_DURATION = 1600;

function advanceStep() {
  if (activeIndex < mainSteps.length - 1) {
    activeIndex += 1;
    timeoutId = setTimeout(advanceStep, STEP_DURATION);
  } else {
    hasFinished = true;
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
              activeIndex = mainSteps.length - 1;
              hasFinished = true;
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
      activeIndex = mainSteps.length - 1;
      hasFinished = true;
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }
});

function isActive(i: number) {
  return isVisible && activeIndex === i;
}

function isPast(i: number) {
  return isVisible && activeIndex > i;
}

function showDestinations() {
  return isVisible && activeIndex >= 2;
}

function cardClasses(i: number) {
  const active = isActive(i);
  return `w-24 h-24 rounded-3xl flex items-center justify-center text-4xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-2 ${active ? "border-accent bg-accent/10 shadow-[0_0_32px_rgba(200,100,200,0.4)] scale-110" : "border-line bg-surface"}`;
}

function mobileCardClasses(i: number) {
  const active = isActive(i);
  return `w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-2 ${active ? "border-accent bg-accent/10 shadow-[0_0_24px_rgba(200,100,200,0.35)] scale-110" : "border-line bg-surface"}`;
}

function labelClasses(i: number) {
  return `font-mono text-xs tracking-[0.12em] uppercase text-center transition-colors duration-300 ${isActive(i) ? "text-heading" : "text-muted"}`;
}

function destClasses() {
  const active = isActive(2);
  return `px-3 py-1.5 rounded-full border font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-all duration-400 ${active ? "border-accent bg-accent/10 text-heading" : "border-line bg-surface text-muted"}`;
}

function mobileDestClasses() {
  const active = isActive(2) || isPast(2);
  return `px-2.5 py-1 rounded-full border font-mono text-[0.65rem] tracking-[0.08em] uppercase ${active ? "border-accent bg-accent/10 text-heading" : "border-line bg-surface text-muted"}`;
}
</script>

<div bind:this={el} class="w-full">
  <!-- Desktop: horizontal with branching -->
  <div class="hidden md:flex flex-col items-center w-full gap-6">
    <!-- Main flow line -->
    <div class="flex items-center justify-center gap-0 w-full">
      {#each mainSteps as step, i}
        <div class="flex flex-col items-center gap-3 flex-1 max-w-[180px]">
          <div class={cardClasses(i)}>
            {step.icon}
          </div>
          <span class={labelClasses(i)}>
            {step.label}
          </span>
        </div>

        {#if i < mainSteps.length - 1}
          <div class="flex-1 h-px relative max-w-[100px] mx-2">
            <div class="absolute inset-0 bg-line"></div>
            <div
              class="absolute inset-y-0 left-0 bg-accent transition-[width] duration-600 ease-out"
              style="width: {isPast(i) ? '100%' : isActive(i) ? '50%' : '0%'};"
            ></div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Branching destinations -->
    <div class="relative w-full flex justify-center">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-accent transition-[height] duration-500 ease-out"
        style="height: {showDestinations() ? '24px' : '0px'};"
      ></div>

      <div
        class="flex flex-wrap justify-center gap-2 mt-6 transition-all duration-500"
        class:opacity-0={!showDestinations()}
        class:opacity-100={showDestinations()}
        class:translate-y-2={!showDestinations()}
        class:translate-y-0={showDestinations()}
      >
        {#each destinations as dest, i}
          <div class={destClasses()} style="transition-delay: {i * 60}ms;">
            {dest}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Mobile: vertical with branching -->
  <div class="flex md:hidden flex-col items-center w-full gap-0">
    {#each mainSteps as step, i}
      <div class="flex flex-col items-center gap-2">
        <div class={mobileCardClasses(i)}>
          {step.icon}
        </div>
        <span class={labelClasses(i)}>
          {step.label}
        </span>
      </div>

      {#if i === 2}
        <div class="w-px h-6 relative my-1">
          <div class="absolute inset-0 bg-line"></div>
          <div
            class="absolute inset-x-0 top-0 bg-accent transition-[height] duration-500 ease-out"
            style="height: {isPast(i) || hasFinished
              ? '100%'
              : isActive(i)
                ? '50%'
                : '0%'};"
          ></div>
        </div>

        <div class="flex flex-wrap justify-center gap-1.5 my-2 max-w-[280px]">
          {#each destinations as dest}
            <div class={mobileDestClasses()}>
              {dest}
            </div>
          {/each}
        </div>

        <div class="w-px h-6 relative my-1">
          <div class="absolute inset-0 bg-line"></div>
          <div
            class="absolute inset-x-0 top-0 bg-accent transition-[height] duration-500 ease-out"
            style="height: {isPast(i) ? '100%' : '0%'};"
          ></div>
        </div>
      {:else if i < mainSteps.length - 1 && i !== 2}
        <div class="w-px h-8 relative my-1">
          <div class="absolute inset-0 bg-line"></div>
          <div
            class="absolute inset-x-0 top-0 bg-accent transition-[height] duration-600 ease-out"
            style="height: {isPast(i) ? '100%' : isActive(i) ? '50%' : '0%'};"
          ></div>
        </div>
      {/if}
    {/each}
  </div>
</div>
