import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { remark } from 'remark'
import html from 'remark-html'

const entriesDirectory = path.join(process.cwd(), '../markdown-idea/dest/')

export function getAllEntryIds() {
    const fileNames = fs.readdirSync(entriesDirectory)

    return fileNames.map(fileName => {
        return {
            params: {
                entry: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getEntryData(entry) {
    const fullPath = path.join(entriesDirectory, `${entry}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

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