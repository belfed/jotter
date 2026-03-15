import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jotter — Capture",
};

export default function CaptureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
