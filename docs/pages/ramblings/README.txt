So... what the hell is this?
Well, good question. Let us explain the format.


This is a statically-generated blog using AcsiiDoc. I will not tell you how to use AsciiDoc, because anyone making a website probably has internet access. So go look it up. Anyways, each post has a dedicated folder located in the posts folder. I will tell you what to do with these files.

Ok, suppose you listed out all the files in a post's folder using ls -a, and that this post uses every single feature availiable.
    .   ..  post.adoc   index.html  assets/    raw_html.frag   raw_html.css    raw_html.js

Ignore the dots, they're for navigation. Focus on the everything else.
index.html - This is a generated file. Don't bother with it.
post.adoc - This is the main course. I will explain this in its own section.
assets/ - This is the assets folder. This is where you will store your images and whatnot. Though you are technically allowed to store them in the root, you shouldn't because it's annoying.
raw_html.frag & raw_html.css & raw_html.js - I will explain all of these in detail later.

Alright, now for the actual work.

USING THE ASCIIDOC --------
This is a standard AsciiDoc



////////// The raw HTML fragments are yet to be documented, as I am yet to implement them. But the idea is this:
The .frag is just regular html, injected into the post. It is not an iframe, so there is no <html> or <head> or <body>. If anything, it's only really a <div>. The CSS and JS files are actually just files you can link to in the frag file, allowing you to have mutliple unique fragments with the same styling. I also want to have some sort of replacement system, so that some of the contents of the fragment can be specified in the AsciiDoc file; this would be useful for something like https://blog.giovanh.com/blog/2025/08/08/uhc-end/, in which they simulate Discord messages in HTML markup.