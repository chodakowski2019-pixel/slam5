import { redirect } from "next/navigation";

// LP najmu jest teraz strona glowna (/). Stary URL przekierowujemy.
export default function WynajmujacyPage() {
  redirect("/");
}
