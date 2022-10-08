import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { GraphQLClient, gql } from 'graphql-request'

import { remark } from 'remark'
import html from 'remark-html'

const entriesQuery = gql`
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

export const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: `Bearer ${process.env.GITHUB}`
    }
})

async function getRawFileFromGitHub(path) {
    const ghURL = "https://raw.githubusercontent.com"

    const res = await fetch(ghURL + path)
    let text = res.text()
    if (res.ok) return text

    console.error(ghURL + path)
    throw ghURL + path
}

export async function getAllEntryIds() {
    const resp = await client.request(entriesQuery, {
        owner: 'zachlatta',
        name: 'public-notes'
    })

    return resp.repository.object.entries
        .map(x => x.name)
        .map(fileName => {
            return {
                params: {
                    entry: fileName.replace(/\.md$/, '')
                }
            }
        })
}

export async function getEntryData(entry) {
    const fileContents = await getRawFileFromGitHub(`/zachlatta/public-notes/master/${entry}.md`)

    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        entry,
        contentHtml,
        ...matterResult.data,
    }
}