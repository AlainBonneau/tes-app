type CreateRegionHeaderProps = {
  title: string;
};

export default function CreateRegionHeader({ title }: CreateRegionHeaderProps) {
  return (
    <div className="bg-blood h-[20vh] w-full flex items-center justify-center mb-10">
      <h1 className="text-2xl md:text-4xl font-uncial uppercase text-gold text-center">
        {title}
      </h1>
    </div>
  );
}
