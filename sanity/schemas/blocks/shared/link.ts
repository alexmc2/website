// sanity/schemas/blocks/shared/link.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "isExternal",
      type: "boolean",
      title: "Is External",
      initialValue: false,
    }),
    defineField({
      name: "internalLink",
      type: "reference",
      title: "Internal Link",
      to: [{ type: "page" }, { type: "post" }],
      hidden: ({ parent }) => parent?.isExternal,
    }),
    defineField({
      name: "anchor",
      type: "string",
      title: "Section Anchor",
      description:
        "Optional anchor ID to scroll to a section on the selected page (e.g. menus).",
      hidden: ({ parent }) => parent?.isExternal,
      validation: (rule) =>
        rule
          .optional()
          .regex(/^[a-z0-9-]+$/, {
            name: "anchor",
            invert: false,
            message: "Use lowercase letters, numbers, and hyphens only.",
          })
          .warning("Use lowercase letters, numbers, and hyphens only."),
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "href",
      type: "url",
      hidden: ({ parent }) => !parent?.isExternal,
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "target",
      type: "boolean",
      title: "Open in new tab",
      initialValue: false,
      hidden: ({ parent }) => !parent?.isExternal,
    }),
    defineField({
      name: "buttonVariant",
      type: "button-variant",
      title: "Button Variant",
    }),
  ],
});
