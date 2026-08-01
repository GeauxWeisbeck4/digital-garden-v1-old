---
title: "unist"
tags: ["javascript", "unist", "syntax-trees", "utilities", "unified-collective"]
publishDate: "2025-08-26T11:23:00Z"
description: "Notes on the universal abstract syntax tree specification and JavaScript open source tool, unified.js."
category: "JavaScript"
---

TODO: Make notes on unist Github README.md page.

\unist is a specification for syntax trees. It has a big ecosystem of utilities in JavaScript for working with these trees. It’s implemented by several other specifications.

This document may not be released. See releases for released documents. The latest released version is 3.0.0.
Contents

    Intro
        Syntax tree
        Where this specification fits
    Types
    Nodes
        Node
        Parent
        Literal
    Glossary
    Tree traversal
    Utilities
        List of utilities
    References
    Contribute
    Acknowledgments
    License

Intro

This document defines a general-purpose format for syntax trees. Development of unist started in July 2015. This specification is written in a Web IDL-like grammar.
Syntax tree

Syntax trees are representations of source code or even natural language. These trees are abstractions that make it possible to analyze, transform, and generate code.

Syntax trees come in two flavors:

    concrete syntax trees: structures that represent every detail (such as white-space in white-space insensitive languages)
    abstract syntax trees: structures that only represent details relating to the syntactic structure of code (such as ignoring whether a double or single quote was used in languages that support both, such as JavaScript).

This specification can express both abstract and concrete syntax trees.
Where this specification fits

unist is not intended to be self-sufficient. Instead, it is expected that other specifications implement unist and extend it to express language specific nodes. For example, see projects such as hast (for HTML), nlcst (for natural language), mdast (for Markdown), and xast (for XML).

unist relates to JSON in that compliant syntax trees can be expressed completely in JSON. However, unist is not limited to JSON and can be expressed in other data formats, such as XML.

unist relates to JavaScript in that it has a rich ecosystem of utilities for working with compliant syntax trees in JavaScript. The five most used utilities combined are downloaded thirty million times each month. However, unist is not limited to JavaScript and can be used in other programming languages.

unist relates to the unified, remark, rehype, and retext projects in that unist syntax trees are used throughout their ecosystems.

unist relates to the vfile project in that it accepts unist nodes for its message store, and that vfile can be a source file of a syntax tree.
Types

If you are using TypeScript, you can use the unist types by installing them with npm:

npm install @types/unist

Nodes

Syntactic units in unist syntax trees are called nodes, and implement the Node interface.
Node

interface Node {
  type: string
  data: Data?
  position: Position?
}

The type field is a non-empty string representing the variant of a node. This field can be used to determine the type a node implements.

The data field represents information from the ecosystem. The value of the data field implements the Data interface.

The position field represents the location of a node in a source document. The value of the position field implements the Position interface. The position field must not be present if a node is generated.

Specifications implementing unist are encouraged to define more fields. Ecosystems can define fields on Data.

Any value in unist must be expressible in JSON values: string, number, object, array, true, false, or null. This means that the syntax tree should be able to be converted to and from JSON and produce the same tree. For example, in JavaScript, a tree can be passed through JSON.parse(JSON.stringify(tree)) and result in the same tree.
Position

interface Position {
  start: Point
  end: Point
}

Position represents the location of a node in a source file.

The start field of Position represents the place of the first character of the parsed source region. The end field of Position represents the place of the first character after the parsed source region, whether it exists or not. The value of the start and end fields implement the Point interface.

If the syntactic unit represented by a node is not present in the source file at the time of parsing, the node is said to be generated and it must not have positional information.

For example, if the following value was represented as unist:

alpha
bravo

…the first word (alpha) would start at line 1, column 1, offset 0, and end at line 1, column 6, offset 5. The line feed would start at line 1, column 6, offset 5, and end at line 2, column 1, offset 6. The last word (bravo) would start at line 2, column 1, offset 6, and end at line 2, column 6, offset 11.
Point

interface Point {
  line: number >= 1
  column: number >= 1
  offset: number >= 0?
}

