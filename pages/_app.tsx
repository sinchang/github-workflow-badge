import '../styles/globals.css'
import '@geist-ui/style'
import type { AppProps } from 'next/app'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        data-website-id='7f340b54-8669-43af-8946-65d0148546b5'
        src='https://umami-production-af5b.up.railway.app/umami.js'
        strategy='afterInteractive'
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
