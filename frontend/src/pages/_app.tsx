import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "@/store";
import { LoginStatusWatch } from "@/features/auth/hooks/LoginStatusWatch";

let persistor = persistStore(store);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoginStatusWatch />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
