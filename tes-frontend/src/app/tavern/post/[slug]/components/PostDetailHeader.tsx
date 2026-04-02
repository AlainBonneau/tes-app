import Link from "next/link";

type PostDetailHeaderProps = {
  title: string;
};

export default function PostDetailHeader({ title }: PostDetailHeaderProps) {
  return (
    <>
      <div className="bg-blood h-[18vh] w-full flex items-center px-2 sm:px-8">
        <h1 className="text-2xl md:text-3xl font-uncial uppercase text-gold text-center flex-1 break-all">
          {title}
        </h1>
      </div>

      <div className="py-8 px-4">
        <Link
          href="/tavern"
          className="bg-blood text-gold px-4 py-2 rounded font-cinzel border border-gold hover:bg-blood/90 transition font-bold shadow cursor-pointer"
        >
          Retour à la taverne
        </Link>
      </div>
    </>
  );
}
