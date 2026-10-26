import { http, createConfig, injected } from "wagmi";
import { botchainMainnet } from "./chain";

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(
      process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"
    ),
  },
  ssr: true,
});
