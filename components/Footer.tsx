import { person } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mono flex flex-wrap justify-between gap-3 px-1 text-ash">
      <span>
        © {new Date().getFullYear()} {person.name.toLowerCase()}
      </span>
    </footer>
  );
}
