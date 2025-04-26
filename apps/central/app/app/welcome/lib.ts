import WelcomeStep from "./components/welcome";
import WorkspaceCreator from "./components/workspace-creator";

type Step = {
  id: string;
  label: string;
  isAllowedToContinue: boolean;
  component: React.FC;
};

export const steps: Step[] = [
  {
    id: "welcome",
    label: "Welcome",
    component: WelcomeStep,
    isAllowedToContinue: true,
  },
  {
    id: "workspace-creator",
    label: "Workspace Creator",
    component: WorkspaceCreator,
    isAllowedToContinue: false,
  },
];
