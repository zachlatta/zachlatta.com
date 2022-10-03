import { getAllEntryIds, getEntryData } from '../lib/entries'

export async function getStaticPaths() {
    const paths = getAllEntryIds()

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const entryData = await getEntryData(params.entry)
    return {
        props: {
            entryData,
        }
    }
}

export default function Entry({ entryData }) {
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: entryData.contentHtml }} />
        </>
    )
}