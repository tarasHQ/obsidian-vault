// Temporary Phase 005 investigation, not a site plugin or a regression test.
// Run from the repository root: node __obsidian__/phases/005/artifacts/step-04-comment-feasibility.mjs
import { ObsidianFlavoredMarkdown } from "@quartz-community/obsidian-flavored-markdown"
import { TableOfContentsTransformer } from "@quartz-community/table-of-contents"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { VFile } from "vfile"

const examples = [
	{
		name: "inline comment with formatting and links",
		markdown: "## Before\n\nText %% *emphasis* and [link](https://example.com) %% after.\n\n## After",
	},
	{
		name: "multi-block comment and heading section boundary",
		markdown:
			"## Before\n\n%%\n## Inside\n\nA [link](https://example.com) and **bold**.\n%%\n\nOutside the comment, still in Inside's section.\n\n## After",
	},
	{
		name: "comments inside list and blockquote",
		markdown:
			"## Contexts\n\n- Parent\n  - Child %% inline *comment* %%\n\n  %%\n  ### Comment heading\n\n  Paragraph in list.\n  %%\n\n> %%\n> ### Quoted heading\n>\n> Quoted text.\n> %%\n\n## End",
	},
	{
		name: "marker placement, similar comments, and code",
		markdown:
			"## Marked %% fold %%\n\n- Item%% fold %%\n  - Child\n- Not a marker %% fold  %%\n  - Child\n\n`%% fold %%`\n\n```md\n%% fold %%\n```\n\n## End",
	},
]

function makeProcessors() {
	const obsidian = ObsidianFlavoredMarkdown({ comments: true, wikilinks: true })
	const toc = TableOfContentsTransformer({ minEntries: 0, maxDepth: 6 })
	return {
		markdown: unified().use(remarkParse).use(obsidian.markdownPlugins({})).use(toc.markdownPlugins({})),
		html: unified()
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(obsidian.htmlPlugins?.({}) ?? [])
			.use(toc.htmlPlugins({})),
	}
}

// This deliberately omits styling and marker interpretation. It tests only whether
// the comment's content can reach the existing Markdown transforms as regular nodes.
function expandComments(parent, parser) {
	if (!Array.isArray(parent.children)) return
	const expanded = []
	for (const child of parent.children) {
		if (child.type !== "comment") {
			expandComments(child, parser)
			expanded.push(child)
			continue
		}
		const inline = parent.type === "paragraph" || parent.type === "heading"
		const replacement = inline ? (child.children ?? []) : parser.parse(child.value).children
		for (const node of replacement) {
			expandComments(node, parser)
			expanded.push(node)
		}
	}
	parent.children = expanded
}

// Reduce output size while retaining tree structure, text, links, and relevant HTML data.
function summarize(node) {
	if (!node || typeof node !== "object") return node
	const result = { type: node.type }
	for (const key of ["tagName", "depth", "value", "url", "identifier"]) {
		if (node[key] !== undefined) result[key] = node[key]
	}
	if (node.properties && Object.keys(node.properties).length) result.properties = node.properties
	if (node.data?.hProperties && Object.keys(node.data.hProperties).length) result.hProperties = node.data.hProperties
	if (node.data?.hName) result.hName = node.data.hName
	if (Array.isArray(node.children)) result.children = node.children.map(summarize)
	return result
}

async function inspect(markdown, experimental) {
	const processors = makeProcessors()
	const file = new VFile({ value: markdown })
	file.data.slug = "comment-feasibility"
	const tree = processors.markdown.parse(file)
	const parsed = summarize(tree)
	if (experimental) expandComments(tree, processors.markdown)
	const transformed = await processors.markdown.run(tree, file)
	const markdownTree = summarize(transformed)
	const htmlTree = await processors.html.run(transformed, file)
	return { parsed, markdownTree, toc: file.data.toc ?? null, htmlTree: summarize(htmlTree) }
}

for (const example of examples) {
	console.log(`\n========== ${example.name} ==========`)
	for (const experimental of [false, true]) {
		console.log(`\n--- ${experimental ? "EXPERIMENT" : "BASELINE"} ---`)
		try {
			console.log(JSON.stringify(await inspect(example.markdown, experimental), null, 2))
		} catch (error) {
			console.error(error)
		}
	}
}
