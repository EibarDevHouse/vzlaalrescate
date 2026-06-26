"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Busca por nombre, cédula o descripción..." }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        router.push(`?q=${encodeURIComponent(query)}`);
      } else {
        router.push("?");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search className="w-5 h-5" />}
        className="text-base sm:text-lg"
      />
    </div>
  );
}
