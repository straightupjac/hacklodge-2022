import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import Header from "@components/core-components/Header";
import createEmotionCache from '../styles/createEmotionCache';
import "/styles/globals.css";
import theme from '../styles/theme';
import Footer from "@components/core-components/Footer";
import TagManager from "react-gtm-module"
import { useEffect } from 'react';
import Meta from '@components/Meta';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const tagManagerArgs = {
  id: "G-ZZ263HQB0M",
}

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Meta />
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </CacheProvider>
  );
}
