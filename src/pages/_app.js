import '../styles/globals.css';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AI-Powered Academic Research Portal | PES University</title>
        <meta name="description" content="DBMS Project - PostgreSQL, pgvector, and NoSQL JSONB Academic Research Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}

