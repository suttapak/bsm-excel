// app/providers.tsx

import { HeroUIProvider } from "@heroui/react";
import type { NavigateOptions, ToOptions } from "@tanstack/react-router";

import { useRouter } from "@tanstack/react-router";

declare module "@react-types/shared" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  let router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={(to, options) => router.navigate({ to, ...options })} useHref={(to) => router.buildLocation({ to }).href}>
        {children}
      </HeroUIProvider>

      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
}
