import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type GenericAlertProps = {
  variant: "destructive" | "default";
  title: string;
  description: string;
};

export const GenericAlert = ({ variant, title, description }: GenericAlertProps) => {
  return (
    <Alert variant={variant}>
      {variant === "destructive" ? <AlertCircleIcon /> : <CheckCircle2Icon />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
