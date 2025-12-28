import Image from 'next/image';

type LovtransIconProps = {
  className?: string;
};

const LovtransIcon: React.FC<LovtransIconProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Lovtrans"
      width={32}
      height={32}
      className={className}
    />
  );
};

export { LovtransIcon };
