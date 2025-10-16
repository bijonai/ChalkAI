import knowledge from '@chalk-dsl/knowledge/default'
import { client } from '../shared/db'
import 'dotenv/config'

import '@chalk-dsl/layout'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'

const defaultKnowledge = process.env.DEFAULT_KNOWLEDGE!

const [, , command, ...args] = process.argv as [string, string, 'upload', string?] | [string, string, 'create', string, string?]

const upload = async (name: string = defaultKnowledge) => {
  const res = await client.knowledge.setKnowledge(name, knowledge, 'name')
  if (res.success) {
    console.log(`Uploaded knowledge ${name} successfully (id: \`${res.data.id}\`, ${res.data.description})`)
  } else {
    console.error(`Failed to upload knowledge ${name}`)
  }
}

const create = async (name: string = defaultKnowledge, description?: string) => {
  const res = await client.knowledge.createKnowledge(name, description)
  if (res.success) {
    console.log(`Created knowledge ${name} successfully (id: \`${res.data.id}\`, ${res.data.description ?? 'no description'})`)
  } else {
    console.error(`Failed to create knowledge ${name}`)
  }
}

const main = async () => {
  if (command === 'upload') {
    await upload(args[0])
  } else if (command === 'create') {
    await create(args[0], args[1])
  } else {
    console.error(`Invalid command: ${command}`)
  }
}

main()
