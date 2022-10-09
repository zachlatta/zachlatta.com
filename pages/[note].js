import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAllNoteIDs, getNoteData } from '../lib/notes'

export async function getStaticPaths() {
    const paths = await getAllNoteIDs()

    console.log(paths)

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const entryData = await getNoteData(params.note)
    return {
        props: {
            entryData,
        },
        revalidate: 60
    }
}

export default function Note({ entryData: note }) {
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