import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { JourneySection } from "@/components/JourneySection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ConnectSection } from "@/components/ConnectSection";
import { Chatbot } from "@/components/Chatbot";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <JourneySection />
      <ProjectsSection />
      <ConnectSection />
      <Chatbot />
    </main>
  );
}
