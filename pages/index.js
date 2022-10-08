import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { getAllEntryIds } from '../lib/entries'

export default function Home({ allEntryIDs }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zach Latta</title>
      </Head>

      <main>
        <h1>
          Welcome to my homepage!
        </h1>
      </main>

      {allEntryIDs.map((params) => (
        <li key={params.params.entry}>
          <Link href={`/${params.params.entry}`}>
            <a>{params.params.entry}</a>
          </Link>
        </li>
      ))}

    </div>
  )
}

export async function getStaticProps() {
  const allEntryIDs = await getAllEntryIds()

  return {
    props: {
      allEntryIDs
    }
  }
}