"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn.email({ email, password });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Autenticazione fallita");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Accedi a Jotter</CardTitle>
          <CardDescription className="text-center">Inserisci le tue credenziali per accedere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            <Button className="w-full" type="submit">Accedi</Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Non hai un account?{' '}
            <Link href="/signup" className="text-primary hover:underline">Registrati</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
