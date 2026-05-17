<script lang="ts">
import { onMount } from "svelte";

// biome-ignore lint/correctness/noUnusedImports: used in template
import background from "$lib/assets/background.webp";
// biome-ignore lint/correctness/noUnusedImports: used in template
import logo from "$lib/assets/logo.png";
// biome-ignore lint/correctness/noUnusedImports: used in template
import spaceVideo from "$lib/assets/Space.mp4";
// biome-ignore lint/correctness/noUnusedImports: used in template
import space from "$lib/assets/space.png";
// biome-ignore lint/correctness/noUnusedImports: used in template
import PaymentFlowGraphic from "$lib/components/PaymentFlowGraphic.svelte";
// biome-ignore lint/correctness/noUnusedImports: used in template
import RouterFlowGraphic from "$lib/components/RouterFlowGraphic.svelte";

const kw = (t: string) => `<span class="text-accent">${t}</span>`;
const str = (t: string) => `<span class="text-syntax-string">${t}</span>`;
const cls = (t: string) => `<span class="text-syntax-class">${t}</span>`;
const fn = (t: string) => `<span class="text-syntax-fn">${t}</span>`;
const mut = (t: string) => `<span class="text-muted">${t}</span>`;

// biome-ignore lint/correctness/noUnusedVariables: used in template
const x402Code = [
  mut(
    `${kw("import")} { paymentMiddleware, x402ResourceServer } ${kw("from")} ${str('"@x402/hono"')};\n${kw("import")} { HTTPFacilitatorClient } ${kw("from")} ${str('"@x402/core/server"')};\n${kw("import")} { ExactEvmScheme } ${kw("from")} ${str('"@heraldprotocol/x402/server"')};`
  ),
  "",
  `${kw("const")} facilitator = ${kw("new")} ${cls("HTTPFacilitatorClient")}({`,
  `  url: ${str('"https://facilitator.heraldprotocol.xyz"')},`,
  "});",
  "",
  `app.${fn("use")}(${fn("paymentMiddleware")}({`,
  `  ${str('"GET /weather"')}: {`,
  "    accepts: [{",
  `      scheme: ${str('"exact"')},`,
  `      price: ${str('"$0.001"')},`,
  `      network: ${str('"eip155:16661"')},`,
  `      payTo: ${str('"0x..."')},`,
  "    }],",
  "  },",
  `}, ${kw("new")} ${cls("x402ResourceServer")}(facilitator)`,
  `  .${fn("register")}(${str('"eip155:16661"')}, ${kw("new")} ${cls("ExactEvmScheme")}())));`,
].join("\n");

// biome-ignore lint/correctness/noUnusedVariables: used in template
const mppCode = [
  mut(
    `${kw("import")} { zerog } ${kw("from")} ${str('"@heraldprotocol/mpp/server"')};\n${kw("import")} { Mppx } ${kw("from")} ${str('"mppx/hono"')};`
  ),
  "",
  `${kw("const")} mppx = ${cls("Mppx")}.${fn("create")}({`,
  `  methods: [${fn("zerog")}({ recipient: account.address, account })],`,
  "});",
  "",
  `app.${fn("get")}(`,
  `  ${str('"/weather"')},`,
  `  mppx.${fn("charge")}({ amount: ${str('"0.001"')} }),`,
  `  (c) =&gt; c.${fn("json")}({ weather: ${str('"sunny"')} })`,
  ");",
].join("\n");

// biome-ignore lint/correctness/noUnusedVariables: used in template
const routerCode = [
  mut(
    `${kw("import")} { x402Client } ${kw("from")} ${str('"@x402/core/client"')};\n${kw("import")} { ExactEvmScheme } ${kw("from")} ${str('"@x402/evm/exact/client"')};\n${kw("import")} { wrapFetchWithPayment } ${kw("from")} ${str('"@x402/fetch"')};`
  ),
  "",
  `${kw("const")} client = ${kw("new")} ${cls("x402Client")}();`,
  `client.${fn("register")}(${str('"eip155:16661"')}, ${kw("new")} ${cls("ExactEvmScheme")}(signer));`,
  "",
  `${kw("const")} fetchWithPayment = ${fn("wrapFetchWithPayment")}(fetch, client);`,
  "",
  `${kw("const")} url = ${str('"https://router.heraldprotocol.xyz/route/x402?url="')} + dest;`,
  `${kw("await")} ${fn("fetchWithPayment")}(url);`,
].join("\n");

