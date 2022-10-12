import { ApiError } from 'next/dist/server/api-utils'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAllNotes, cache } from '../lib/notes'

export async function getStaticPaths() {
    const notes = await getAllNotes()

    console.log(notes)

    await cache.set(notes)

    return {
        paths: notes.map(note => {
            return {
                params: {
                    note: note.name.replace(/\.md$/, '')
                }
            }
        }),
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    let notes = await cache.get()

    if (!notes) {
        notes = await getAllNotes()
    }

    let note = notes.find(note => note.name == params.note + '.md')

    return {
        props: {
            note,
        },
        revalidate: 60
    }
}

export default function Note({ note }) {
    const { asPath } = useRouter()

    return (
        <>
            <Head>
                <title>{note.title} | Zach Latta</title>
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
            </div>
        </>
    )
}