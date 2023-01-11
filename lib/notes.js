import matter from 'gray-matter'
import { GraphQLClient, gql } from 'graphql-request'

import { remark } from 'remark'
import html from 'remark-html'
import { promises as fs } from 'fs'
import path from 'path'

const notesQuery = gql`
query RepoFiles($owner: String!, $name: String!, $commitRef: String!) {
    repository(owner: $owner, name: $name) {
        object(expression: $commitRef) {
            ... on Tree {
                entries {
                    name
                    type
                    mode

                    object {
                        ... on Blob {
                            byteSize
                            text
                            isBinary
                        }
                    }
                }
            }
        }
    }
}
`

export const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: `Bearer ${process.env.GITHUB}`
    }
})

export async function getAllNotes() {
    // empty string is root dir
    let dirs = [""]
    let notes = []

    while (dirs.length > 0) {
        let currentDir = dirs.pop()

        const resp = await client.request(notesQuery, {
            owner: 'zachlatta',
            name: 'public-notes',
            commitRef: `HEAD:${currentDir}`,
        })

        for (const entry of resp.repository.object.entries) {
            // pathname = the path to the current entry without a preceding slash
            let pathname = currentDir == "" ? entry.name : `${currentDir}/${entry.name}`

            if (entry.type == "tree") {
                dirs.push(pathname)
                continue
            }

            // skip all non-markdown files
            if (!pathname.endsWith('.md')) {
                continue
            }

            const matterResult = matter(entry.object.text)

            const processedContent = await remark()
                .use(html)
                .process(matterResult.content)
            const contentHtml = processedContent.toString()

            notes.push({
                name: pathname,
                text: entry.object.text,
                contentHtml,
                ...matterResult.data,
            })
        }
    }

    return notes
}

export const cache = {
    get: async () => {
        try {
            const data = await fs.readFile(path.join(process.cwd(), 'tmp/notes.json'))
            const notes = JSON.parse(data)

            return notes
        } catch (_err) {
            return null
        }
    },

    set: async (notes) => {
        return await fs.writeFile(
            path.join(process.cwd(), 'tmp/notes.json'),
            JSON.stringify(notes)
        )
    }
}
