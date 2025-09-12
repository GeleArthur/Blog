---
layout: doc
---

# Vulkan deferred renderer
[GITHUB](https://github.com/GeleArthur/pretty-vulkan-printer)

I created a vulkan renderer. It uses deferred rendering, bindless, tonemapping. To print pretty pictures :D.

A deferred renderer is special because instead of rendering the lit object directly (forward) we instead render in between images.

## Deferred rendering

First I do a depth pre pass. This way we can early out of a pixel before we start doing the heavy G buffer.
![depth buffer](/vulkan-renderer/depth-buffer.png)

The Geomerty pass(Gpass) renderers multiple images which we later combine into one into a final light pass.

**albedo** This buffer shows the models with there textures applied on the mesh.
![gpass-albedo](/vulkan-renderer/gpass-albedo.png)

**normal** This is the normal packed into 2 channels for extra detail.
![gpass-normal](/vulkan-renderer/gpass-normal.png)

**metal and rougness** The red here displays the amount of metal a object has. Then green displays how rough the material is.
![gpass-metal-rougness](/vulkan-renderer/gpass-metal-rougness.png)

**final render** After the tone mapping we blit the final image onto the screen.
![final-render](/vulkan-renderer/vulkan-final.png)

# future features

After I was done with the exams I wanted to add some more things to my vulkan project.
- Move the window around without freezing
- Tracy
- Double buffering
- Resize the window
- Imgui

## Moving the window
First I started with threading the reader and polling the window as separate threads.
I did it by starting a thread for my render loop. And let the main thread call the pollevents from gtfw.
The problem I now have is that the reader thread and window thread need to sync at some point.
I use the callbacks from glfw to store the inputs and a mutex to make sure they don't both write and read at the same time.
This change made me rethink a lot of my code base and a bunch of stuff had to be rewritten. 

I know why people don't start with the multithreading :D.

## Tracy

Then I got distracted by the performance train and I started adding instrumental profiling code in my project and some of my suspicions where realized.

The timeline goes from left to right.
The pink is the rendering thread and you can see that half of the frame I am WAITING!!!!. This is because I didn't have double buffering in my renderer so hopefully I can stop waiting so much once I have double buffering.
![travy frame](/vulkan-renderer/tracy-frame.png)

One more thing I see is that I have allocations every frame. Thats pretty bad as it makes a call to the OS then. So I would like to see if I could remove these allocation or making my own allocator to avoid it.

## Double buffering
The problem with double buffering is that you need some things twice and some things you don't. In my old design all images where from the same class. Also the textures!!!
If I wanted to get access to the rendering images and the static images in a same way I would have to separate them. 
The camera buffer and light buffer also needed to be separated.

Lights do not get updated every frame. But when they do they need to be updated in the frame thats currently not active and in the future thats currently beaning rendered. My solution for this was a queue where every render buffer has there own queue and when its time to update the values it clears out the queue and updates all the values. When lights change both queues get the value. That way I can make sure both buffers get all the updates. This does mean I am doing dubbel the work. 
another solution would be to record what objects got changed and then copy the values directly over.

![victory!](/vulkan-renderer/image.png)
Tracy shows that we are not waiting anymore!

## Window resizing

When ever you resize your window I need to recreate all rendering images. Because all the images get recreated all the views also need to be recreated. Which means that the descriptors need to be reassigned. This really feels like a chain of dependencies. I would have made a flame graph to get a graph of all the depensies. But I went for an different solution. All the rendering images subsribe to the swapchain and the swapchain tells all images if there has been a change. If there is we recreate all images of all buffers. Waiting fully until all rendering has been done. 

![moving window](/vulkan-renderer/clion64_Oa9YtrakJS.gif)

## ImGUI

You would think adding imgui would be easy? right?
No try it with multi threading. Because imgui doesn't expect multi threading you have to make sure imgui doesn't call any of the glfw functions.
So you have to handle the imgui input yourself. luckly imgui documentation is great and easy to read.
There are functions in imgui so you can add input to the queue. But figuring this out and getting it to work was not easy :P.

![alt text](/vulkan-renderer/image-1.png)