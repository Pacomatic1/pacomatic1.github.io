#!/bin/bash

echo "Time to compile! You should read README.txt. That's, like, her whole purpose."
echo "Also make sure you're located in the same directory in this file! Otherwise, you will die."
echo ""
echo "I have so many regrets."
echo ""
echo ""



cd "./pages/sites_i_like/"
node "./compile_node.js" &
cd ../../

cd "./pages/projects/"
node "./compile_node.js" &
cd ../../


# Close once everything is done, since we ran some stuff asynchronously and other things might have finished too soon.
wait