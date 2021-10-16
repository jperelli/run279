import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Run 279 Team</title>
        <meta name="description" content="Run 279 Team" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <main>
        <h1>Welcome to Run 279 Team!</h1>

        <Link href="/plan">Planner</Link>
        <hr />
        <Link href="/compare">Comparer</Link>
      </main>
    </div>
  );
};

export default Home;
