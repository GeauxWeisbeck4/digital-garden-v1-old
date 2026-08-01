---
title: "vfile"
tags: ["metadata", "vfile", "utilities", "unified-collective"]
publishDate: "2025-08-26T11:23:00Z"
description: "Notes on the unified.js vfile open source project."
category: "JavaScript"
---

TODO: Make notes on README.md for vfile

vfile is a small and browser friendly virtual file format that tracks metadata about files (such as its path and value) and lint messages.
Contents

    unified
    What is this?
    When should I use this?
    Install
    Use
    API
        VFile(options?)
        file.cwd
        file.data
        file.history
        file.messages
        file.value
        file.basename
        file.dirname
        file.extname
        file.path
        file.stem
        VFile#fail(reason[, options])
        VFile#info(reason[, options])
        VFile#message(reason[, options])
        VFile#toString(encoding?)
        Compatible
        Data
        DataMap
        Map
        MessageOptions
        Options
        Reporter
        ReporterSettings
        Value
        Well-known
    List of utilities
    Reporters
    Types
    Compatibility
    Contribute
    Sponsor
    Acknowledgments
    License

unified

vfile is part of the unified collective.

    for more about us, see unifiedjs.com
    for how the collective is governed, see unifiedjs/collective

What is this?

This package provides a virtual file format. It exposes an API to access the file value, path, metadata about the file, and specifically supports attaching lint messages and errors to certain places in these files.
When should I use this?

The virtual file format is useful when dealing with the concept of files in places where you might not be able to access the file system. The message API is particularly useful when making things that check files (as in, linting).

vfile is made for unified, which amongst other things checks files. However, vfile can be used in other projects that deal with parsing, transforming, and serializing data, to build linters, compilers, static site generators, and other build tools.

This is different from the excellent vinyl in that vfile has a smaller API, a smaller size, and focuses on messages.
Install

This package is ESM only. In Node.js (version 16+), install with npm:

npm install vfile

In Deno with esm.sh:

import {VFile} from 'https://esm.sh/vfile@6'

In browsers with esm.sh:

<script type="module">
  import {VFile} from 'https://esm.sh/vfile@6?bundle'
</script>

Use

import {VFile} from 'vfile'

const file = new VFile({
  path: '~/example.txt',
  value: 'Alpha *braavo* charlie.'
})

console.log(file.path) // => '~/example.txt'
console.log(file.dirname) // => '~'

file.extname = '.md'

console.log(file.basename) // => 'example.md'

file.basename = 'index.text'

console.log(file.history) // => ['~/example.txt', '~/example.md', '~/index.text']

file.message('Unexpected unknown word `braavo`, did you mean `bravo`?', {
  place: {line: 1, column: 8},
  source: 'spell',
  ruleId: 'typo'
})

console.log(file.messages)

Yields:

[
  [~/index.text:1:8: Unexpected unknown word `braavo`, did you mean `bravo`?] {
    ancestors: undefined,
    cause: undefined,
    column: 8,
    fatal: false,
    line: 1,
    place: { line: 1, column: 8 },
    reason: 'Unexpected unknown word `braavo`, did you mean `bravo`?',
    ruleId: 'typo',
    source: 'spell',
    file: '~/index.text'
  }
]

API

This package exports the identifier VFile. There is no default export.
VFile(options?)

Create a new virtual file.

options is treated as:

    string or Uint8Array — {value: options}
    URL — {path: options}
    VFile — shallow copies its data over to the new file
    object — all fields are shallow copied over to the new file

Path related fields are set in the following order (least specific to most specific): history, path, basename, stem, extname, dirname.

You cannot set dirname or extname without setting either history, path, basename, or stem too.
Parameters

    options (Compatible, optional) — file value

Returns

New instance (VFile).
Example

new VFile()
new VFile('console.log("alpha");')
new VFile(new Uint8Array([0x65, 0x78, 0x69, 0x74, 0x20, 0x31]))
new VFile({path: path.join('path', 'to', 'readme.md')})
new VFile({stem: 'readme', extname: '.md', dirname: path.join('path', 'to')})
new VFile({other: 'properties', are: 'copied', ov: {e: 'r'}})

