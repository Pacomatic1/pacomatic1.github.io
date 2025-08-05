from subprocess import call
import os

# Use 'os.system(commandYouWannaRun)' to run terminal commands. You know, do the thing this is built to do.

print("Time to compile! You'd better have Node.js, npm, and Python (though you likely already do TwT) installed! Otherwise, you're doomed!\nAlso make sure you're located in the same directory in this file! Otherwise, you will die.\nOn an unrelated note: Why do I do this to myself?\n\n")

os.system('cd "./pages/sites_i_like/" && node "./compile_node.js"')
