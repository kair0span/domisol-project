import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { ListMusic } from "lucide-react";

export default function Header() {
  return (
    <header className="mx-auto flex h-full max-w-7xl p-3 items-center justify-between backdrop-blur-3xl sticky top-2 z-50 gap-6 px-4 sm:px-6 lg:px-8 rounded-4xl">
      <Link to="/" className="text-2xl font-bold flex items-center gap-2">
        <ListMusic />
        <span className=" text-[20px] font-semibold">Domisol</span>
      </Link>
      <nav className="flex gap-4">
        <ModeToggle />
        <Button>
         Login
        </Button>
      </nav>
    </header>
  );
}
