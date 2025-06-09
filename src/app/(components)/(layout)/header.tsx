import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex items-center justify-between gap-3 h-20 p-4 border-b border-border">
      <Link href="/dashboard" className="relative w-20 h-20">
        <Image src="/logo-single.png" alt="logo" fill />
      </Link>
    </header>
  );
};
