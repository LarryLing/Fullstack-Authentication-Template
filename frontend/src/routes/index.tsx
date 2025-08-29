import { createFileRoute } from "@tanstack/react-router";

import { EmailForm } from "@/features/auth/components/email-form";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <EmailForm />
    </div>
  );
}
