import { experience } from "@/data/profile";
import { MotionProvider, ScrollProgress } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { TreasureMap } from "@/components/experience/TreasureMap";
import { Projects } from "@/components/projects/Projects";
import { Connect, Footer } from "@/components/connect/Connect";
import { ChatBot } from "@/components/chat/ChatBot";

export default function Home() {
  return (
    <MotionProvider>
      <main>
        <ScrollProgress />
        <Navbar hasExperience={experience.length > 0} />
        <Hero />
        <About />
        {experience.length > 0 && <TreasureMap stops={experience} />}
        <Projects />
        <Connect />
        <Footer />
        <ChatBot />
      </main>
    </MotionProvider>
  );
}
