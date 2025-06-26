import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  actions?: React.ReactNode
}

export const Header = ({ actions }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between gap-3 h-20 p-4 border-b border-border">
      <Link href="/dashboard" className="relative w-20 h-20">
        <Image src="/logo-single.png" alt="logo" fill />
      </Link>
      {actions && (
        <div className="flex items-center gap-3 w-fit">
          {actions}
        </div>
      )}
    </header>
  );
};
