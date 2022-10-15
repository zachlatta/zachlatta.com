import { ApiError } from 'next/dist/server/api-utils'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { format } from 'timeago.js'
import { getAllNotes, cache } from '../lib/notes'

export async function getStaticPaths() {
    let notes = await cache.get()

    if (!notes) {
        notes = await getAllNotes()
    }

    await cache.set(notes)

    return {
        paths: notes.map(note => {
            return {
                params: {
                    note: note.name.replace(/\.md$/, '').split('/')
                }
            }
        })
    }
}

export async function getStaticProps({ params }) {
    // if the requested note is in a subfolder, nextjs will send us each folder
    // as an object in an array. convert them into a single path
    let requestedPath = params.note.join("/")
    let notes = await cache.get()

    if (!notes) {
        notes = await getAllNotes()
    }

    let note = notes.find(note => note.name == requestedPath + '.md')

    return {
        props: {
            note,
        }
    }
}

export default function Note({ note }) {
    const { asPath } = useRouter()

    return (
        <>
            <Head>
                <title>{`${note.title} | Zach Latta`}</title>
            </Head>
            <div className="container px-16 mt-8 mx-auto">
                <Link href="/">
                    <a className="italic">Zach Latta</a>
                </Link>
                {" -> "}
                <Link href={asPath}>
                    <a className="italic font-semibold">{note.title}</a>
                </Link>

                <hr className="my-2"></hr>

                <div className="prose space-y-1 prose-h1:text-2xl" dangerouslySetInnerHTML={{ __html: note.contentHtml }} />

                <p className="text-xs italic mt-3">Edited {format(note.modified)}. Created {format(note.created)}.</p>
            </div>
        </>
    )
}