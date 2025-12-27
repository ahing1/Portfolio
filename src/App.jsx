import { motion } from "framer-motion";
import { Github, Linkedin, GraduationCap, Briefcase, Code2, Wrench, Rocket, Download } from "lucide-react";
import {ContactSection} from "./components/Contact.jsx";
import { useEffect, useState } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const Badge = ({ children }) => (
  <span className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 shadow-sm dark:border-zinc-700 dark:text-zinc-200">
    {children}
  </span>
);

const ProjectCard = ({ title, description, tags = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
    className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900
               transform transition-transform duration-200 hover:scale-[1.02]"
  >
    <div>
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
    </div>
  </motion.div>
);

const ExperienceTimeline = () => {
  const items = [
    {
      side: "left",
      icon: <GraduationCap className="h-5 w-5" />,
      title: "Stevens Institute of Technology | Student",
      subtitle: "Hoboken, NJ",
      description:
        "Currently studying Computer Science at Stevens Institute of Technology, I will graduate with my Master's in May 2026",
      period: "September 2025 - May 2026",
    },
    {
      side: "right",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Anote AI | Machine Learning Engineer",
      subtitle: "Las Vegas, NV",
      description:
        "Machine Learning Engineer for Anote AI participating in the Air Force's DASH 3 program for creating Battle COA's with the help of AI.",
      period: "September 2025 - October 2025",
    },
    {
      side: "left",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Granite Telecommunications | Software Engineering Intern",
      subtitle: "Quincy, MA",
      description:
        "Software Engineer Intern at Granite Telecommunications. Worked on the NOC Agent which automated telecom ticket processing and resulted in reducing intake time by 98%",
      period: "June 2025 - August 2025",
    },
    {
      side: "right",
      icon: <GraduationCap className="h-5 w-5" />,
      title: "Stevens Institute of Technology | Student",
      subtitle: "Hoboken, NJ",
      description:
        "Studied Computer Science at Stevens Institute of Technology, graduated with my Bachelor's in May 2025",
      period: "September 2021 - May 2025",
    },
    {
      side: "left",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Anote AI | Software Engineer",
      subtitle: "New York City, NY | Remote",
      description:
        "Software Engineer at Anote AI. Worked on developing core features for Anote's SDK, enabling their AI agents",
      period: "December 2024 - February 2025",
    },
    {
      side: "right",
      icon: <Briefcase className="h-5 w-5" />,
      title: "Stevens Institute of Technology | Course Assistant",
      subtitle: "Hoboken, NJ",
      description:
        "Assisted in teaching CS 546 Web Developement. Went over HTML, CSS, JavaScript, and MongoDB concepts with students. Held weekly office hours to help students with assignments and their project",
      period: "September 2024 - Present",
    },
    
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-2 sm:px-6 lg:px-8">
      {/* center line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />

      <ol className="relative">
        {items.map((item, idx) => (
          <li key={idx} className="group relative mb-16 grid grid-cols-9 items-center">
            {/* period label for md+ */}
            <div className={`col-span-4 ${item.side === "left" ? "order-1 pr-4 text-right" : "order-3 pl-4"}`}>
              <div className="hidden text-sm text-zinc-500 dark:text-zinc-400 md:block">{item.period}</div>
            </div>

            {/* icon */}
            <div className="order-2 col-span-1 flex justify-center">
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10" />
                <span className="relative text-zinc-700 dark:text-zinc-200">{item.icon}</span>
              </span>
            </div>

            {/* card */}
            <div className={`col-span-4 ${item.side === "left" ? "order-3 pl-4" : "order-1 pr-4 text-right"}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <h4 className="text-lg font-semibold tracking-tight">{item.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.subtitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{item.description}</p>
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 md:hidden">{item.period}</p>
              </motion.div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

const cx = (...c) => c.filter(Boolean).join(" ");

export default function App() {
  const [active, setActive] = useState("home");
  const HEADER_OFFSET = 96;

  useEffect(() => {
    const ids = sections.map(s => s.id);
    const getCurrent = () => {
      const scrollY = window.scrollY + HEADER_OFFSET + 1;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) current = id;
      }
      const doc = document.documentElement;
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 1;
      if (atBottom) current = ids[ids.length - 1];
      return current;
    };
    const update = () => setActive(getCurrent());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/70">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="text-lg font-semibold tracking-tight">Andrew Hing</a>
          <ul className="hidden gap-3 md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cx(
                    "rounded-full px-3 py-1 text-sm transition",
                    active === s.id
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="https://github.com/ahing1" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/andrew-hing21/" target="_blank" rel="noreferrer" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Home (Hero like screenshot) */}
        <section id="home" className="relative overflow-hidden scroll-mt-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,theme(colors.indigo.200/60),transparent_60%),radial-gradient(1200px_600px_at_120%_10%,theme(colors.rose.200/60),transparent_60%)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,theme(colors.indigo.900/40),transparent_60%),radial-gradient(1200px_600px_at_120%_10%,theme(colors.rose.900/40),transparent_60%)]" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-28">
            <img src="/profile2.jpg" alt="Andrew Hing" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-zinc-200 dark:border-zinc-900 dark:ring-zinc-700" />
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Hello, I'm <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Andrew</span>. I'm a <span className="font-extrabold">Software Engineer</span> currently pursuing a <span className="font-extrabold">Masters degree</span> in Computer Science at <span className="font-extrabold">Stevens Institute of Technology</span> and looking for full-time opportunities.
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="
                group inline-flex items-center justify-center rounded-full
                px-5 py-2 text-sm font-semibold
                transition-all duration-200 hover:scale-110
                bg-black !text-white hover:bg-zinc-800
                dark:bg-white dark:!text-black dark:hover:bg-zinc-200
              "
            >
              Contact
              <span className="ml-1 transition-colors duration-200 group-hover:text-blue-500">
                →
              </span>
            </a>
              <a
                href="/Andrew_Hing_Resume_1-26.pdf"
                download
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 shadow ring-1 ring-zinc-400 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-600 dark:hover:bg-zinc-800 transform transition-transform duration-200 hover:scale-110"
              >
                Download Resume
                <Download className="h-4 w-4 transition-colors duration-200 group-hover:text-blue-500" />
              </a>
              <div className="ml-1 inline-flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/andrew-hing21/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-zinc-400 hover:bg-[#0A66C2] hover:text-white dark:bg-zinc-900 dark:ring-zinc-600 transform transition-transform duration-200 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                
                <a
                  href="https://github.com/ahing1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-zinc-400 hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:ring-zinc-600 transform transition-transform duration-200 hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-4xl px-4 py-20 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold">About</h2>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            I first started in tech when I was kid where I would make and code robots out of legos. 
            This sparked my interest in programming and problem-solving, leading me to pursue a career in software development.
            I am currently a Masters student at Stevens Institute of Technology, where I am skilled in AI Agents and Full Stack Development.
            I am looking for full-time opportunities in Software Engineering or Machine Learning where I can apply my skills and continue to grow as a developer.
            The technologies I am most experienced with are Python, JavaScript, React, Node.js, FastAPI, LangChain, DSPy, PostgreSQL, and MongoDB.
          </p>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            Outside of coding, I love to workout and stay active. I like to do calisthenics where my goal is to unlock as many skills as possible.
            I love to eat and try new foods and I am always looking for new restaurants to try. I cook occasionally and enjoy experimenting with new recipes.
            I also really enjoy exploring new places and going on adventures. I was recently in Boston and had a great time exploring the city.
            Whenever I travel to somewhere new, I make it my mission to maximize my experience by trying local foods, visiting popular attractions, and immersing myself in the culture.
            Currently one of my interests is reading about Neuroscience. I find the brain to be fascinating and I love learning about how it works. This goes along with my love for learning where I try to be a little bit better every day or learn something new.
          </p>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
          <h2 className="mb-8 text-2xl font-bold">Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="NOC Agent"
              description="This was my intern project where I learned to take a project from an idea to production. An automation pipeline using LangGraph + DSPy, integrates Kafka, Postgres, and Cloud Tasks to reduce ticket processing time by 98%."
              tags={["Python", "LangGraph", "DSPy", "Kafka", "PostgreSQL", "Docker", "GCP"]}
            />
            <ProjectCard
              title="Prospra"
              description="This was my first attempt at a SaaS project for people trying to get into tech. A Next.js frontend, FastAPI backend with the ChatGPT API, Clerk for authentication, Stripe for billing. Dockerized and deployed on an AWS EC2 instance."
              tags={["Next.js", "FastAPI", "Clerk", "Stripe", "Docker", "AWS"]}
            />
            <ProjectCard
              title="Fraud Detector"
              description="This was my first personal project that I made from end-to-end. A React UI, Express API, Flask ML microservice hosting a Random Forest model. Dockerized and deployed on AWS EC2 behind Nginx."
              tags={["React", "Express", "Flask", "Docker", "AWS"]}
            />
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
          <h2 className="mb-8 text-2xl font-bold">Skills</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2"><Code2 className="h-5 w-5"/><h3 className="font-semibold">Languages</h3></div>
              <div className="flex flex-wrap gap-2 text-sm">
                {"Python Java JavaScript C/C++ SQL HTML CSS".split(" ").map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2"><Wrench className="h-5 w-5"/><h3 className="font-semibold">Frameworks & Tools</h3></div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["React","Tailwind", "LangChain", "Node.js", "Flask", "FastAPI", "DSPy", "Docker", "PostgreSQL", "MongoDB", "GCP", "AWS", "CI/CD", "Firebase"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2"><Briefcase className="h-5 w-5"/><h3 className="font-semibold">Focus Areas</h3></div>
              <div className="flex flex-wrap gap-2 text-sm">
                {["AI Agents & Multi-Agent Systems", "Full-Stack Development","Machine Learning and Model Deployment", "End-to-End Software Engineering"].map(s => <Badge key={s}>{s}</Badge>)}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
          <h2 className="mb-10 text-2xl font-bold">Experience</h2>
          <ExperienceTimeline />
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-3xl px-4 py-20 scroll-mt-24">
          <ContactSection />
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} Andrew Hing. Built with React & Tailwind.
      </footer>
    </div>
  );
}