onMount(() => {
  const bg = document.querySelector<HTMLElement>("[data-bg-layer]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMq = window.matchMedia("(min-width: 768px)");
  let ticking = false;

  function update() {
    if (!bg) return;

    if (reducedMotion.matches || !desktopMq.matches) {
      bg.style.backgroundPosition = "center 30%";
      ticking = false;
      return;
    }

    bg.style.backgroundPosition = `center calc(20% - ${window.scrollY * 0.2}px)`;
    ticking = false;
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  const els = document.querySelectorAll("[data-enter]");
  let io: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25% 0px" }
    );
    els.forEach((el) => {
      io?.observe(el);
    });
  } else {
    els.forEach((el) => {
      el.classList.add("is-in");
    });
  }

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
    io?.disconnect();
  };
});
</script>

<svelte:head>
  <title>Herald Protocol — Payment Infrastructure for AI Agents</title>
  <meta
    name="description"
    content="The infrastructure layer for autonomous agent economics. x402 facilitator and cross-chain payment router on 0G Chain."
  />

  <!-- OpenGraph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://heraldprotocol.xyz" />
  <meta property="og:site_name" content="Herald Protocol" />
  <meta
    property="og:title"
    content="Herald Protocol — Payment Infrastructure for AI Agents"
  />
  <meta
    property="og:description"
    content="The infrastructure layer for autonomous agent economics. x402 facilitator and cross-chain payment router on 0G Chain."
  />
  <meta property="og:image" content="https://heraldprotocol.xyz/banner.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Herald Protocol — Payment Infrastructure for AI Agents"
  />
  <meta
    name="twitter:description"
    content="The infrastructure layer for autonomous agent economics. x402 facilitator and cross-chain payment router on 0G Chain."
  />
  <meta name="twitter:image" content="https://heraldprotocol.xyz/banner.jpg" />
  <meta name="twitter:image:width" content="1200" />
  <meta name="twitter:image:height" content="630" />
</svelte:head>

<div
  data-bg-layer
  aria-hidden="true"
  class="fixed inset-0 -z-10 bg-no-repeat brightness-[0.2] will-change-[background-position] bg-cover bg-center"
  style="background-image: url({background});"
></div>

<header
  data-enter
  class="relative z-2 flex items-center justify-between px-6 py-5 md:py-7 md:px-[clamp(1.5rem,8vw,8rem)] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
>
  <a
    href="/"
    aria-label="Herald Protocol"
    class="inline-flex items-center gap-[0.65rem] no-underline"
  >
    <img
      class="block w-9 h-9 md:w-16 md:h-16 [image-rendering:pixelated]"
      src={logo}
      alt=""
    />
    <span
      class="font-mono font-black md:text-xl tracking-[0.18em] uppercase text-heading"
      >Herald Pr0t0c0l</span
    >
  </a>
  <a
    href="https://docs.heraldprotocol.xyz/"
    target="_blank"
    rel="noopener"
    class="font-sans font-medium text-xs tracking-[0.15em] uppercase text-muted no-underline transition-[color,opacity] duration-120 ease-out hover:text-heading active:opacity-50 focus-visible:outline-2 focus-visible:outline-line focus-visible:outline-offset-[3px] focus-visible:rounded-[1px]"
    >Docs ↗</a
  >
</header>

<section
  data-screen-label="01 Hero"
  class="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] px-6 md:px-[clamp(1.5rem,8vw,8rem)] flex flex-col relative"
>
  <div
    aria-hidden="true"
    class="flex-[0_1_22vh] md:flex-[0_1_15vh] min-h-10"
  ></div>

  <div
    data-enter
    class="flex-none pb-9 max-w-300 opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
  >
    <div class="flex items-center gap-[0.9rem] mb-[1.6rem]">
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Live on mainnet</span
      >
      <span aria-hidden="true" class="block w-7 h-px bg-line"></span>
    </div>

    <h1
      class="m-0 mb-[1.6rem] font-mono font-bold text-[clamp(2.6rem,11vw,4.5rem)] md:text-[clamp(4rem,8vw,9rem)] leading-[0.98] tracking-[-0.02em] uppercase text-heading"
    >
      Payment infrastructure<br />
      for <span class="text-accent">AI&nbsp;agents</span>
    </h1>
  </div>

  <div
    data-enter
    aria-hidden="true"
    class="flex justify-between gap-8 flex-wrap mt-4 mb-8 opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
  >
    <span
      class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >x402</span
    >
    <span
      class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >0G</span
    >
  </div>
</section>

<!-- Section 02: How Agent Payment Works -->
<section
  data-screen-label="02 How Agent Payment Works"
  class="py-[clamp(8rem,14vh,14rem)] px-6 md:px-[clamp(1.5rem,8vw,8rem)]"
