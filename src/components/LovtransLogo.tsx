import Image from 'next/image';

type LovtransLogoProps = {
  className?: string;
};

const LovtransLogo: React.FC<LovtransLogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Lovtrans"
        width={32}
        height={32}
        className="h-full w-auto"
      />
      <span className="font-bold text-xl tracking-tight">LOVTRANS</span>
    </div>
  );
};

export { LovtransLogo };
