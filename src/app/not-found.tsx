import React from "react";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6">
        <Stethoscope className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground">404</h1>
      <p className="mt-2 text-lg font-semibold text-foreground">
        Page Not Found
      </p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The clinical record, patient file, or portal endpoint you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="default" className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
