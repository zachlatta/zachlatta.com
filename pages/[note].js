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
        }
    }
}

export default function Note({ entryData: noteData }) {
    return (
        <>
            <h1>{noteData.title}</h1>
            <div className="prose" dangerouslySetInnerHTML={{ __html: noteData.contentHtml }} />
        </>
    )
}