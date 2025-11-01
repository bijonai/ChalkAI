import { parseEntities } from 'parse-entities'

export const TAG_START_REG = /^<(\p{ID_Start}[\p{ID_Continue}:.$@-]*)/u
export const DIRECTIVE_REG = /^<!(\p{ID_Start}[\p{ID_Continue}:.$@-]*)/u
export const TAG_END_REG = /^<\/(\p{ID_Start}[\p{ID_Continue}:.$@-]*)/u
export const ATTR_NAME_REG = /^[\p{ID_Start}@:$#+\-_][\p{ID_Continue}@:$#\-+]*/u
export const ATTR_UNQUOTED_VALUE_REG = /^[\p{ID_Continue}@:$#\-+]*/u
export const WHITESPACE_REG = /^\s+/u

export enum TextMode {
  DATA,
  RCDATA,
  RAWTEXT,
  CDATA,
}

export enum NodeType {
  TEXT,
  ELEMENT,
  CDATA,
  COMMENT,
  DOCUMENT,
  RAW,
  ATTRIBUTE,
  VALUE,
  FRAGMENT,
  DIRECTIVE,
}

export type ChildNode =
  | ElementNode
  | TextNode
  | CDATANode
  | CommentNode
  | ValueNode
  | DocumentNode
  | FragmentNode
  | DirectiveNode

export interface BaseNode {
  type: NodeType
  parent?: FragmentNode | DocumentNode | ElementNode
  domNode?: Node | Node[]
}

export interface ValueNode extends BaseNode {
  type: NodeType.VALUE
  value: string
}

export interface DocumentNode extends BaseNode {
  type: NodeType.DOCUMENT
  children: ChildNode[]
  filename: string
  raw: string
}

export interface AttributeNode extends BaseNode {
  type: NodeType.ATTRIBUTE
  name: string
  value: string
  raw: string
}

export interface ElementNode extends BaseNode {
  type: NodeType.ELEMENT
  tag: string
  selfClosing: boolean
  attributes: AttributeNode[]
  children: ChildNode[]
}

export interface DirectiveNode extends BaseNode {
  type: NodeType.DIRECTIVE
  directive: string
  attributes: AttributeNode[]
}

export interface TextNode extends BaseNode {
  type: NodeType.TEXT
  raw: string
  content: string
}

export interface CDATANode extends BaseNode {
  type: NodeType.CDATA
  content: string
}

export interface CommentNode extends BaseNode {
  type: NodeType.COMMENT
  content: string
}

export interface FragmentNode extends BaseNode {
  type: NodeType.FRAGMENT
  children: ChildNode[]
}

export class ParserContext {
  public readonly lines: string[]
  public readonly lineStarts: number[]
  public ancestors: [ElementNode | FragmentNode, Position][] = []

  constructor(
    public readonly source: string,
    public readonly filename: string = '<anonymous>',
    public idx: number = 0,
    public mode: TextMode = TextMode.DATA,
    public resolver: ModeResolver = () => TextMode.DATA,
  ) {
    this.lines = source.split('\n')
    this.lineStarts = []
    let index = 0
    for (let i = 0; i < this.lines.length; i++) {
      this.lineStarts.push(index)
      index += this.lines[i].length + 1 // +1 for the newline character
    }
  }

  getPosition(offset: number = 0): Position {
    const pos = this.idx + offset
    let line = 1
    let lastLineStart = 0

    let left = 0
    let right = this.lineStarts.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (this.lineStarts[mid] <= pos) {
        lastLineStart = this.lineStarts[mid]
        line = mid + 1
        left = mid + 1
      }
      else {
        right = mid - 1
      }
    }

    return {
      line,
      column: pos - lastLineStart + 1,
      idx: pos,
    }
  }

  push(node: ElementNode | FragmentNode) {
    this.ancestors.push([node, this.getPosition()])
  }

  pop() {
    this.ancestors.pop()
  }

  getLines(startLine: number, endLine: number): string[] {
    return this.lines.slice(startLine - 1, endLine)
  }

  remaining(end?: number): string {
    return this.source.slice(this.idx, end)
  }

  slice(start?: number, end?: number): string {
    return this.source.slice(start, end)
  }

  advance(num: number): void {
    this.idx += num
    if (this.eof) {
      this.idx = this.source.length
    }
  }

  get eof() {
    return this.idx > this.source.length - 1
  }

  startsWith(pat: string): boolean {
    return this.source.startsWith(pat, this.idx)
  }

  indexOf(pat: string, last: boolean = false) {
    return last ? this.source.lastIndexOf(pat, this.idx) : this.source.indexOf(pat, this.idx)
  }

  char(offset: number = 0): string {
    return this.source[this.idx + offset]
  }

  trim(): void {
    const match = WHITESPACE_REG.exec(this.source.slice(this.idx))

    if (match) {
      this.idx += match[0].length
    }
  }
}

export type ModeResolver = (tag: string) => TextMode

export function isEnd(context: ParserContext): boolean {
  if (context.eof) {
    return true
  }

  const parent = context.ancestors[context.ancestors.length - 1]?.[0]
  if (
    parent
    && (
      (parent.type == NodeType.ELEMENT && context.startsWith(`</${parent.tag}>`))
      || (parent.type == NodeType.FRAGMENT && context.startsWith('</>'))
    )
  ) {
    return true
  }

  return false
}

export function parseCDATA(context: ParserContext): CDATANode {
  context.advance(9)
  const endIdx = context.indexOf(']]>')
  if (endIdx == -1) {
    context.idx = context.source.length
    throw new ParserError('Unclosed CDATA section', context, 'UNCLOSED_CDATA')
  }
  const raw = context.remaining(endIdx)
  context.advance(raw.length + 3)
  return {
    type: NodeType.CDATA,
    content: raw,
  }
}

export function parseComment(context: ParserContext): CommentNode {
  let endIdx = context.source.length
  const endTagIdx = context.indexOf('-->')
  if (endIdx != -1 && endTagIdx < endIdx) {
    endIdx = endTagIdx
  }

  const raw = context.remaining(endIdx)
  context.advance(raw.length)

  if (!context.eof) {
    context.advance(3)
  }

  return {
    type: NodeType.COMMENT,
    content: raw,
  }
}

export function parseTag(context: ParserContext, start: boolean = true): ElementNode {
  const match = (
    start
      ? TAG_START_REG
      : TAG_END_REG
  ).exec(context.remaining())

  if (!match) {
    throw new ParserError(
      start ? 'Invalid opening tag' : 'Invalid closing tag',
      context,
      'INVALID_TAG_NAME',
    )
  }

  const tag = match[1]
  context.advance(match[0].length)
  context.trim()
  const attributes = parseAttributes(context)
  const selfClosing = context.startsWith('/>')
  context.advance(selfClosing ? 2 : 1)

  return {
    type: NodeType.ELEMENT,
    tag,
    selfClosing,
    attributes,
    children: [],
  }
}

export function parseDirective(context: ParserContext): DirectiveNode {
  const match = DIRECTIVE_REG.exec(context.remaining())

  if (!match) {
    throw new ParserError(
      'Invalid directive',
      context,
      'INVALID_DIRECTIVE',
    )
  }

  const tag = match[1]
  context.advance(match[0].length)
  context.trim()
  const attributes = parseAttributes(context)
  context.advance(1)

  return {
    type: NodeType.DIRECTIVE,
    directive: tag,
    attributes,
  }
}

export function parseAttributes(context: ParserContext): AttributeNode[] {
  const attrs: AttributeNode[] = []

  while (!context.startsWith('>') && !context.startsWith('/>')) {
    const match = ATTR_NAME_REG.exec(context.remaining())
    if (!match) {
      throw new ParserError('Invalid attribute name', context, 'INVALID_ATTRIBUTE_NAME')
    }

    const name = match[0]

    context.advance(name.length)
    context.trim()

    if (!context.startsWith('=')) {
      attrs.push({
        type: NodeType.ATTRIBUTE,
        name,
        value: '',
        raw: '',
      })

      continue
    }

    context.advance(1) // =
    context.trim()

    let value = ''
    const quote = context.char()
    if (quote == '\'' || quote == '"') {
      context.advance(1)
      const valueIdx = context.indexOf(quote)
      if (valueIdx == -1) {
        throw new ParserError('Unclosed attribute value quotation', context, 'UNEXPECTED_ATTRIBUTE_VALUE')
      }

      value = context.remaining(valueIdx)
      context.advance(value.length + 1)
    }
    else {
      const match = ATTR_UNQUOTED_VALUE_REG.exec(context.remaining())
      if (match == null) {
        throw new ParserError('Unexpected attribute value', context, 'UNEXPECTED_ATTRIBUTE_VALUE')
      }
      [value] = match
      context.advance(value.length)
    }

    context.trim()

    attrs.push({
      type: NodeType.ATTRIBUTE,
      name,
      value: parseEntities(value, { attribute: true }),
      raw: value,
    })
  }

  return attrs
}

export function parseElement(context: ParserContext): ElementNode {
  const startIdx = context.idx
  const element = parseTag(context)

  element.attributes.forEach((attr) => {
    attr.parent = element
  })

  if (element.selfClosing) {
    return element
  }

  const mode = context.resolver(element.tag)
  const oldMode = context.mode

  try {
    context.push(element)
    context.mode = mode
    element.children = parseChildren(context)

    if (!context.eof) {
      const endTag = parseTag(context, false)
      if (endTag.tag !== element.tag) {
        throw new ParserError(
          `Mismatched closing tag: expected </${element.tag}> but found </${endTag.tag}>`,
          context,
          'MISMATCHED_CLOSING_TAG',
        )
      }
    }
    else {
      // Reached EOF without finding closing tag
      throw new UnclosedTagError(
        `Unclosed tag <${element.tag}>`,
        context,
        startIdx,
        element.tag,
      )
    }
  }
  finally {
    context.pop()
    context.mode = oldMode
  }

  return element
}

export function parseValue(context: ParserContext): ValueNode {
  context.advance(2)
  const endIdx = context.indexOf('}}')
  if (endIdx == -1) {
    context.idx = context.source.length
    throw new ParserError('Unclosed interpolation expression', context, 'UNCLOSED_INTERPOLATION')
  }
  const raw = context.remaining(endIdx)
  context.advance(raw.length + 2)
  return {
    type: NodeType.VALUE,
    value: raw,
  }
}

export function parseText(context: ParserContext): TextNode {
  let endIdx = context.source.length

  const rawMode = context.mode != TextMode.DATA
    && context.ancestors.length > 0
    && context.ancestors[context.ancestors.length - 1][0].type == NodeType.ELEMENT

  if (rawMode) {
    if (context.mode == TextMode.CDATA) {
      throw new ParserError('Direct text parsing not supported in CDATA mode', context, 'INVALID_CDATA_MODE')
    }

    let nextIdx = context.indexOf('</')
    while (nextIdx != -1) {
      const remaining = context.slice(nextIdx)
      const match = remaining.match(TAG_END_REG)
      const ancestor = context.ancestors[context.ancestors.length - 1][0]
      if (match && ancestor.type == NodeType.ELEMENT && match[1] == ancestor.tag) {
        endIdx = nextIdx
        break
      }
      nextIdx = context.source.indexOf('</', nextIdx + 2)
    }
  }
  else {
    const valIdx = context.indexOf('{{')
    const ltIdx = context.indexOf('<')

    if (ltIdx != -1 && ltIdx < endIdx) {
      endIdx = ltIdx
    }

    if (valIdx != -1 && valIdx < endIdx) {
      endIdx = valIdx
    }
  }

  const raw = context.remaining(endIdx)
  context.advance(raw.length)

  return {
    type: NodeType.TEXT,
    content: context.mode != TextMode.RAWTEXT ? parseEntities(raw) : '',
    raw,
  }
}

export function parseChildren(context: ParserContext) {
  const nodes: ChildNode[] = []
  const parent = context.ancestors[context.ancestors.length - 1]?.[0]

  while (!isEnd(context)) {
    let node: ChildNode | null = null

    if (context.mode == TextMode.DATA || context.mode == TextMode.RCDATA) {
      if (context.mode == TextMode.DATA && context.char(0) == '<') {
        if (context.char(1) == '!') {
          if (context.startsWith('<![CDATA[')) {
            node = parseCDATA(context)
          }
          else if (context.startsWith('<!--')) {
            node = parseComment(context)
          }
          else {
            node = parseDirective(context)
          }
        }
        else if (context.char(1) == '/') {
          throw new ParserError('Unexpected closing tag', context, 'UNEXPECTED_CLOSING_TAG')
        }
        else if (/\p{ID_Start}/u.test(context.char(1))) {
          try {
            node = parseElement(context)
          }
          catch (error) {
            if (error instanceof UnclosedTagError) {
              // Reset context to the start of the unclosed tag
              context.idx = error.startIdx
              // Find the end of the opening tag (the '>' character)
              const tagEndIdx = context.indexOf('>')
              if (tagEndIdx === -1) {
                // No closing '>' found, treat rest as text
                const raw = context.remaining()
                context.advance(raw.length)
                node = {
                  type: NodeType.TEXT,
                  content: parseEntities(raw),
                  raw,
                }
              }
              else {
                // Include the entire opening tag as text
                const raw = context.remaining(tagEndIdx + 1)
                context.advance(raw.length)
                node = {
                  type: NodeType.TEXT,
                  content: parseEntities(raw),
                  raw,
                }
              }
            }
            else {
              throw error
            }
          }
        }
        else if (context.char(1) == '>') {
          node = parseFragment(context)
        }
        else {
          // Invalid tag name or standalone '<', treat as single character text
          const raw = context.char(0)
          context.advance(1)
          node = {
            type: NodeType.TEXT,
            content: parseEntities(raw),
            raw,
          }
        }
      }
      else if (context.startsWith('{{')) {
        node = parseValue(context)
      }
    }

    if (node == null) {
      node = parseText(context)
    }

    if (node) {
      node.parent = parent
      if (node.type === NodeType.ELEMENT) {
        node.attributes.forEach((attr) => {
          attr.parent = node as ElementNode
        })
      }
      nodes.push(node)
    }
  }

  return nodes
}

export function parseDocument(context: ParserContext): DocumentNode {
  const children = parseChildren(context)
  const document: DocumentNode = {
    type: NodeType.DOCUMENT,
    children,
    filename: context.filename,
    raw: context.source,
  }
  children.forEach((child) => {
    child.parent = document
  })
  return document
}

export interface ParseOptions {
  resolver?: ModeResolver
  startPos?: number
  initialMode?: TextMode
  filename?: string
}

export function parse(source: string, { startPos, resolver, initialMode, filename }: ParseOptions = {}): DocumentNode {
  const context = new ParserContext(source, filename, startPos, initialMode, resolver)
  return parseDocument(context)
}

export class ParserError extends Error {
  constructor(
    message: string,
    public context: ParserContext,
    public code: string = 'PARSER_ERROR',
  ) {
    const position = context.getPosition()
    const preview = getSourcePreview(context)
    super(
      `${message}\n`
      + `Location: ${context.filename}:${position.line}:${position.column} (${position.idx})\n`
      + `Code: ${code}\n`
      + `Ancestors:\n${getAncestorsPreview(context)}`
      + `Preview:\n${preview}\n`,
    )
  }
}

export class UnclosedTagError extends ParserError {
  constructor(
    message: string,
    context: ParserContext,
    public startIdx: number,
    public tagName: string,
  ) {
    super(message, context, 'UNCLOSED_TAG')
  }
}

export interface Position {
  line: number
  column: number
  idx: number
}

export function getSourcePreview(context: ParserContext): string {
  const pos = context.getPosition()

  const startLine = Math.max(1, pos.line - 2)
  const endLine = Math.min(context.lines.length, pos.line + 1)

  return context.getLines(startLine, endLine)
    .map((line, i) => {
      const lineNum = startLine + i
      const isErrorLine = lineNum === pos.line
      const paddedLineNum = lineNum.toString().padStart(4, ' ')
      return `${paddedLineNum} | ${line}${isErrorLine ? `\n     | ${'^'.padStart(pos.column)}` : ''}`
    })
    .join('\n')
}

export function getAncestorsPreview(context: ParserContext): string {
  return context.ancestors.reduce((acc, [node, pos]) => {
    return `${acc}   - ${node.type == NodeType.ELEMENT ? `<${node.tag}>` : '(Fragment)'} at ${pos.line}:${pos.column} (${pos.idx})\n`
  }, '   - (Root)\n')
}

export function parseFragment(context: ParserContext): FragmentNode {
  context.advance(2) // <>

  const fragment: FragmentNode = {
    type: NodeType.FRAGMENT,
    children: [],
  }

  context.push(fragment)
  fragment.children = parseChildren(context)
  if (!context.startsWith('</>')) {
    throw new ParserError(
      'Fragment must be closed with </>',
      context,
      'INVALID_FRAGMENT_END',
    )
  }
  context.pop()
  context.advance(3)

  return fragment
}

export function traverseNode<T>(traverser: (node: ChildNode, context: T) => false | void, node: ChildNode[] | ChildNode, context: T, maxDepth: false | number = false): T {
  const nodes = Array.isArray(node) ? node : [node]

  function visit(nodes: ChildNode[], depth: number): boolean {
    for (const node of nodes) {
      if (traverser(node, context) === false) {
        return true
      }

      if (maxDepth === false || depth < maxDepth) {
        if (node.type === NodeType.ELEMENT || node.type === NodeType.FRAGMENT || node.type === NodeType.DOCUMENT) {
          if (visit(node.children, depth + 1)) {
            return true
          }
        }
      }
    }

    return false
  }

  visit(nodes, 1)
  return context
}

export function queryNode(filter: (node: ChildNode) => boolean, node: ChildNode[] | ChildNode, maxNum: false | number = false, maxDepth: false | number = false): Set<ChildNode> {
  const results = new Set<ChildNode>()
  const nodes = Array.isArray(node) ? node : [node]

  function visit(nodes: ChildNode[], depth: number): boolean {
    for (const node of nodes) {
      if (filter(node)) {
        results.add(node)
        if (maxNum !== false && results.size >= maxNum) {
          return true
        }
      }

      if (maxDepth === false || depth < maxDepth) {
        if (node.type === NodeType.ELEMENT || node.type === NodeType.FRAGMENT || node.type === NodeType.DOCUMENT) {
          if (visit(node.children, depth + 1)) {
            return true
          }
        }
      }
    }

    return false
  }

  visit(nodes, 1)
  return results
}

export function getRootNode(node: ChildNode): ChildNode {
  let parent = node
  while (parent.parent != null) {
    parent = parent.parent
  }

  return parent
}
