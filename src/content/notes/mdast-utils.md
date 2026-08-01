---
title: "Mdast Utils"
tags: ["mdast", "utilities", "markdown", "syntax-trees", "unified-collective"]
publishDate: "2025-08-26T11:23:00Z"
description: "Notes about using the utility tools available to work with mdast syntax trees."
category: "Programming"
---

TODO: Make notes from README.md file on [mdast Github page](https://github.com/syntax-tree/mdast?tab=readme-ov-file).

Markdown Abstract Syntax Tree.

mdast is a specification for representing markdown in a syntax tree. It implements unist. It can represent several flavours of markdown, such as CommonMark and GitHub Flavored Markdown.

This document may not be released. See releases for released documents. The latest released version is 5.0.0.
Contents

    Introduction
        Where this specification fits
    Types
    Nodes (abstract)
        Literal
        Parent
    Nodes
        Blockquote
        Break
        Code
        Definition
        Emphasis
        Heading
        Html
        Image
        ImageReference
        InlineCode
        Link
        LinkReference
        List
        ListItem
        Paragraph
        Root
        Strong
        Text
        ThematicBreak
    Mixin
        Alternative
        Association
        Reference
        Resource
    Enumeration
        referenceType
    Content model
        Content
        FlowContent
        ListContent
        PhrasingContent
    Extensions
        GFM
        Frontmatter
        MDX
    Glossary
    List of utilities
    References
    Security
    Related
    Contribute
    Acknowledgments
    License

Introduction

This document defines a format for representing markdown as an abstract syntax tree. Development of mdast started in July 2014, in remark, before unist existed. This specification is written in a Web IDL-like grammar.
Where this specification fits

mdast extends unist, a format for syntax trees, to benefit from its ecosystem of utilities.

mdast relates to JavaScript in that it has a rich ecosystem of utilities for working with compliant syntax trees in JavaScript. However, mdast is not limited to JavaScript and can be used in other programming languages.

mdast relates to the unified and remark projects in that mdast syntax trees are used throughout their ecosystems.
Types

If you are using TypeScript, you can use the unist types by installing them with npm:

npm install @types/mdast

Nodes (abstract)
Literal

interface Literal <: UnistLiteral {
  value: string
}

Literal (UnistLiteral) represents an abstract interface in mdast containing a value.

Its value field is a string.
Parent

interface Parent <: UnistParent {
  children: [MdastContent]
}

Parent (UnistParent) represents an abstract interface in mdast containing other nodes (said to be children).

Its content is limited to only other mdast content.
Nodes
Blockquote

interface Blockquote <: Parent {
  type: 'blockquote'
  children: [FlowContent]
}

Blockquote (Parent) represents a section quoted from somewhere else.

Blockquote can be used where flow content is expected. Its content model is also flow content.

For example, the following markdown:

> Alpha bravo charlie.

Yields:

{
  type: 'blockquote',
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'Alpha bravo charlie.'}]
  }]
}

Break

interface Break <: Node {
  type: 'break'
}

Break (Node) represents a line break, such as in poems or addresses.

Break can be used where phrasing content is expected. It has no content model.

For example, the following markdown:

foo··
bar

Yields:

{
  type: 'paragraph',
  children: [
    {type: 'text', value: 'foo'},
    {type: 'break'},
    {type: 'text', value: 'bar'}
  ]
}

Code

interface Code <: Literal {
  type: 'code'
  lang: string?
  meta: string?
}

Code (Literal) represents a block of preformatted text, such as ASCII art or computer code.

Code can be used where flow content is expected. Its content is represented by its value field.

This node relates to the phrasing content concept InlineCode.

A lang field can be present. It represents the language of computer code being marked up.

If the lang field is present, a meta field can be present. It represents custom information relating to the node.

For example, the following markdown:

    foo()

Yields:

{
  type: 'code',
  lang: null,
  meta: null,
  value: 'foo()'
}

And the following markdown:

```js highlight-line="2"
foo()
bar()
baz()
```

Yields:

