import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormTemplateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: "primary" | "secondary" | "accent" | "blue" | "green" | "red" | "yellow" | "purple" | "pink" | "indigo" | "orange";
  href?: string;
  onClick?: () => void;
}

export function FormTemplateCard({
  icon: Icon,
  title,
  description,
  iconColor = "primary",
  href,
  onClick,
}: FormTemplateCardProps) {
  const content = (
    <>
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-md mb-2",
        {
          "bg-primary/10": iconColor === "primary",
          "bg-secondary/10": iconColor === "secondary",
          "bg-accent/10": iconColor === "accent",
          "bg-blue-500/10": iconColor === "blue",
          "bg-green-500/10": iconColor === "green",
          "bg-red-500/10": iconColor === "red",
          "bg-yellow-500/10": iconColor === "yellow",
          "bg-purple-500/10": iconColor === "purple",
          "bg-pink-500/10": iconColor === "pink",
          "bg-indigo-500/10": iconColor === "indigo",
          "bg-orange-500/10": iconColor === "orange",
        }
      )}>
        <Icon className={cn("w-5 h-5", {
          "text-primary": iconColor === "primary",
          "text-secondary": iconColor === "secondary",
          "text-accent": iconColor === "accent",
          "text-blue-500": iconColor === "blue",
          "text-green-500": iconColor === "green",
          "text-red-500": iconColor === "red",
          "text-yellow-500": iconColor === "yellow",
          "text-purple-500": iconColor === "purple",
          "text-pink-500": iconColor === "pink",
          "text-indigo-500": iconColor === "indigo",
          "text-orange-500": iconColor === "orange",
        })} />
      </div>
      <div className="font-medium text-base">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </>
  );

  const className = "group p-4 bg-card border rounded-xl flex flex-col items-start gap-2 cursor-pointer hover:border-primary dark:hover:border-primary/50 transition-all h-[160px]";

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {content}
    </div>
  );
} 