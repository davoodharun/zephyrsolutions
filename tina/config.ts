import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Hero Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Hero Subtitle",
              },
              {
                type: "image",
                name: "image",
                label: "Hero Image",
              },
              {
                type: "object",
                name: "ctaButton",
                label: "CTA Button",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Button Text",
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Button Link",
                  },
                ],
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "object",
            name: "seo",
            label: "SEO Overrides",
            fields: [
              {
                type: "string",
                name: "title",
                label: "SEO Title",
              },
              {
                type: "string",
                name: "description",
                label: "SEO Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "ogImage",
                label: "Open Graph Image",
              },
            ],
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
        ],
      },
      {
        name: "portfolio",
        label: "Portfolio",
        path: "content/portfolio",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "client",
            label: "Client",
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
            required: true,
          },
          {
            type: "string",
            name: "heroImageAlt",
            label: "Hero Image Alt Text",
          },
          {
            type: "list",
            name: "industries",
            label: "Industries",
            itemProps: (item) => {
              return { label: item };
            },
            ui: {
              component: "tags",
            },
          },
          {
            type: "list",
            name: "servicesUsed",
            label: "Services Used",
            itemProps: (item) => {
              return { label: item };
            },
            ui: {
              component: "tags",
            },
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
        ],
      },
      {
        name: "service",
        label: "Services",
        path: "content/services",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
            required: true,
          },
          {
            type: "image",
            name: "icon",
            label: "Icon",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            required: true,
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
        ],
      },
      {
        name: "global",
        label: "Global Settings",
        path: "content/global",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "siteName",
            label: "Site Name",
            required: true,
          },
          {
            type: "string",
            name: "primaryDomain",
            label: "Primary Domain",
          },
          {
            type: "object",
            name: "defaultSEO",
            label: "Default SEO",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Default Title Template",
              },
              {
                type: "string",
                name: "description",
                label: "Default Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "ogImage",
                label: "Default OG Image",
              },
            ],
          },
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            fields: [
              {
                type: "list",
                name: "header",
                label: "Header Navigation",
                itemProps: (item) => {
                  return { label: item.label };
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "URL",
                  },
                  {
                    type: "number",
                    name: "order",
                    label: "Order",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn",
              },
              {
                type: "string",
                name: "github",
                label: "GitHub",
              },
              {
                type: "string",
                name: "twitter",
                label: "Twitter",
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Information",
            fields: [
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "phone",
                label: "Phone",
              },
              {
                type: "string",
                name: "address",
                label: "Address",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
        ],
      },
    ],
  },
});