{
  type: 'code',
  lang: 'javascript',
  meta: 'highlight-line="2"',
  value: 'foo()\nbar()\nbaz()'
}

Definition

interface Definition <: Node {
  type: 'definition'
}

Definition includes Association
Definition includes Resource

Definition (Node) represents a resource.

Definition can be used where content is expected. It has no content model.

Definition includes the mixins Association and Resource.

Definition should be associated with LinkReferences and ImageReferences.

For example, the following markdown:

[Alpha]: https://example.com

Yields:

{
  type: 'definition',
  identifier: 'alpha',
  label: 'Alpha',
  url: 'https://example.com',
  title: null
}

Emphasis

interface Emphasis <: Parent {
  type: 'emphasis'
  children: [PhrasingContent]
}

Emphasis (Parent) represents stress emphasis of its contents.

Emphasis can be used where phrasing content is expected. Its content model is phrasing content.

For example, the following markdown:

*alpha* _bravo_

Yields:

{
  type: 'paragraph',
  children: [
    {
      type: 'emphasis',
      children: [{type: 'text', value: 'alpha'}]
    },
    {type: 'text', value: ' '},
    {
      type: 'emphasis',
      children: [{type: 'text', value: 'bravo'}]
    }
  ]
}

Heading

interface Heading <: Parent {
  type: 'heading'
  depth: 1 <= number <= 6
  children: [PhrasingContent]
}

Heading (Parent) represents a heading of a section.

Heading can be used where flow content is expected. Its content model is phrasing content.

A depth field must be present. A value of 1 is said to be the highest rank and 6 the lowest.

For example, the following markdown:

# Alpha

Yields:

{
  type: 'heading',
  depth: 1,
  children: [{type: 'text', value: 'Alpha'}]
}

Html

interface Html <: Literal {
  type: 'html'
}

Html (Literal) represents a fragment of raw HTML.

Html can be used where flow or phrasing content is expected. Its content is represented by its value field.

Html nodes do not have the restriction of being valid or complete HTML ([HTML]) constructs.

For example, the following markdown:

<div>

Yields:

{type: 'html', value: '<div>'}

Image

interface Image <: Node {
  type: 'image'
}

Image includes Resource
Image includes Alternative

Image (Node) represents an image.

Image can be used where phrasing content is expected. It has no content model, but is described by its alt field.

Image includes the mixins Resource and Alternative.

For example, the following markdown:

