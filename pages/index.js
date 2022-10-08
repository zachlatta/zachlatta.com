import Head from 'next/head'
import Link from 'next/link'
import { getAllNoteIDs } from '../lib/notes'

export default function Home({ allEntryIDs }) {
  return (
    <div class="container max-w-4xl mt-12 mx-auto space-y-1">
      <Head>
        <title>Zach Latta</title>
      </Head>

      <h1 class="font-medium leading-tight text-2xl mt-0 mb-2">
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

      <p>read posts:</p>

      <ul class="list-disc list-inside">
        {allEntryIDs.map((params) => (
          <li key={params.params.note}>
            <Link href={`/${params.params.note}`}>
              <a class="underline hover:decoration-dashed">{params.params.note}</a>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export async function getStaticProps() {
  const allEntryIDs = await getAllNoteIDs()

  return {
    props: {
      allEntryIDs
    }
  }
}