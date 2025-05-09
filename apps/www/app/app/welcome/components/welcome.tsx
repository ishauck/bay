import { Button } from "@/components/ui/button";
import { useWelcomeStore } from "@/components/provider/welcome-store";
import Logo from "@/components/logo";
export default function WelcomeStep() {
  const { nextStep } = useWelcomeStore((state) => state);

  return (
    <div className="flex flex-col items-center gap-4">
      <Logo className="w-12" />
      <h1 className="text-4xl font-bold text-center">Welcome</h1>
      <p className="text-sm text-muted-foreground text-center">
        Bay is a platform for creating and managing forms.
      </p>
      <Button onClick={nextStep} className="w-full">Continue</Button>
    </div>
  );
}