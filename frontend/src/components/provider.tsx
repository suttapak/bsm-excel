// app/providers.tsx

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { NavigateOptions, ToOptions } from "@tanstack/react-router";

import { useRouter } from "@tanstack/react-router";

declare module "@react-types/shared" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";
export function Providers({ children }: { children: React.ReactNode }) {
  let router = useRouter();
  return (
    <>
      <HeroUIProvider
        navigate={(to, options) => router.navigate({ to, ...options })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <ToastProvider />
        <Toaster />
        {children}
      </HeroUIProvider>

      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </>
  );
}
