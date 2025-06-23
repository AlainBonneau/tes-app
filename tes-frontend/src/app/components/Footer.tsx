"use client";

export default function Footer() {
  return (
    <footer className="w-full h-[50vh] bg-dark text-gold border-t-2 border-gold font-cinzel py-6 px-4">
      <div className=" mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-0">
        {/* About */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-center gap-2 mb-4 md:mb-0">
          <p className="font-bold">About</p>
          <p className="text-sm">
            A fan made site dedicated to the Elder Scrolls universe
          </p>
        </div>
        {/* Copyright */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-center">
          <p className="text-sm md:text-base">
            <span className="font-bold">© {new Date().getFullYear()}</span> Tous
            droits réservés.
          </p>
        </div>
        {/* Privacy */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-center gap-2 mt-4 md:mt-0">
          <p className="font-bold">Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
