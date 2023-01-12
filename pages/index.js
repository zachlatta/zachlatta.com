import Head from 'next/head'
import Link from '../components/Link'
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

      <div className="space-y-1 lowercase">
        <p>
          These days I'm living in Vermont. Coding profoundly changed my life,
          and I'm trying to help more teenagers have that same experience through{' '}
          <Link href="https://hackclub.com">Hack Club</Link>.
        </p>

        <p>
          Beyond Hack Club, I enjoy reading, making computer projects, and deep
          conversations.
        </p>
      </div>

      <hr className="my-3" />

      <div className="space-y-1">
        <p>
          Below are a subset of notes that are public. These aren't really meant
          as blog posts, but more as a self-accountability mechanism to try and
          make more of the things I'm doing and thinking about public.
        </p>

        <p>
          The goal is to be similar to making the code you might write on GitHub
          public, even if it's not really meant for others to look at it or use it
          - but you still make it public for self-accountability.
        </p>
      </div>

      <h2 className="mt-2 mb-1">Read public notes:</h2>

      <ul className="list-disc list-inside">
        {sortedNotes.map((note) => (
          <li key={note.path}>
            <Link href={`/${note.path}`}>{note.title}</Link>{' '}
            <span className="text-xs italic">(edited {format(note.modified)})</span>
          </li>
        ))}
      </ul>

      <p className="mt-3">
        This site is open source at{' '}
        <Link href="https://github.com/zachlatta/zachlatta.com">github.com/zachlatta/zachlatta.com</Link>.
      </p>

    </div >
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
