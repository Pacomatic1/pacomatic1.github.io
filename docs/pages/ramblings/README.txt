So... what the hell is this?
Well, good question. Let us explain the format.


This is a statically-generated blog using marked. I will not tell you how to use marked and its built-in supported extensions, because anyone making a website probably has internet access. So go look it up. Anyways, each post has a dedicated folder located in the posts folder. I will tell you what to do with these files.

Ok, suppose you listed out all the files in a post's folder using ls -a, and that this post uses every single feature availiable.
   .   ..   post.md   index.html   assets/   post.json

Ignore the dots, they're for navigation. Focus on the everything else.
index.html - This is a generated file. Don't bother with it.
post.json - This is for important metadata. I will explain this in its own section.
post.md - This is the main course. I will explain this in its own section.
assets/ - This is the assets folder. This is where you will store your images and whatnot. Though you are technically allowed to store them in the root, you shouldn't because it's annoying.

Alright, now for the actual work.

USING MARKDOWN------
post.md and post.json are the main course. A full post should ideally be possible with nothing but these.
post.json contains stuff like version history and titles.
post.md is a standard AsciiDoc file, but with a few modifications and mandatory formatting fragments.

First of all, the post's title and whatnot is some stuff you must put in post.json.
{
    postTitle: "This is a title. I do not need to explain this, right?"
    postVersion: "1.0.0" - This is a version, using the usual semantic versioning. There is no specification, but it's good to stay consistent, so: 'Hotfix' versions are small grammatical corrections for things like typos, minor versions are for small bits of extra info or mentioning a newer article or mentioning that something is outdated or something, and major versions are best for a post that is continually updated unfinished sections and 'TBD's getting finished.
    postPublishDate: "Date" - This is when the post was first made. This is converted into a Date() or Temporal() object; so long as your text can be parsed by whichever API I'm using, we're good. **NEVER CHANGE THIS UNLESS IT'S BROKEN.** (date for now, I wanna do temporal but it's still experimental, so i do it later)
    postLastUpdate: "Date" - This is when the post was last updated. The format is the same as the publishDate, except that you change this every time you update something.... which really shouldn't come as a surprise.
    postSubtitle: "Please god this is so obvious I don't wanna have to explain this" - Please god this is so obvious I don't wanna have to explain this
}

post.md is a modified version of markdown.
We parse it through marked, so it carries all the quirks of that. This also means unsanitized HTML, so go wild if you want to.
All hyperlinks prepended with an exclamation mark will open in a new tab.
There is now the <wavy> tag. I'll get there soon~


We plan to include raw HTML fragments. As it stands, they are yet to be implemented or documented... but here's the general idea, for later.
The .frag is just regular html, injected into the post. It is not an iframe, so there is no <html> or <head> or <body>. in fact, it's actually a <div>. The CSS and JS files are actually just files you can link to in the .frag file, allowing you to have mutliple unique fragments with the same styling. I also want to have some sort of replacement system, so that some of the contents of the fragment can be specified in the AsciiDoc file; this would be useful for something like https://blog.giovanh.com/blog/2025/08/08/uhc-end/, in which they simulate Discord messages through HTML instead of uing screenshots. If I had to guess, it's because this scales better.
It may also be worth using custom HTML tags, with the fragments in question shared between posts. Maybe.