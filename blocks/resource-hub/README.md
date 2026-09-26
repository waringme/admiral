# Resource Hub

"Quick links" plus categorised article cards in one block (admiral.com motor
hub, e.g. *Van driving advice and tips*).

## Authoring (Universal Editor)

1. **Resource Hub** (the block): *Quick links heading* and *Quick links intro*.
2. Add a **Resource Hub Category** for each section: *Category name* (the
   section heading) and *Intro*. Every category automatically gets a quick-link
   button at the top of the block. The sections appear in the order of the
   categories.
3. Add **Resource Hub Card** items: *Image*, *Image alt text*, *Text* (title
   heading, description, link) and *Category*: the name of the category the
   card belongs to (not case-sensitive). The card appears under that category,
   in the order the cards are listed. Cards whose category doesn't match any
   category name are listed at the end.

Quick links are built from the categories, so they always jump to a section
that exists. Renaming a category renames its link. Cards must then use the new
name.

## Rendering

- `.resource-hub-intro`: heading + intro
- `nav.resource-hub-links`: one outline button per category (`#<category-name>`)
- `section.resource-hub-group#<category-name>`: heading + intro, then the cards
  in the Cards Article *Boxed* style (3 per row; 2 when a category has two)
