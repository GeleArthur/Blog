---
layout: doc
---

# Spelunky remake

I recreated [spelunky](https://store.steampowered.com/app/239350/Spelunky/) using using c++.

# [PLAY HERE](/spelunky-remake/spelunky.html){target="_self"}

This was my first year DAE project. 

I used the book Spelunky by Derek Yu (The creator of spelunky) to get inspiration how to implement the random world generator.

<video controls src="/spelunky-remake/spelunky-demo.mp4#t=10" />


After I was done with it for a school project I decided to make it into a web game with emscripten.
There where some problems I had when porting the game.

### Porting opengl
The engine was written in opengl 1.0 which doesn't work with emscripten.
I upgraded the engine to use opengl 2.0 ES so it can  draw in webgl.

In opengl 1.0 there are no shaders. So I added them for opengl 2.0 ES to work. 
You can also push matrix in opengl 1.0. This feature doesn't exists in opengl 2.0 ES. I recreated that feature. 



# Screenshot

![Spelunky remake](/spelunky-remake/ScreenShot1.png)

# links

- Github: [https://github.com/GeleArthur/Spelunky-Remake](https://github.com/GeleArthur/Spelunky-Remake)
