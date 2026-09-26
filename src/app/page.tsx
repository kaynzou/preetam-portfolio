import { experience } from "@/data/profile";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { TreasureMap } from "@/components/experience/TreasureMap";
import { Projects } from "@/components/projects/Projects";
import { Connect, Footer } from "@/components/connect/Connect";
import { ChatBot } from "@/components/chat/ChatBot";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <TreasureMap stops={experience} />
      <Projects />
      <Connect />
      <Footer />
      <ChatBot />
    </main>
  );
}
