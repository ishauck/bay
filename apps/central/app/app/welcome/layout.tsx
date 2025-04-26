import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Bay",
  description: "Welcome to Bay",
};

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}