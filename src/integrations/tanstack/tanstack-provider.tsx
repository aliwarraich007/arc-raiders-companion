import "@/integrations/native-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, useState } from "react";

const DAY = 24 * 60 * 60 * 1000;

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "arc-app-query-cache",
  throttleTime: 2000,
});

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 7 * DAY, // must be >= the longest persist maxAge
            staleTime: 5 * 60 * 1000,
            retry: 2,
            networkMode: "offlineFirst", // serve cache when offline
          },
        },
      }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 7 * DAY,
        buster: "1", // bump when API response shapes change
        dehydrateOptions: {
          shouldDehydrateQuery: (q) =>
            q.state.status === "success" && q.meta?.persist === true,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
