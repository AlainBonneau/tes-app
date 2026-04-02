type ProfileHeaderProps = {
  title: string;
};

export default function ProfileHeader({ title }: ProfileHeaderProps) {
  return (
    <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
        {title}
      </h1>
    </div>
  );
}
