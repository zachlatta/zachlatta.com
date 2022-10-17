import Head from 'next/head'
import Link from 'next/link'
import { format } from 'timeago.js'
import { getAllNotes, cache } from '../lib/notes'

export default function Home({ notes }) {
  const sortedNotes = notes.sort((a, b) => {
    // sort dates alphabetically since they are in iso8601
    // from https://stackoverflow.com/a/12192544/1001686
    return (a.modified > b.modified) ? -1 : ((a.modified < b.modified) ? 1 : 0)
  })

  return (
    <div className="container px-16 mt-8 mx-auto">
      <Head>
        <title>Zach Latta</title>
      </Head>

      <h1 className="font-medium leading-tight text-2xl mt-0 mb-2">
        Zach Latta
      </h1>

      <div className="space-y-1">
        <p>
          these days i'm living in vermont. coding profoundly changed my life,
          and i'm trying to help more teenagers have that same experience.
        </p>

        <p>
          beyond hack club, i enjoy reading, making computer projects, and deep
          conversations.
        </p>

        <p>
          below are a subset of notes that are public. these aren't really meant
          as blog posts, but more as a self-accountability mechanism to try and
          make more of the things i'm doing public. similar to making the code
          you might write on github public, even if it's not really meant for
          others to look at it or use it - but you still make it public for
          self-accountability.
        </p>
      </div>

      <h2 className="mt-2 mb-1">read public notes:</h2>

      <ul className="list-disc list-inside">
        {sortedNotes.map((note) => (
          <li key={note.path}>
            <Link href={`/${note.path}`}>
              <a className="underline hover:decoration-dashed">{note.title}</a>
            </Link>{' '}
            <span className="text-xs italic">(edited {format(note.modified)})</span>
          </li>
        ))}
      </ul>

      <p className="mt-3">
        this site is open source at{' '}
        <Link href="https://github.com/zachlatta/zachlatta.com">
          <a className="underline">github.com/zachlatta/zachlatta.com</a>
        </Link>
      </p>

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
          ...note
        }
      }),
    }
  }
}