import Head from 'next/head'
import Link from 'next/link'
import { getAllEntryIds } from '../lib/entries'

export default function Home({ allEntryIDs }) {
  return (
    <div>
      <Head>
        <title>Zach Latta</title>
      </Head>

      <main>
        <h1>
          Zach Latta
        </h1>
        <p>
          these days i'm living in vermont. coding profoundly changed my life,
          and i'm trying to help more teenagers have that same experience.
        </p>

        <p>
          beyond hack club, i enjoy reading, making computer projects, and deep
          conversations.
        </p>
      </main>

      <p>read posts:</p>

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