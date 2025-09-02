import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AuthAlertProps = {
  variant: "destructive" | "default";
  title: string;
  description: string;
};

export const AuthAlert = ({ variant, title, description }: AuthAlertProps) => {
  return (
    <Alert variant={variant}>
      {variant === "destructive" ? <AlertCircleIcon /> : <CheckCircle2Icon />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
