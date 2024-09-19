
import type { AppProps } from 'next/app';
import RootLayout from './app/layout';  // 注意這裡的路徑

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
