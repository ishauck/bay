import { Button } from "@/components/ui/button";
import { steps } from "./lib";
import { useWelcomeStore } from "@/components/provider/welcome-store";

export default function WelcomeNavigation() {
    const { currentStep, maxStepAchieved, setCurrentStep, nextStep, isAllowedToContinue } = useWelcomeStore((state) => state);

    return (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
            {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < maxStepAchieved;
                const isNextStep = idx === currentStep + 1;
                const canNavigateTo = isCompleted || (isNextStep && isAllowedToContinue);

                return (
                    <Button
                        key={step.id}
                        variant="custom"
                        data-button-active={isActive}
                        data-button-completed={isCompleted}
                        onClick={() => {
                            if (canNavigateTo) {
                                setCurrentStep(idx);
                            } else if (isActive && isAllowedToContinue) {
                                nextStep();
                            }
                        }}
                        className={`
                            h-3 w-3 p-0 
                            data-[button-active=true]:px-4 
                            bg-foreground/10 
                            data-[button-active=true]:bg-foreground/90 
                            data-[button-completed=true]:bg-foreground/50
                            hover:bg-foreground/30 
                            rounded-full
                            transition-all duration-200
                            group
                        `}
                        disabled={!canNavigateTo && !isActive}
                    >
                        <div className="w-1 h-1 rounded-full hidden group-data-[button-completed=true]:block bg-foreground/30" />
                        <span className="sr-only">{step.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}