![alpha](https://example.com/favicon.ico "bravo")

Yields:

{
  type: 'image',
  url: 'https://example.com/favicon.ico',
  title: 'bravo',
  alt: 'alpha'
}

ImageReference

interface ImageReference <: Node {
  type: 'imageReference'
}

ImageReference includes Reference
ImageReference includes Alternative

ImageReference (Node) represents an image through association, or its original source if there is no association.

ImageReference can be used where phrasing content is expected. It has no content model, but is described by its alt field.

ImageReference includes the mixins Reference and Alternative.

ImageReference should be associated with a Definition.

For example, the following markdown:

![alpha][bravo]

Yields:

{
  type: 'imageReference',
  identifier: 'bravo',
  label: 'bravo',
  referenceType: 'full',
  alt: 'alpha'
}

InlineCode

interface InlineCode <: Literal {
  type: 'inlineCode'
}

InlineCode (Literal) represents a fragment of computer code, such as a file name, computer program, or anything a computer could parse.

InlineCode can be used where phrasing content is expected. Its content is represented by its value field.

This node relates to the flow content concept Code.

For example, the following markdown:

`foo()`

Yields:

{type: 'inlineCode', value: 'foo()'}

Link

interface Link <: Parent {
  type: 'link'
  children: [PhrasingContent]
}

Link includes Resource

Link (Parent) represents a hyperlink.

Link can be used where phrasing content is expected. Its content model is also phrasing content.

Link includes the mixin Resource.

For example, the following markdown:

[alpha](https://example.com "bravo")

Yields:

{
  type: 'link',
  url: 'https://example.com',
  title: 'bravo',
  children: [{type: 'text', value: 'alpha'}]
}

LinkReference

interface LinkReference <: Parent {
  type: 'linkReference'
  children: [PhrasingContent]
}

LinkReference includes Reference

LinkReference (Parent) represents a hyperlink through association, or its original source if there is no association.

LinkReference can be used where phrasing content is expected. Its content model is also phrasing content.

LinkReference includes the mixin Reference.

LinkReferences should be associated with a Definition.

For example, the following markdown:

[alpha][Bravo]

Yields:

{
  type: 'linkReference',
  identifier: 'bravo',
  label: 'Bravo',
  referenceType: 'full',
  children: [{type: 'text', value: 'alpha'}]
}

List

interface List <: Parent {
  type: 'list'
  ordered: boolean?
  start: number?
  spread: boolean?
  children: [ListContent]
}

List (Parent) represents a list of items.

List can be used where flow content is expected. Its content model is list content.

An ordered field can be present. It represents that the items have been intentionally ordered (when true), or that the order of items is not important (when false or not present).

A start field can be present. It represents, when the ordered field is true, the starting number of the list.

A spread field can be present. It represents that one or more of its children are separated with a blank line from its siblings (when true), or not (when false or not present).

For example, the following markdown:

1. foo

Yields:

{
  type: 'list',
  ordered: true,
  start: 1,
  spread: false,
  children: [{
    type: 'listItem',
    spread: false,
    children: [{
      type: 'paragraph',
      children: [{type: 'text', value: 'foo'}]
    }]
  }]
}

ListItem

interface ListItem <: Parent {
  type: 'listItem'
  spread: boolean?
  children: [FlowContent]
}

ListItem (Parent) represents an item in a List.

ListItem can be used where list content is expected. Its content model is flow content.

A spread field can be present. It represents that the item contains two or more children separated by a blank line (when true), or not (when false or not present).

For example, the following markdown:

* bar

Yields:

{
  type: 'listItem',
  spread: false,
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'bar'}]
  }]
}

Paragraph

interface Paragraph <: Parent {
  type: 'paragraph'
  children: [PhrasingContent]
}

Paragraph (Parent) represents a unit of discourse dealing with a particular point or idea.

Paragraph can be used where content is expected. Its content model is phrasing content.

For example, the following markdown:

Alpha bravo charlie.

Yields:

{
  type: 'paragraph',
  children: [{type: 'text', value: 'Alpha bravo charlie.'}]
}

Root

interface Root <: Parent {
  type: 'root'
}

Root (Parent) represents a document.

Root can be used as the root of a tree, never as a child. Its content model is not limited to flow content, but instead can contain any mdast content with the restriction that all content must be of the same category.
Strong

interface Strong <: Parent {
  type: 'strong'
  children: [PhrasingContent]
}

Strong (Parent) represents strong importance, seriousness, or urgency for its contents.

Strong can be used where phrasing content is expected. Its content model is phrasing content.

For example, the following markdown:

**alpha** __bravo__

Yields:

{
  type: 'paragraph',
  children: [
    {
      type: 'strong',
      children: [{type: 'text', value: 'alpha'}]
    },
    {type: 'text', value: ' '},
    {
      type: 'strong',
      children: [{type: 'text', value: 'bravo'}]
    }
  ]
}

Text

interface Text <: Literal {
  type: 'text'
}

Text (Literal) represents everything that is just text.

Text can be used where phrasing content is expected. Its content is represented by its value field.

For example, the following markdown:

Alpha bravo charlie.

Yields:

{type: 'text', value: 'Alpha bravo charlie.'}

ThematicBreak

interface ThematicBreak <: Node {
  type: 'thematicBreak'
}

ThematicBreak (Node) represents a thematic break, such as a scene change in a story, a transition to another topic, or a new document.

ThematicBreak can be used where flow content is expected. It has no content model.

For example, the following markdown:

***

Yields:

{type: 'thematicBreak'}

Mixin
Alternative

