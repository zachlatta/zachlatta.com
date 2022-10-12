import matter from 'gray-matter'
import { GraphQLClient, gql } from 'graphql-request'

import { remark } from 'remark'
import html from 'remark-html'

const notesQuery = gql`
query RepoFiles($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
        object(expression: "HEAD:") {
            ... on Tree {
                entries {
                    name
                    type
                    object {
                        ... on Blob {
                            byteSize
                        }
                        ... on Tree {
                            entries {
                                name
                                type
                                object {
                                    ... on Blob {
                                        byteSize
                                        text
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`

const newNotesQuery = gql`
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

        const resp = await client.request(newNotesQuery, {
            owner: 'zachlatta',
            name: 'public-notes',
            commitRef: `HEAD:${currentDir}`,
        })

        resp.repository.object.entries.forEach(entry => {
            // pathname = the path to the current entry without a preceding slash
            let pathname = currentDir == "" ? entry.name : `${currentDir}/${entry.name}`

            if (entry.type == "tree") {
                dirs.push(pathname)
                return
            }

            notes.push({
                name: pathname,
                text: entry.object.text
            })
        })
    }

    return notes
}

async function getRawFileFromGitHub(path) {
    const ghURL = "https://raw.githubusercontent.com"

    const res = await fetch(ghURL + path)
    let text = res.text()
    if (res.ok) return text

    console.error(ghURL + path)
    throw ghURL + path
}

export async function getAllNoteIDs() {
    const resp = await client.request(notesQuery, {
        owner: 'zachlatta',
        name: 'public-notes'
    })

    return resp.repository.object.entries
        .map(x => x.name)
        .map(fileName => {
            return {
                params: {
                    note: fileName.replace(/\.md$/, '')
                }
            }
        })
}

export async function getNoteData(note) {
    const fileContents = await getRawFileFromGitHub(`/zachlatta/public-notes/master/${note}.md`)

    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        entry: note,
        contentHtml,
        ...matterResult.data,
    }
}