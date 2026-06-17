import { Bug, Droplets, ShieldCheck } from "lucide-react";

export type FisStatus = "Optimal" | "Warning" | "Critical";

export const FIS_CARDS: Array<{
  title: string;
  value: number;
  status: FisStatus;
  body: string;
  icon: React.ElementType;
}> = [
  { title: "Pest Analysis", value: 0, status: "Optimal", body: "", icon: Bug },
  {
    title: "Fungal Activity",
    value: 0,
    status: "Optimal",
    body: "",
    icon: ShieldCheck,
  },
  {
    title: "Irrigation Analysis",
    value: 0,
    status: "Optimal",
    body: "",
    icon: Droplets,
  },
];