file.cwd

Base of path (string, default: process.cwd() or '/' in browsers).
file.data

Place to store custom info (Record<string, unknown>, default: {}).

It’s OK to store custom data directly on the file but moving it to data is recommended.
file.history

List of file paths the file moved between (Array<string>).

The first is the original path and the last is the current path.
file.messages

List of messages associated with the file (Array<VFileMessage>).
file.value

Raw value (Uint8Array, string, undefined).
file.basename

Get or set the basename (including extname) (string?, example: 'index.min.js').

Cannot contain path separators ('/' on unix, macOS, and browsers, '\' on windows). Cannot be nullified (use file.path = file.dirname instead).
file.dirname

Get or set the parent path (string?, example: '~').

Cannot be set if there’s no path yet.
file.extname

Get or set the extname (including dot) (string?, example: '.js').

Cannot contain path separators ('/' on unix, macOS, and browsers, '\' on windows). Cannot be set if there’s no path yet.
file.path

Get or set the full path (string?, example: '~/index.min.js').

Cannot be nullified. You can set a file URL (a URL object with a file: protocol) which will be turned into a path with url.fileURLToPath.
file.stem

Get or set the stem (basename w/o extname) (string?, example: 'index.min').

Cannot contain path separators ('/' on unix, macOS, and browsers, '\' on windows). Cannot be nullified.
VFile#fail(reason[, options])

Create a fatal message for reason associated with the file.

The fatal field of the message is set to true (error; file not usable) and the file field is set to the current file path. The message is added to the messages field on file.

    🪦 Note: also has obsolete signatures.

Parameters

    reason (string) — reason for message, should use markdown
    options (MessageOptions, optional) — configuration

Returns

Nothing (never).
Throws

Message (VFileMessage).
VFile#info(reason[, options])

Create an info message for reason associated with the file.

The fatal field of the message is set to undefined (info; change likely not needed) and the file field is set to the current file path. The message is added to the messages field on file.

    🪦 Note: also has obsolete signatures.

Parameters

    reason (string) — reason for message, should use markdown
    options (MessageOptions, optional) — configuration

Returns

Message (VFileMessage).
VFile#message(reason[, options])

Create a message for reason associated with the file.

The fatal field of the message is set to false (warning; change may be needed) and the file field is set to the current file path. The message is added to the messages field on file.

    🪦 Note: also has obsolete signatures.

Parameters

    reason (string) — reason for message, should use markdown
    options (MessageOptions, optional) — configuration

Returns

Message (VFileMessage).
VFile#toString(encoding?)

Serialize the file.

    Note: which encodings are supported depends on the engine. For info on Node.js, see: https://nodejs.org/api/util.html#whatwg-supported-encodings.

Parameters

    encoding (string, default: 'utf8') — character encoding to understand value as when it’s a Uint8Array

Returns

Serialized file (string).
Compatible

Things that can be passed to the constructor (TypeScript type).
Type

type Compatible = Options | URL | VFile | Value

Data

Custom info (TypeScript type).

Known attributes can be added to DataMap.
Type

type Data = Record<string, unknown> & Partial<DataMap>

DataMap

This map registers the type of the data key of a VFile (TypeScript type).

This type can be augmented to register custom data types.
Type

interface DataMap {}

Example

declare module 'vfile' {
  interface DataMap {
    // `file.data.name` is typed as `string`
    name: string
  }
}

Map

Raw source map (TypeScript type).

See source-map.
Fields

    version (number) — which version of the source map spec this map is following
    sources (Array<string>) — an array of URLs to the original source files
    names (Array<string>) — an array of identifiers which can be referenced by individual mappings
    sourceRoot (string, optional) — the URL root from which all sources are relative
    sourcesContent (Array<string>, optional) — an array of contents of the original source files
    mappings (string) — a string of base64 VLQs which contain the actual mappings
    file (string) — the generated file this source map is associated with

MessageOptions

Options to create messages (TypeScript type).

See Options in vfile-message.
Options

An object with arbitrary fields and the following known fields (TypeScript type).
Fields

    basename (string, optional) — set basename (name)
    cwd (string, optional) — set cwd (working directory)
    data (Data, optional) — set data (associated info)
    dirname (string, optional) — set dirname (path w/o basename)
    extname (string, optional) — set extname (extension with dot)
    history (Array<string>, optional) — set history (paths the file moved between)
    path (URL | string, optional) — set path (current path)
    stem (string, optional) — set stem (name without extension)
    value (Value, optional) — set value (the contents of the file)

Reporter

Type for a reporter (TypeScript type).
Type

type Reporter<Settings = ReporterSettings> = (
  files: Array<VFile>,
  options: Settings
) => string

ReporterSettings

Configuration for reporters (TypeScript type).
Type

type ReporterSettings = Record<string, unknown>

Value

Contents of the file (TypeScript type).

Can either be text or a Uint8Array structure.
Type

type Value = Uint8Array | string

Well-known

The following fields are considered “non-standard”, but they are allowed, and some utilities use them:

    map (Map) — source map; this type is equivalent to the RawSourceMap type from the source-map module
    result (unknown) — custom, non-string, compiled, representation; this is used by unified to store non-string results; one example is when turning markdown into React nodes
    stored (boolean) — whether a file was saved to disk; this is used by vfile reporters

There are also well-known fields on messages, see them in a similar section of vfile-message.

List of utilities

    convert-vinyl-to-vfile — transform from Vinyl
    to-vfile — create a file from a file path and read and write to the file system
    vfile-find-down — find files by searching the file system downwards
    vfile-find-up — find files by searching the file system upwards
    vfile-glob — find files by glob patterns
    vfile-is — check if a file passes a test
    vfile-location — convert between positional and offset locations
    vfile-matter — parse the YAML front matter
    vfile-message — create a file message
    vfile-messages-to-vscode-diagnostics — transform file messages to VS Code diagnostics
    vfile-mkdirp — make sure the directory of a file exists on the file system
    vfile-rename — rename the path parts of a file
    vfile-sort — sort messages by line/column
    vfile-statistics — count messages per category: failures, warnings, etc
    vfile-to-eslint — convert to ESLint formatter compatible output

    👉 Note: see unist for projects that work with nodes.

Reporters

    vfile-reporter — create a report
    vfile-reporter-json — create a JSON report
    vfile-reporter-folder-json — create a JSON representation of vfiles
    vfile-reporter-pretty — create a pretty report
    vfile-reporter-junit — create a jUnit report
    vfile-reporter-position — create a report with content excerpts

    👉 Note: want to make your own reporter? Reporters must accept Array<VFile> as their first argument, and return string. Reporters may accept other values too, in which case it’s suggested to stick to vfile-reporters interface.

Types

This package is fully typed with TypeScript. It exports the additional types Compatible, Data, DataMap, Map, MessageOptions, Options, Reporter, ReporterSettings, and Value.
Compatibility

Projects maintained by the unified collective are compatible with maintained versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of Node. This means we try to keep the current release line, vfile@^6, compatible with Node.js 16.
Contribute

See contributing.md in vfile/.github for ways to get started. See support.md for ways to get help.

This project has a code of conduct. By interacting with this repository, organization, or community you agree to abide by its terms.
Sponsor

Support this effort and give back by sponsoring on OpenCollective!
Vercel

	Motif

	HashiCorp

	GitBook

	Gatsby

Netlify

	Coinbase

	ThemeIsle

	Expo

	Boost Note

	Markdown Space

	Holloway

		

You?

Acknowledgments

The initial release of this project was authored by @wooorm.

Thanks to @contra, @phated, and others for their work on Vinyl, which was a huge inspiration.

Thanks to @brendo, @shinnn, @KyleAMathews, @sindresorhus, and @denysdovhan for contributing commits since!
License

MIT © Titus Wormer