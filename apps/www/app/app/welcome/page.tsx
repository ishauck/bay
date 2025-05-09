'use client'

import { AnimatePresence, motion } from "motion/react"
import { useWelcomeStore, WelcomeStoreProvider } from "@/components/provider/welcome-store";
import { Fragment } from "react";
import WelcomeNavigation from "./navigation";
import useKeybind from "@/hooks/use-keybind";
import { steps } from "./lib";

function WelcomeSteps() {
  const { currentStep, nextStep, previousStep, isAllowedToContinue } = useWelcomeStore((state) => state);

  useKeybind("space", () => {
    if (isAllowedToContinue && currentStep < steps.length - 1) {
      nextStep();
    }
  });

  useKeybind("shift+space", () => {
    if (isAllowedToContinue && currentStep > 0) {
      previousStep();
    }
  });

  return (
    <div>
      <AnimatePresence mode="wait">
        {steps.map((step, idx) => (
          <Fragment key={step.id}>
            {idx === currentStep && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <step.component />
              </motion.div>
            )}
          </Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Welcome() {
  return (
    <WelcomeStoreProvider>
      <div className="relative w-screen h-screen flex flex-col justify-center items-center">
        <WelcomeSteps />
        <WelcomeNavigation />
      </div>
    </WelcomeStoreProvider>
  );
}