>
  <div class="max-w-350 mx-auto">
    <div
      data-enter
      class="flex flex-col gap-5 mb-[clamp(4rem,8vh,6rem)] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Protocol</span
      >
      <h2
        class="m-0 font-mono font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.015em] uppercase text-heading"
      >
        How agent payment works
      </h2>
      <p
        class="m-0 font-sans font-normal text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.75] text-fg max-w-[55ch]"
      >
        Any API or service returns a 402 Payment Required status. The client
        pays with USDC or any ERC20 token on 0G Chain.
      </p>
    </div>

    <div
      data-enter
      class="opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <PaymentFlowGraphic />
    </div>
  </div>
</section>

<!-- Section 03: How the Router Works -->
<section
  data-screen-label="03 How the Router Works"
  class="py-[clamp(8rem,14vh,14rem)] px-6 md:px-[clamp(1.5rem,8vw,8rem)]"
>
  <div class="max-w-350 mx-auto">
    <div
      data-enter
      class="flex flex-col gap-5 mb-[clamp(4rem,8vh,6rem)] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Routing</span
      >
      <h2
        class="m-0 font-mono font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.015em] uppercase text-heading"
      >
        How the router works
      </h2>
      <p
        class="m-0 font-sans font-normal text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.75] text-fg max-w-[55ch]"
      >
        The router proxies requests to any protected service. When it receives a
        402, it maps payment requirements to every supported network and rail —
        from 0G to another EVM chains, Solana, Stellar, Tempo, Stripe, and
        beyond.
      </p>
    </div>

    <div
      data-enter
      class="opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <RouterFlowGraphic />
    </div>
  </div>
</section>

<section
  data-screen-label="04 Start Building"
  class="bg-surface px-6 md:px-[clamp(1.5rem,8vw,8rem)] pt-[clamp(5rem,10vh,9rem)] mt-[clamp(6rem,10vh,10rem)]"
>
  <div
    class="flex flex-col gap-[clamp(2.5rem,6vw,6rem)] items-stretch max-w-350 mx-auto pb-[clamp(4rem,8vh,7rem)]"
  >
    <div
      data-enter
      class="flex flex-col gap-5 items-center text-center opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Integration</span
      >
      <h2
        class="m-0 font-mono font-bold text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.01em] uppercase text-heading"
      >
        Start building
      </h2>
    </div>

    <div class="flex flex-col gap-[clamp(3rem,7vw,5.5rem)]">
      <article
        data-enter
        class="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-[clamp(2rem,4vw,4rem)] items-start opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <div class="flex flex-col gap-4 items-end w-full">
          <h3
            class="text-right font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
          >
            x402
          </h3>
          <p
            class="text-right font-sans text-[0.95rem] leading-[1.6] text-fg max-w-[34ch]"
          >
            Add the Herald facilitator to your server. Charge per request, per
            call, per artifact. Works with any x402 client. Settles on 0G in any
            ERC20 token.
          </p>
          <a
            href="https://docs.heraldprotocol.xyz/x402/quickstart-for-sellers"
            target="_blank"
            rel="noopener"
            class="group mt-[0.4rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out inline-flex items-center gap-[0.6rem] self-end hover:opacity-70 active:opacity-50"
          >
            <span
              class="font-mono text-muted transition-[translate,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.75 group-hover:text-heading"
              >→</span
            >
            Quickstart for sellers
          </a>
        </div>
        <div class="border border-line bg-base/60">
          <div
            class="flex items-center justify-between border-b border-line px-3 py-1.5"
          >
            <span class="font-mono text-[0.65rem] tracking-[0.12em] text-muted"
              >server.ts</span
            >
            <span
              class="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted"
              >TypeScript</span
            >
          </div>
          <pre
            class="overflow-x-auto p-4 font-mono text-[0.72rem] leading-[1.65] text-fg whitespace-pre m-0">{@html x402Code}</pre>
        </div>
      </article>

      <article
        data-enter
        class="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-[clamp(2rem,4vw,4rem)] items-start opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <div class="flex flex-col gap-4 md:order-2">
          <h3
            class="font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
          >
            MPP
          </h3>
          <p
            class="font-sans text-[0.95rem] leading-[1.6] text-fg max-w-[34ch]"
          >
            Add MPP payment requirements to your server. Charge per request, per
            call, per artifact. Works with any MPP client. Settles directly
            on-chain — verify and broadcast payments yourself, no facilitator
            required.
          </p>
          <a
            href="https://docs.heraldprotocol.xyz/mpp/quickstart-for-sellers"
            target="_blank"
            rel="noopener"
            class="group mt-[0.4rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out inline-flex items-center gap-[0.6rem] self-start hover:opacity-70 active:opacity-50"
          >
            <span
              class="font-mono text-muted transition-[translate,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.75 group-hover:text-heading"
              >→</span
            >
            Quickstart for sellers
          </a>
        </div>
        <div class="border border-line bg-base/60 md:order-1">
          <div
            class="flex items-center justify-between border-b border-line px-3 py-1.5"
          >
            <span class="font-mono text-[0.65rem] tracking-[0.12em] text-muted"
              >server.ts</span
            >
            <span
              class="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted"
              >TypeScript</span
            >
          </div>
          <pre
            class="overflow-x-auto p-4 font-mono text-[0.72rem] leading-[1.65] text-fg whitespace-pre m-0">{@html mppCode}</pre>
        </div>
      </article>

      <article
        data-enter
        class="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-[clamp(2rem,4vw,4rem)] items-start opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
      >
        <div class="flex flex-col gap-4 items-end w-full">
          <h3
            class="text-right font-mono font-bold uppercase text-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
          >
            Router
          </h3>
          <p
            class="text-right font-sans text-[0.95rem] leading-[1.6] text-fg max-w-[34ch]"
          >
            Pay any protected service (HTTP 402) from anywhere without bridging.
            The router accepts payment on 0G and forwards on the destination
            server or chain. MPP routing coming soon — settle on blockchain,
            Tempo, Stripe, card, or other fiat rails.
          </p>
          <a
            href="https://docs.heraldprotocol.xyz/router/overview"
            target="_blank"
            rel="noopener"
            class="group mt-[0.4rem] font-mono font-medium text-[0.85rem] text-heading no-underline tracking-[0.02em] transition-opacity duration-120 ease-out inline-flex items-center gap-[0.6rem] self-end hover:opacity-70 active:opacity-50"
          >
            <span
              class="font-mono text-muted transition-[translate,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.75 group-hover:text-heading"
              >→</span
            >
            Overview
          </a>
        </div>
        <div class="border border-line bg-base/60">
          <div
            class="flex items-center justify-between border-b border-line px-3 py-1.5"
          >
            <span class="font-mono text-[0.65rem] tracking-[0.12em] text-muted"
              >client.ts</span
            >
            <span
              class="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-muted"
              >TypeScript</span
            >
          </div>
          <pre
            class="overflow-x-auto p-4 font-mono text-[0.72rem] leading-[1.65] text-fg whitespace-pre m-0">{@html routerCode}</pre>
        </div>
      </article>
    </div>
  </div>
