Here are some things you NEED to know. Don't skip this stuff!

1. Place this in the head: <script src="../shared.js"> </script>
    This is an essential script that every page needs to communicate with the parent page.
    Also keep in mind that this path is based on something being in a direct child of the 'pages' folder (eg. "/pages/home/index.html"). If you want to have an iframe in a subfolder (eg. "/pages/home/stats/index.html") then adjust the path accordingly and all will be well.

2. This website is mostly written in hand-made HTML, no compilation needed.
    Sadly, 'mostly' is a thing I had to add for a reason.
    That's because some of this site *is* statically compiled! However, the compilation in question is in several self-contained 'codebases'; for example, one thing'll use a hyper-specific purpose-built python script, another will use 11ty, and another will use a totally seperate version of 11ty.
    To make this slightly easier on you, I have a single python script that does all of this at once; see compile.py.
    You will need Python and Node.js, using the latest versions (as of August 2025).