interface mixin Alternative {
  alt: string?
}

Alternative represents a node with a fallback

An alt field should be present. It represents equivalent content for environments that cannot represent the node as intended.
Association

interface mixin Association {
  identifier: string
  label: string?
}

Association represents an internal relation from one node to another.

An identifier field must be present. It can match another node. identifier is a source value: character escapes and character references are not parsed. Its value must be normalized.

A label field can be present. label is a string value: it works just like title on a link or a lang on code: character escapes and character references are parsed.

To normalize a value, collapse markdown whitespace ([\t\n\r ]+) to a space, trim the optional initial and/or final space, and perform case-folding.

Whether the value of identifier (or normalized label if there is no identifier) is expected to be a unique identifier or not depends on the type of node including the Association. An example of this is that they should be unique on Definition, whereas multiple LinkReferences can be non-unique to be associated with one definition.
Reference

interface mixin Reference {
  referenceType: string
}

Reference includes Association

Reference represents a marker that is associated to another node.

A referenceType field must be present. Its value must be a referenceType. It represents the explicitness of the reference.
Resource

interface mixin Resource {
  url: string
  title: string?
}

Resource represents a reference to resource.

A url field must be present. It represents a URL to the referenced resource.

A title field can be present. It represents advisory information for the resource, such as would be appropriate for a tooltip.
Enumeration
referenceType

enum referenceType {
  'shortcut' | 'collapsed' | 'full'
}

referenceType represents the explicitness of a reference.

    shortcut: the reference is implicit, its identifier inferred from its content
    collapsed: the reference is explicit, its identifier inferred from its content
    full: the reference is explicit, its identifier explicitly set

Content model

type MdastContent = FlowContent | ListContent | PhrasingContent

Each node in mdast falls into one or more categories of Content that group nodes with similar characteristics together.
Content

type Content = Definition | Paragraph

Content represents runs of text that form definitions and paragraphs.
FlowContent

type FlowContent =
  Blockquote | Code | Heading | Html | List | ThematicBreak | Content

Flow content represent the sections of document.
ListContent

type ListContent = ListItem

List content represent the items in a list.
PhrasingContent

type PhrasingContent = Break | Emphasis | Html | Image | ImageReference
  | InlineCode | Link | LinkReference | Strong | Text

Phrasing content represent the text in a document and its markup.
Extensions

Markdown syntax is often extended. It is not a goal of this specification to list all possible extensions. However, a short list of frequently used extensions are shown below.
GFM

The following interfaces are found in GitHub Flavored Markdown.
Delete

interface Delete <: Parent {
  type: 'delete'
  children: [PhrasingContent]
}

Delete (Parent) represents contents that are no longer accurate or no longer relevant.

Delete can be used where phrasing content is expected. Its content model is phrasing content.

For example, the following markdown:

~~alpha~~

Yields:

{
  type: 'delete',
  children: [{type: 'text', value: 'alpha'}]
}

ListItem (GFM)

interface ListItemGfm <: ListItem {
  checked: boolean?
}

In GFM, a checked field can be present. It represents whether the item is done (when true), not done (when false), or indeterminate or not applicable (when null or not present).
FootnoteDefinition

interface FootnoteDefinition <: Parent {
  type: 'footnoteDefinition'
  children: [FlowContent]
}

FootnoteDefinition includes Association

FootnoteDefinition (Parent) represents content relating to the document that is outside its flow.

FootnoteDefinition can be used where flow content is expected. Its content model is also flow content.

FootnoteDefinition includes the mixin Association.

FootnoteDefinition should be associated with FootnoteReferences.

For example, the following markdown:

[^alpha]: bravo and charlie.

Yields:

{
  type: 'footnoteDefinition',
  identifier: 'alpha',
  label: 'alpha',
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'bravo and charlie.'}]
  }]
}

FootnoteReference

interface FootnoteReference <: Node {
  type: 'footnoteReference'
}

FootnoteReference includes Association

FootnoteReference (Node) represents a marker through association.