</section>

<section
  data-screen-label="05 Agentic Economy"
  class="relative w-full h-[calc(100vh-4.5rem)] overflow-hidden"
>
  <video
    aria-hidden="true"
    autoplay
    muted
    loop
    playsinline
    poster={space}
    class="absolute inset-0 w-full h-full object-cover brightness-[0.2]"
  >
    <source src={spaceVideo} type="video/mp4" />
  </video>

  <div
    class="relative z-10 h-full max-w-350 mx-auto px-6 md:px-[clamp(1.5rem,8vw,8rem)] flex flex-col items-center justify-center text-center"
  >
    <div
      data-enter
      class="flex items-center gap-[0.9rem] mb-[1.6rem] opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      <span aria-hidden="true" class="block w-7 h-px bg-line"></span>
      <span
        class="font-mono font-medium text-xs tracking-[0.15em] uppercase text-muted leading-[1.4]"
        >Now live on 0G</span
      >
      <span aria-hidden="true" class="block w-7 h-px bg-line"></span>
    </div>

    <h2
      data-enter
      class="m-0 font-mono font-bold text-[clamp(1.69rem,7.15vw,2.93rem)] md:text-[clamp(2.6rem,5.2vw,5.85rem)] leading-[1.05] tracking-[-0.02em] uppercase text-heading opacity-0 translate-y-2 transition-[opacity,translate] duration-420 ease-[cubic-bezier(0.23,1,0.32,1)] delay-120 will-change-[opacity,translate] [&.is-in]:opacity-100 [&.is-in]:translate-y-0 motion-reduce:translate-none"
    >
      Agents <span class="text-accent">transact</span>.<br />
      Capital <span class="text-accent">moves</span>.
    </h2>
  </div>
</section>

<div class="px-6">
  <footer
    class="border-t border-line pt-[1.4rem] pb-[1.6rem] flex justify-between items-center gap-2 md:gap-6 flex-wrap"
  >
    <span
      class="font-mono font-medium text-[0.7rem] tracking-[0.15em] uppercase text-muted leading-[1.4]"
      >© 2026 — Herald Protocol</span
    >
    <a
      href="https://docs.heraldprotocol.xyz/"
      target="_blank"
      rel="noopener"
      class="text-muted no-underline transition-[color,opacity] duration-120 ease-out font-sans font-medium text-[0.7rem] tracking-[0.15em] uppercase hover:text-heading active:opacity-50"
      >Docs ↗</a
    >
  </footer>
</div>
