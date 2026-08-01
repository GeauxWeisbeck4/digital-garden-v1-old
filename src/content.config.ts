import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';


function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
};

const searchable = z.object({
  title: z.string().max(65),
  description: z.string().optional(),
  autodescription: z.boolean().default(true),
  draft: z.boolean().default(false),
})

const titleSchema = z.string().max(60);

const baseSchema = z.object({
  title: titleSchema,
});


const post = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: './src/content/posts' }),
  schema: ({ image }) =>
    searchable.extend({
      coverImage: z.object({
        alt: z.string().default("weisgarden"),
        src: image(),
      })
      .optional(),
      ogImage: z.string().optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      pinned: z.boolean().default(false),
      categories: z.array(reference('category')).default([]).optional(),
    }),
});

const journal = defineCollection({
  loader: glob({ base: './src/content/journals',
  pattern: '**/*.{md,mdx}' }),
  schema:
    searchable.extend({
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      pinned: z.boolean().default(false),
      monthCollection: z.enum(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]),
  }),
});

const note = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: searchable.extend({
    description: z.string().optional(),
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    publishDate: z
      .string()
      .datetime({ offset: true })
      .transform((val) => new Date(val)),
    categories: z.array(z.string()).default([]).transform(removeDupsAndLowerCase).optional(),
  }),
});

const category = defineCollection({
  loader: glob({ base: "./src/content/categories", pattern: "**/*.{md,mdx}" }),
  schema: searchable.extend({
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
    relatedPosts: z.array(reference("posts")).default([]).optional(),
    relatedNotes: z.array(reference("notes")).default([]).optional(),
    id: z.string().optional(),
  }),
});

const tag = defineCollection({
  loader: glob({ base: "./src/content/tags", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: titleSchema.optional(),
    description: z.string().optional(),
    categories: z.array(z.string()).default([]).transform(removeDupsAndLowerCase).optional(),
  }),
});



export const collections = { post, journal, note, category, tag };