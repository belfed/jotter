import { CaptureForm } from "@/components/inbox/capture-form";

export default function CapturePage() {
  return (
    <main className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CaptureForm />
      </div>
    </main>
  );
}
