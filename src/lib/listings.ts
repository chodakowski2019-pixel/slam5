export type Listing = {
  id: string;
  title: string;
  city: string;
  district: string;
  rooms: number;
  area: number; // m2
  price: number; // zl / mc
  availableFrom: string;
  image: string;
  tags: string[];
  matchScore: number; // 0-100, przyklad dopasowania do zalogowanego najemcy
  hasTour: boolean;
};

// Przykladowe oferty (placeholder). Docelowo z bazy Supabase: tabela `properties`.
export const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "war-mokotow-1",
    title: "Jasne 2 pokoje z balkonem",
    city: "Warszawa",
    district: "Mokotów",
    rooms: 2,
    area: 48,
    price: 3800,
    availableFrom: "Od zaraz",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    tags: ["Umeblowane", "Balkon", "Spacer 360°"],
    matchScore: 94,
    hasTour: true,
  },
  {
    id: "krk-podgorze-1",
    title: "Kawalerka po remoncie",
    city: "Kraków",
    district: "Podgórze",
    rooms: 1,
    area: 30,
    price: 2600,
    availableFrom: "Od 1 lipca",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    tags: ["Umeblowane", "Spacer 360°"],
    matchScore: 88,
    hasTour: true,
  },
  {
    id: "wro-krzyki-1",
    title: "Przestronne 3 pokoje dla rodziny",
    city: "Wrocław",
    district: "Krzyki",
    rooms: 3,
    area: 65,
    price: 3400,
    availableFrom: "Od zaraz",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    tags: ["Garaż", "Balkon"],
    matchScore: 81,
    hasTour: false,
  },
  {
    id: "gda-wrzeszcz-1",
    title: "2 pokoje blisko centrum",
    city: "Gdańsk",
    district: "Wrzeszcz",
    rooms: 2,
    area: 52,
    price: 3500,
    availableFrom: "Od 15 lipca",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Umeblowane", "Spacer 360°", "Winda"],
    matchScore: 76,
    hasTour: true,
  },
  {
    id: "poz-jezyce-1",
    title: "Stylowe 2 pokoje w kamienicy",
    city: "Poznań",
    district: "Jeżyce",
    rooms: 2,
    area: 45,
    price: 2700,
    availableFrom: "Od zaraz",
    image:
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Umeblowane", "Balkon"],
    matchScore: 72,
    hasTour: false,
  },
];

export function formatPrice(zl: number) {
  return zl.toLocaleString("pl-PL") + " zł/mc";
}
