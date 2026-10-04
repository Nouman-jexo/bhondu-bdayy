const PARAGRAPHS = [
  'First of all Happpppyyyyyyy Birthdaaaayyyyy Meraaaa Pyarrraaaaa Bachhhaaaawwwww😍, itna special din Meri Pyari Jaan kaa and I wish k kaash mei aaj apke paas hota taa k hum is special moment ko aik Sath celebrate kr pate😋 but khairrr koi baat ni',
  'Mera Pyar apko yahan se phonch rha hai aur daily basis par phonchta rahega mere pyare bachey💋.',
  "I love you more than yesterday and less than Tomorrow💗, My love for you increases every single day🎀. Umm everyday I wake up and I think how much lucky I am just to have u in mahh life Mera bachaw 😋. I can't even imagine my life without you. You are the missing piece of my life, the only missing piece to my heart, the only missing piece to complete me😍. YOU COMPLETE ME💋. I just want to say that always stay happy Meri Pyari Jaan❤️",
  'Apki Khushi mere liye Sabse Azeez hai is duniya mei, I would do anything just to make you smile Meri Jaan!!!💗💋',
  'You are the most precious thing in my life.🤍',
  "Your beauty is literally breathtaking to look at, you can look at me once and I'll forget everything around me.💝",
]

const LOVE_LINES = [
  'I love you💗',
  'I love every thing about you 🎀',
  'The way you care 😍',
  'The way you love 🤍',
  'The way you show your care for me 💞',
  'The way you put efforts for me, for this relationship, for US <3🎀',
]

const CLOSING = ['I', 'LOVE', 'YOU', 'MERA', 'BACHAW <3🎀']

export function LoveLetter() {
  return (
    <section aria-labelledby="letter-title" className="flex flex-col gap-5">
      <h2
        id="letter-title"
        className="text-balance px-2 text-center font-display text-[clamp(1.6rem,8vw,2.5rem)] leading-snug text-primary"
      >
        Mera Pyar Mere Pyare Insaan Ke Liye🎀
      </h2>

      <article
        className="relative overflow-hidden rounded-xl bg-[#f0e2cc] bg-cover bg-center px-5 py-7 text-[#5c3a1e] shadow-2xl shadow-black/40 ring-1 ring-[#c9a96e]/50 sm:px-10 sm:py-10"
        style={{ backgroundImage: "url('/images/vintage-paper.png')" }}
      >
        <div className="flex flex-col gap-4 text-pretty text-[15px] font-semibold leading-relaxed [overflow-wrap:anywhere] sm:text-base">
          {PARAGRAPHS.map((text) => (
            <p key={text}>{text}</p>
          ))}

          <ul className="flex flex-col gap-1 py-1">
            {LOVE_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <p className="font-bold uppercase tracking-wide">ALWAYS STAY HAPPY MERI JAAN💋</p>
          <p className="font-bold uppercase tracking-wide">
            AND REMEMBER THERE IS SOMEONE WHO ALWAYS PRAYS FOR YOUR HAPPINESS, YOUR WELLBEING AND YOU SUCCESS😋
          </p>

          <p className="flex flex-col pt-2 text-center font-display text-2xl leading-snug text-[#c04428]">
            {CLOSING.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </p>
        </div>
      </article>
    </section>
  )
}
