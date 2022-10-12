import Head from 'next/head'
import Link from 'next/link'
import { getAllNotes, cache } from '../lib/notes'

export default function Home({ notes }) {
  return (
    <div className="container px-16 mt-8 mx-auto space-y-1">
      <Head>
        <title>Zach Latta</title>
      </Head>

      <h1 className="font-medium leading-tight text-2xl mt-0 mb-2">
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

      <ul className="list-disc list-inside">
        {notes.map((note) => (
          <li key={note.path}>
            <Link href={`/${note.path}`}>
              <a className="underline hover:decoration-dashed">{note.title}</a>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export async function getStaticProps() {
  let notes = await cache.get()

  if (!notes) {
    notes = await getAllNotes()
  }

  return {
    props: {
      notes: notes.map(note => {
        return {
          path: note.name.replace(/\.md$/, ''),
          title: note.title
        }
      }),
    },
    revalidate: 60,
  }
}