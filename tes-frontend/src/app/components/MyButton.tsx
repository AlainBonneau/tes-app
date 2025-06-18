function MyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="bg-blood font-cinzel text-white py-4 px-6 rounded cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default MyButton;
