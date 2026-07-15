"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserSupabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.email({ error: "Ingresa un correo valido." }),
  password: z
    .string()
    .min(8, { error: "Minimo 8 caracteres." })
    .regex(/[A-Z]/, { error: "Debe tener al menos una mayuscula." })
    .regex(/[^a-zA-Z0-9]/, { error: "Debe tener al menos un caracter especial." }),
});

type LoginFormType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormType) {
    setServerError("");
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError("Credenciales invalidas.");
      return;
    }

    const redirect = searchParams.get("redirect") || "/admin";
    router.push(redirect);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-hero">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl bg-bg-hero-secondary p-8 shadow-lg"
      >
        <h1 className="font-heading text-2xl text-white mb-6">
          Picacho Admin
        </h1>

        {serverError && (
          <p className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <label className="mb-1 block text-sm text-text-hero-muted">
          Correo
        </label>
        <input
          type="email"
          {...register("email")}
          className="mb-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mb-3 text-xs text-red-400">{errors.email.message}</p>
        )}
        {!errors.email && <div className="mb-3" />}

        <label className="mb-1 block text-sm text-text-hero-muted">
          Contrasena
        </label>
        <input
          type="password"
          {...register("password")}
          className="mb-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-green"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mb-3 text-xs text-red-400">{errors.password.message}</p>
        )}
        {!errors.password && <div className="mb-3" />}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand-green px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-green/90 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
