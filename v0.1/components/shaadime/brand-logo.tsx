import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      alt="ShaadiMe logo"
      className={className}
      height={500}
      priority={priority}
      src="/ShaadiMe_Logo.png"
      width={500}
    />
  );
}