FootnoteReference can be used where phrasing content is expected. It has no content model.

FootnoteReference includes the mixin Association.

FootnoteReference should be associated with a FootnoteDefinition.

For example, the following markdown:

[^alpha]

Yields:

{
  type: 'footnoteReference',
  identifier: 'alpha',
  label: 'alpha'
}

Table

interface Table <: Parent {
  type: 'table'
  align: [alignType]?
  children: [TableContent]
}

Table (Parent) represents two-dimensional data.

Table can be used where flow content is expected. Its content model is table content.

The head of the node represents the labels of the columns.

An align field can be present. If present, it must be a list of alignTypes. It represents how cells in columns are aligned.

For example, the following markdown:

| foo | bar |
| :-- | :-: |
| baz | qux |

Yields:

{
  type: 'table',
  align: ['left', 'center'],
  children: [
    {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'foo'}]
        },
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'bar'}]
        }
      ]
    },
    {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'baz'}]
        },
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'qux'}]
        }
      ]
    }
  ]
}

TableCell

interface TableCell <: Parent {
  type: 'tableCell'
  children: [PhrasingContent]
}

TableCell (Parent) represents a header cell in a Table, if its parent is a head, or a data cell otherwise.

TableCell can be used where row content is expected. Its content model is phrasing content excluding Break nodes.

For an example, see Table.
TableRow

interface TableRow <: Parent {
  type: 'tableRow'
  children: [RowContent]
}

TableRow (Parent) represents a row of cells in a table.

TableRow can be used where table content is expected. Its content model is row content.

If the node is a head, it represents the labels of the columns for its parent Table.

For an example, see Table.
alignType

enum alignType {
  'left' | 'right' | 'center' | null
}

alignType represents how phrasing content is aligned ([CSSTEXT]).

    'left': See the left value of the text-align CSS property
    'right': See the right value of the text-align CSS property
    'center': See the center value of the text-align CSS property
    null: phrasing content is aligned as defined by the host environment

FlowContent (GFM)

type FlowContentGfm = FootnoteDefinition | Table | FlowContent

ListContent (GFM)

type ListContentGfm = ListItemGfm

PhrasingContent (GFM)

type PhrasingContentGfm = FootnoteReference | Delete | PhrasingContent

RowContent

type RowContent = TableCell

Row content represent the cells in a row.
TableContent

type TableContent = TableRow

Table content represent the rows in a table.
Frontmatter

The following interfaces are found with YAML.
Yaml

interface Yaml <: Literal {
  type: 'yaml'
}

Yaml (Literal) represents a collection of metadata for the document in the YAML ([YAML]) data serialisation language.

Yaml can be used where frontmatter content is expected. Its content is represented by its value field.

For example, the following markdown:

---
foo: bar
---

Yields:

{type: 'yaml', value: 'foo: bar'}

FrontmatterContent

type FrontmatterContent = Yaml

Frontmatter content represent out-of-band information about the document.

If frontmatter is present, it must be limited to one node in the tree, and can only exist as a head.
FlowContent (frontmatter)

type FlowContentFrontmatter = FrontmatterContent | FlowContent

MDX

See remark-mdx.
Glossary

See the unist glossary.
List of utilities

