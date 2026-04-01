import HeroSection from "./components/home/HeroSection";
import BestiarySection from "./components/home/BestiarySection";
import PlacesSection from "./components/home/PlacesSection";
import TavernSection from "./components/home/TavernSection";
import LibrarySection from "./components/home/LibrarySection";

export default function Home() {
  return (
    <div className="app-container h-full w-full flex flex-col">
      <HeroSection />
      <BestiarySection />
      <PlacesSection />
      <TavernSection />
      <LibrarySection />
    </div>
  );
}
