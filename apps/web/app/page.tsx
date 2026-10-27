import { Dock } from "@/components/desktop/dock";

const barHeightClasses = [
  "h-[32%]",
  "h-[46%]",
  "h-[39%]",
  "h-[62%]",
  "h-[54%]",
  "h-[78%]",
  "h-[68%]",
  "h-[84%]",
  "h-[72%]",
  "h-[92%]",
  "h-[67%]",
  "h-[76%]",
];

export default function HomePage() {
  return (
    <main className="desktop-canvas dark relative h-dvh overflow-hidden bg-celestial-deep text-white">
      <div className="desktop-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="desktop-orbit desktop-orbit-one pointer-events-none absolute"
        aria-hidden="true"
      />
      <div
        className="desktop-orbit desktop-orbit-two pointer-events-none absolute"
        aria-hidden="true"
      />

      <div className="relative flex h-full min-w-0 flex-col pl-[88px]">
        <header className="flex items-center justify-between px-8 py-6 sm:px-12">
          <div className="flex items-center gap-3 text-sm text-white/55">
            <span className="size-2 rounded-full bg-celestial-mint shadow-[0_0_18px_var(--celestial-mint)]" />
            <span>壶天 · 我的桌面</span>
          </div>
          <div className="hidden items-center gap-3 text-xs text-white/35 sm:flex">
            <span>周二，十月二十七日</span>
            <span className="size-1 rounded-full bg-white/25" />
            <span>09:41</span>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col justify-between px-8 pb-8 sm:px-12 sm:pb-10">
          <div className="max-w-3xl pt-[8vh] sm:pt-[12vh]">
            <p className="mb-5 text-sm text-celestial-mint/75">
              欢迎回来，今天也把空间留给重要的事
            </p>
            <h1 className="text-[clamp(4.5rem,13vw,10rem)] font-light leading-[0.85] tracking-[0.12em] text-white/95">
              壶天
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/48 sm:text-lg">
              把常用的东西收进一块不大的地方。沿着左侧的应用栏，去坊市取回新的星子，或把眼前的桌面重新排成你喜欢的样子。
            </p>
          </div>

          <div className="grid max-w-4xl gap-3 sm:grid-cols-[1.1fr_0.9fr]">
            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-celestial-surface/65 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div
                className="absolute -right-12 -top-12 size-40 rounded-full bg-celestial-mint/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs text-white/35">桌面状态</p>
                  <p className="mt-2 text-xl font-medium text-white/90">一切安放妥当</p>
                </div>
                <span className="rounded-full border border-celestial-mint/20 bg-celestial-mint/10 px-2.5 py-1 text-xs text-celestial-mint">
                  安静运行
                </span>
              </div>
              <div
                className="relative mt-8 flex h-16 items-end gap-1.5"
                role="img"
                aria-label="空间使用率 68%"
              >
                {barHeightClasses.map((heightClass) => (
                  <span
                    key={heightClass}
                    className={`flex-1 rounded-full bg-white/[0.08] ${heightClass}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/35">
                <span>已收纳 12 颗星子</span>
                <span>空间使用 68%</span>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/[0.1] bg-white/[0.045] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">下一件事</p>
                <span className="text-xs text-celestial-gold/75">今天</span>
              </div>
              <p className="mt-5 text-lg leading-7 text-white/82">
                整理一下桌面，让思绪也有地方落脚。
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs text-white/38">
                <span className="size-2 rounded-full bg-celestial-gold" />
                <span>从左侧打开“星图”</span>
              </div>
            </section>
          </div>
        </section>
      </div>

      <Dock />
    </main>
  );
}