See the unist list of utilities for more utilities.

    mdast-add-list-metadata — enhance the metadata of list and listItem nodes
    mdast-util-assert — assert nodes
    mdast-builder — build mdast structures with composable functions
    mdast-comment-marker — parse a comment marker
    mdast-util-compact — make a tree compact
    mdast-util-definitions — find definition nodes
    mdast-util-directive — parse and serialize directives
    mdast-util-find-and-replace — find and replace text
    mdast-flatten-image-paragraphs — flatten paragraph and image into one image node
    mdast-flatten-listitem-paragraphs — flatten listItem and (nested) paragraph into one listItem node
    mdast-flatten-nested-lists — transform a tree to avoid lists in lists
    mdast-util-from-adf — build mdast syntax tree from Atlassian Document Format (ADF)
    mdast-util-from-markdown — parse markdown
    mdast-util-frontmatter — parse and serialize frontmatter
    mdast-util-gfm — parse and serialize GFM
    mdast-util-gfm-autolink-literal — parse and serialize GFM autolink literals
    mdast-util-gfm-footnote — parse and serialize GFM footnotes
    mdast-util-gfm-strikethrough — parse and serialize GFM strikethrough
    mdast-util-gfm-table — parse and serialize GFM tables
    mdast-util-gfm-task-list-item — parse and serialize GFM task list items
    mdast-util-gridtables — parse and serialize gridtables
    mdast-util-heading-range — markdown heading as ranges
    mdast-util-heading-style — get the style of a heading node
    mdast-util-hidden — prevent nodes from being seen by transformers.
    mdast-util-math — parse and serialize math
    mdast-util-mdx — parse and serialize MDX
    mdast-util-mdx-expression — parse and serialize MDX expressions
    mdast-util-mdx-jsx — parse and serialize MDX JSX
    mdast-util-mdxjs-esm — parse and serialize MDX ESM
    mdast-move-images-to-root — move image nodes up the tree until they are direct children of the root
    mdast-normalize-headings — ensure at most one top-level heading is in the document
    mdast-util-phrasing — check if a node is phrasing content
    mdast-squeeze-paragraphs — remove empty paragraphs
    mdast-util-toc — generate a table of contents from a tree
    mdast-util-to-hast — transform to hast
    mdast-util-to-markdown — serialize markdown
    mdast-util-to-nlcst — transform to nlcst
    mdast-util-to-string — get the plain text content of a node
    mdast-zone — HTML comments as ranges or markers

References

    unist: Universal Syntax Tree. T. Wormer; et al.
    Markdown: Markdown. J. Gruber.
    CommonMark: CommonMark. J. MacFarlane; et al.
    GFM: GitHub Flavored Markdown. GitHub.
    HTML: HTML Standard, A. van Kesteren; et al. WHATWG.
    CSSTEXT: CSS Text, CSS Text, E. Etemad, K. Ishii. W3C.
    JavaScript: ECMAScript Language Specification. Ecma International.
    YAML: YAML Ain’t Markup Language, O. Ben-Kiki, C. Evans, I. döt Net.
    Web IDL: Web IDL, C. McCormack. W3C.

Security

As mdast can contain HTML and be used to represent HTML, and improper use of HTML can open you up to a cross-site scripting (XSS) attack, improper use of mdast is also unsafe. When transforming to HTML (typically through hast), always be careful with user input and use hast-util-santize to make the hast tree safe.
Related

    hast — Hypertext Abstract Syntax Tree format
    nlcst — Natural Language Concrete Syntax Tree format
    xast — Extensible Abstract Syntax Tree

Contribute

See contributing.md in syntax-tree/.github for ways to get started. See support.md for ways to get help. Ideas for new utilities and tools can be posted in syntax-tree/ideas.

A curated list of awesome syntax-tree, unist, mdast, hast, xast, and nlcst resources, can be found in awesome syntax-tree.

This project has a code of conduct. By interacting with this repository, organization, or community you agree to abide by its terms.
Acknowledgments

The initial release of this project was authored by @wooorm.

Special thanks to @eush77 for their work, ideas, and incredibly valuable feedback!

Thanks to @anandthakker, @arobase-che, @BarryThePenguin, @chinesedfan, @ChristianMurphy, @craftzdog, @d4rekanguok, @detj, @dominictarr, @gkatsev, @Hamms, @Hypercubed, @ikatyang, @izumin5210, @jasonLaster, @Justineo, @justjake, @KyleAMathews, @laysent, @macklinu, @mike-north, @Murderlon, @nevik, @Rokt33r, @rhysd, @rubys, @Sarah-Seo, @sethvincent, @silvenon, @simov, @staltz, @stefanprobst, @tmcw, and @vhf for contributing to mdast and related projects!
License

CC-BY-4.0 © Titus Wormer