Here are some things you NEED to know. Don't skip this stuff!

1. Place this in the head: <script src="../shared.js" type=module> </script>
    This is an essential script that every page needs to communicate with the parent page.
    Also keep in mind that this path is based on something being in a direct child of the 'pages' folder (eg. "/pages/home/index.html"). If you want to have an iframe in a subfolder (eg. "/pages/home/stats/index.html") then adjust the path accordingly and all will be well.

2. This website is mostly written in hand-made HTML, no compilation needed.
    Sadly, 'mostly' is a thing I had to add for a reason.
    That's because some of this site *is* statically compiled! However, the compilation in question is in several self-contained 'codebases'; for example, one thing'll use a hyper-specific purpose-built python script, another will use 11ty, another will use a purpose-built Node.js script, and another will use its own purpose-built Node.js script.
    To make this slightly easier on you, I have a single shell script that does all of this at once; see compile.sh.
    You will need Python and Node.js, using the latest versions (as of August 2025).
    If you are on Windows, you should use WSL, with the dependencies mentioned above. Just go to the folder using Powershell, enter WSL while there, and run the script like usual.

3. UTF-8, Linux line endings. NOTHING ELSE. Trying to deal with every possible encoding and every possible line ending has caused so many unneeded headaches. 


TODO: Self-host these fonts. No, seriously, why the hell are we using Google Fonts? I know it's convenient, but it's *flimsy*!



CONSIDER: Is it worth modifying the entire site to run through a compiler? It would would make everything less clogged, and allow for much easier implementation of that translation feature you keep thinking about.
It would also allow for some weirder shenanigans, like C-style #include, even if the practicality of such a thing is.... debatable.
But! Something like this could be *great* for sharing assets. As it stands, there are several things that you keep having to store over and over again; 7_scrollbar.css is a really, *really* big offender.
Now that I think on it, it may actually be great to use #include, though it'd be used more like a #define macro that changes based on the file's contents, position, and so on.

But, as it stands, you may be better off not doing that for now, for the simple and exclusive reason of "not every page needs it". No, seriously, 90% of the site would not need this. It might just be you getting excited.

Go finish the blog, make some more content pages (including silly things, don't be afraid), and then come back to ask yourself if this is worth the time.