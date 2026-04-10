import { useState, useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6FC8", "#FF9F1C", "#A855F7", "#00D4FF"];
const BALLOON_EMOJIS = ["🎈", "🎉", "🎊", "🥳", "🎁", "✨", "⭐", "🌟"];

function generateConfetti(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 6 + Math.random() * 10,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? "circle" : "rect",
    rotation: Math.random() * 360,
  }));
}

function generateBalloons(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 24 + Math.floor(Math.random() * 24),
    emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
  }));
}

const confettiPieces = generateConfetti(60);
const balloons = generateBalloons(12);

const BIRTHDAY = new Date("2026-07-15T18:00:00");

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTime({ days, hours, minutes, seconds });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Index() {
  const { days, hours, minutes, seconds } = useCountdown(BIRTHDAY);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg-gradient)", fontFamily: "'Montserrat', sans-serif" }}>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {confettiPieces.map((p) => (
          <div
            key={p.id}
            className="absolute confetti-fall"
            style={{
              left: `${p.x}%`,
              top: "-20px",
              width: p.shape === "circle" ? p.size : p.size * 0.6,
              height: p.size,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Floating balloons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {balloons.map((b) => (
          <div
            key={b.id}
            className="absolute balloon-float"
            style={{
              left: `${b.x}%`,
              bottom: "-80px",
              fontSize: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          >
            {b.emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-10 pb-20">

        {/* Header badge */}
        <div
          className="mb-6 px-6 py-2 rounded-full text-white text-sm font-bold tracking-widest uppercase shadow-lg"
          style={{
            background: "var(--accent-gradient)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.6s ease",
          }}
        >
          🎉 ТЫ ПРИГЛАШЁН!
        </div>

        {/* Hero */}
        <div
          className="text-center mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.85)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
          }}
        >
          <div className="text-7xl mb-4">🥳</div>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-3"
            style={{ fontFamily: "'Pacifico', cursive", color: "var(--title-color)", textShadow: "3px 3px 0 rgba(0,0,0,0.08)" }}
          >
            День Рождения
          </h1>
          <div
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: "var(--name-color)", textShadow: "2px 2px 0 rgba(0,0,0,0.07)" }}
          >
            Алексея! 🎂
          </div>
        </div>

        {/* Countdown */}
        <div
          className="w-full max-w-2xl mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.25s",
          }}
        >
          <div
            className="rounded-3xl p-6 text-center shadow-2xl"
            style={{ background: "var(--card-bg)", border: "3px solid var(--card-border)" }}
          >
            <div className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-text)" }}>
              ⏰ До праздника осталось
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: days, label: "Дней" },
                { val: hours, label: "Часов" },
                { val: minutes, label: "Минут" },
                { val: seconds, label: "Секунд" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className="w-full rounded-2xl py-4 px-2 mb-2 font-extrabold text-3xl md:text-4xl shadow-inner"
                    style={{ background: "var(--timer-bg)", color: "var(--timer-text)" }}
                  >
                    {String(val).padStart(2, "0")}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event details */}
        <div
          className="w-full max-w-2xl grid md:grid-cols-3 gap-4 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.4s",
          }}
        >
          {[
            { icon: "📅", label: "Дата", value: "15 июля 2026" },
            { icon: "⏰", label: "Время", value: "18:00" },
            { icon: "📍", label: "Место", value: "Ресторан «Панорама»\nул. Садовая, 15" },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-5 text-center shadow-lg"
              style={{ background: "var(--card-bg)", border: "2px solid var(--card-border)" }}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted-text)" }}>
                {label}
              </div>
              <div className="font-bold text-sm leading-tight whitespace-pre-line" style={{ color: "var(--card-text)" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          className="w-full max-w-2xl mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.5s",
          }}
        >
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{ background: "var(--card-bg)", border: "2px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎊</span>
              <span className="font-extrabold text-lg" style={{ color: "var(--card-text)" }}>О празднике</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--body-text)" }}>
              Приходи отметить вместе незабываемый вечер! Нас ждут живая музыка, вкусные угощения, весёлые конкурсы и тёплая атмосфера в кругу близких. Будет много смеха и ярких воспоминаний! ✨
            </p>
            <div
              className="mt-4 flex items-center gap-3 rounded-xl p-4"
              style={{ background: "var(--dresscode-bg)" }}
            >
              <span className="text-2xl">👗</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted-text)" }}>Дресс-код</div>
                <div className="font-bold" style={{ color: "var(--card-text)" }}>Праздничный / Smart Casual</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--body-text)" }}>Приветствуются яркие цвета!</div>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div
          className="w-full max-w-2xl mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.6s",
          }}
        >
          <div
            className="rounded-3xl p-6 shadow-2xl"
            style={{ background: "var(--card-bg)", border: "3px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📝</span>
              <span className="font-extrabold text-xl" style={{ color: "var(--card-text)" }}>Подтвердить участие</span>
            </div>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--muted-text)" }}>
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите ваше имя"
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                    style={{
                      background: "var(--input-bg)",
                      border: "2px solid var(--card-border)",
                      color: "var(--card-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--muted-text)" }}>
                    Количество гостей
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
                    style={{
                      background: "var(--input-bg)",
                      border: "2px solid var(--card-border)",
                      color: "var(--card-text)",
                    }}
                  >
                    {["1", "2", "3", "4", "5+"].map((n) => (
                      <option key={n} value={n}>{n} {n === "1" ? "гость" : "гостя"}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl py-4 font-extrabold text-base tracking-wide shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "var(--btn-gradient)",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  🎉 Я приду!
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎊</div>
                <div className="font-extrabold text-xl mb-1" style={{ color: "var(--card-text)" }}>
                  Отлично, {name}!
                </div>
                <div className="text-sm" style={{ color: "var(--body-text)" }}>
                  Ждём тебя! До встречи на празднике 🥳
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contacts */}
        <div
          className="w-full max-w-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.7s",
          }}
        >
          <div
            className="rounded-2xl p-6 shadow-lg text-center"
            style={{ background: "var(--card-bg)", border: "2px solid var(--card-border)" }}
          >
            <div className="font-extrabold text-sm uppercase tracking-widest mb-4" style={{ color: "var(--muted-text)" }}>
              📞 Контакты для вопросов
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="tel:+79001234567"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: "var(--contact-bg)", color: "var(--card-text)" }}
              >
                📱 +7 (900) 123-45-67
              </a>
              <a
                href="https://t.me/example"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: "var(--contact-bg)", color: "var(--card-text)" }}
              >
                ✈️ Telegram: @example
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
