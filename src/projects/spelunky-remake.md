---
layout: doc
---

# Spelunky remake

I recreate [spelunky](https://store.steampowered.com/app/239350/Spelunky/) using using c++.

# [PLAY HERE](/spelunky-remake/spelunky.html){target="_self"}

This was my first year project. 

I used the book Spelunky by Derek Yu. (The creator of spelunky) to model the random world generation.

![Spelunky remake](/spelunky-remake/ScreenShot1.png)
<video controls src="/spelunky-remake/spelunky-demo.mp4#t=10" />

After I was done with it for a school project I decided to make it into a web game with emscripten.
There where some problems I had when trying to port the game.

### Porting opengl
The engine was written in opengl 1.0 which doesn't work on emscripten.
I had to upgrade the engine to use opengl 2.0 ES so it would draw in webgl.

In opengl 1.0 there are no shaders. So I had the add them for ES to work. 
You can also push matrix in opengl this feature doesn't exists in opengl ES. I had to create a simulation of that feature. 


- Github: [https://github.com/GeleArthur/Spelunky-Remake](https://github.com/GeleArthur/Spelunky-Remake)