Point represents one place in a source file.

The line field (1-indexed integer) represents a line in a source file. The column field (1-indexed integer) represents a column in a source file. The offset field (0-indexed integer) represents a character in a source file.

The term character means a (UTF-16) code unit which is defined in the Web IDL specification.
Data

interface Data { }

Data represents information associated by the ecosystem with the node.

This space is guaranteed to never be specified by unist or specifications implementing unist.
Parent

interface Parent <: Node {
  children: [Node]
}

Nodes containing other nodes (said to be children) extend the abstract interface Parent (Node).

The children field is a list representing the children of a node.
Literal

interface Literal <: Node {
  value: any
}

Nodes containing a value extend the abstract interface Literal (Node).

The value field can contain any value.
Glossary
Tree

A tree is a node and all of its descendants (if any).
Child

Node X is child of node Y, if Y’s children include X.
Parent

Node X is parent of node Y, if Y is a child of X.
Index

The index of a child is its number of preceding siblings, or 0 if it has none.
Sibling

Node X is a sibling of node Y, if X and Y have the same parent (if any).

The previous sibling of a child is its sibling at its index minus 1.

The next sibling of a child is its sibling at its index plus 1.
Root

The root of a node is itself, if without parent, or the root of its parent.

The root of a tree is any node in that tree without parent.
Descendant

Node X is descendant of node Y, if X is a child of Y, or if X is a child of node Z that is a descendant of Y.

An inclusive descendant is a node or one of its descendants.
Ancestor

Node X is an ancestor of node Y, if Y is a descendant of X.

An inclusive ancestor is a node or one of its ancestors.
Head

The head of a node is its first child (if any).
Tail

The tail of a node is its last child (if any).
Leaf

A leaf is a node with no children.
Branch

A branch is a node with one or more children.
Generated

A node is generated if it does not have positional information.
Type

The type of a node is the value of its type field.
Positional information

The positional information of a node is the value of its position field.
File

A file is a source document that represents the original file that was parsed to produce the syntax tree. Positional information represents the place of a node in this file. Files are provided by the host environment and not defined by unist.

For example, see projects such as vfile.
Preorder

In preorder (NLR) is depth-first tree traversal that performs the following steps for each node N:

    N: visit N itself
    L: traverse head (then its next sibling, recursively moving forward until reaching tail)
    R: traverse tail

Postorder

In postorder (LRN) is depth-first tree traversal that performs the following steps for each node N:

    L: traverse head (then its next sibling, recursively moving forward until reaching tail)
    R: traverse tail
    N: visit N itself

Enter

Enter is a step right before other steps performed on a given node N when traversing a tree.

For example, when performing preorder traversal, enter is the first step taken, right before visiting N itself.
Exit

Exit is a step right after other steps performed on a given node N when traversing a tree.

For example, when performing preorder traversal, exit is the last step taken, right after traversing the tail of N.
Tree traversal

Tree traversal is a common task when working with a tree to search it. Tree traversal is typically either breadth-first or depth-first.

In the following examples, we’ll work with this tree:
Breadth-first traversal

Breadth-first traversal is visiting a node and all its siblings to broaden the search at that level, before traversing children.

For the syntax tree defined in the diagram, a breadth-first traversal first searches the root of the tree (A), then its children (B and F), then their children (C, D, E, and G).
Depth-first traversal

Alternatively, and more commonly, depth-first traversal is used. The search is first deepened, by traversing children, before traversing siblings.

For the syntax tree defined in the diagram, a depth-first traversal first searches the root of the tree (A), then one of its children (B or F), then their children (C, D, and E, or G).

For a given node N with children, a depth-first traversal performs three steps, simplified to only binary trees (every node has head and tail, but no other children):

    N: visit N itself
    L: traverse head
    R: traverse tail

These steps can be done in any order, but for non-binary trees, L and R occur together. If L is done before R, the traversal is called left-to-right traversal, otherwise it is called right-to-left traversal. In the case of non-binary trees, the other children between head and tail are processed in that order as well, so for left-to-right traversal, first head is traversed (L), then its next sibling is traversed, etcetera, until finally tail (R) is traversed.

