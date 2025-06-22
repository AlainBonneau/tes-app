export default function Footer() {
  return (
    <footer className="h-[50vh] w-full bg-dark text-gold border-2 border-gold font-cinzel py-6 flex items-center justify-between px-4">
      <div className="about-container h-[30vh] w-[30%] flex flex-col justify-center text-center gap-8">
        <p className="font-bold">About</p>
        <p>A fan made site dedicated to the elder scrolls universe</p>
      </div>
      <div className="right-reserved h-[30vh] w-[30%] flex items-center justify-center px-4">
        <p className="text-sm md:text-base">
          <span className="font-bold">© {new Date().getFullYear()}</span> Tous droits réservés.
        </p>
      </div>
      <div className="privacy-container h-[30vh] w-[30%] flex items-center justify-center px-4">
        <p className="font-bold">Privacy Policy</p>
      </div>
    </footer>
  );
}
