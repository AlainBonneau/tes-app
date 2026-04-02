type NewTopicHeaderProps = {
  title: string;
};

export default function NewTopicHeader({ title }: NewTopicHeaderProps) {
  return (
    <div className="bg-blood h-[18vh] w-full flex items-center justify-center mb-8">
      <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
        {title}
      </h1>
    </div>
  );
}