Because L and R occur together for non-binary trees, we can produce four types of orders: NLR, NRL, LRN, RLN.

NLR and LRN (the two left-to-right traversal options) are most commonly used and respectively named preorder and postorder.

For the syntax tree defined in the diagram, preorder and postorder traversal thus first search the root of the tree (A), then its head (B), then its children from left-to-right (C, D, and then E). After all descendants of B are traversed, its next sibling (F) is traversed and then finally its only child (G).
Utilities

Utilities are functions that work with nodes.

There are several projects that deal with nodes from specifications implementing unist:

    hast utilities
    mdast utilities
    nlcst utilities
    xast utilities

List of utilities

    unist-util-ancestor — get the common ancestor of one or more nodes
    unist-util-assert — assert nodes
    unist-util-filter — create a new tree with all nodes that pass the given function
    unist-util-find — find a node by condition
    unist-util-find-after — find a node after another node
    unist-util-find-all-after — find nodes after another node or index
    unist-util-find-all-before — find nodes before another node or index
    unist-util-find-all-between — find nodes between two nodes or positions
    unist-util-find-before — find a node before another node
    unist-util-flat-filter — flat map version of unist-util-filter
    unist-util-flatmap — create a new tree by expanding a node into many
    unist-util-generated — check if a node is generated
    unist-util-index — index nodes by property or computed key
    unist-util-inspect — node inspector
    unist-util-is — check if a node passes a test
    unist-util-map — create a new tree by mapping nodes
    unist-util-modify-children — modify direct children of a parent
    unist-util-parents — parent references on nodes
    unist-util-position — get positional info of nodes
    unist-util-reduce — recursively reduce a tree
    unist-util-remove — remove nodes from trees
    unist-util-remove-position — remove positional info from trees
    unist-util-replace-all-between — replace nodes between two nodes or positions
    unist-util-select — select nodes with CSS-like selectors
    unist-util-size — calculate the number of nodes in a tree
    unist-util-source — get the source of a value (node or position) in a file
    unist-util-stringify-position — stringify a node, position, or point
    unist-util-visit — recursively walk over nodes
    unist-util-visit-parents — recursively walk over nodes, with a stack of parents
    unist-util-visit-children — visit direct children of a parent
    unist-util-visit-all-after — visit nodes after another node
    unist-builder — helper for creating trees

References

    JavaScript: ECMAScript Language Specification. Ecma International.
    JSON: The JavaScript Object Notation (JSON) Data Interchange Format, T. Bray. IETF.
    XML: Extensible Markup Language, T. Bray, J. Paoli, C. Sperberg-McQueen, E. Maler, F. Yergeau. W3C.
    Web IDL: Web IDL, C. McCormack. W3C.

Contribute

See contributing.md in syntax-tree/.github for ways to get started. See support.md for ways to get help.

A curated list of awesome syntax-tree, unist, hast, xast, mdast, and nlcst resources can be found in awesome syntax-tree.

This project has a code of conduct. By interacting with this repository, organization, or community you agree to abide by its terms.
Acknowledgments

The initial release of this project was authored by @wooorm.

Special thanks to @eush77 for their work, ideas, and incredibly valuable feedback! Thanks to @anandthakker, @anko, @arobase-che, @azu, @BarryThePenguin, @ben-eb, @blahah, @blakeembrey, @brainkim, @ChristianMurphy, @davidtheclark, @denysdovhan, @derhuerst, @dozoisch, @fazouane-marouane, @gibson042, @hrajchert, @ikatyang, @inklesspen, @izumin5210, @jasonLaster, @JDvorak, @jlevy, @justjake, @kmck, @kt3k, @KyleAMathews, @luca3m, @mattdesl, @muraken720, @mrzmmr, @nwtn, @rhysd, @Rokt33r, @Sarah-Seo, @sethvincent, @shawnbot, @simov, @staltz, @TitanSnow, @tmcw, and @vhf, for contributing to unist and related projects!
License

CC-BY-4.0 © Titus Wormer