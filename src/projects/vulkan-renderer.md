---
layout: doc
---

# Vulkan deferred renderer
[GITHUB pretty vulkan printer](https://github.com/GeleArthur/pretty-vulkan-printer)

I created a vulkan renderer. It uses deferred rendering, bindless and tonemapping. Its named pretty vulkan printer (pvp).

A deferred renderer is special because instead of rendering the lit object directly (forward) we instead render in-between-images.

## Deferred rendering

First, I do a depth pre pass. This way we can early out a texel before we start doing the heavy Geometry pass.
![depth buffer](/vulkan-renderer/depth-buffer.png)

The Geometry pass(Gpass) renders multiple images which we later combine into one final light pass.

### **albedo** 
This buffer shows the models with their textures applied on the mesh.
![gpass-albedo](/vulkan-renderer/gpass-albedo.png)

### **normal** 
This is the normal packed into 2 channels for extra detail.
![gpass-normal](/vulkan-renderer/gpass-normal.png)

### **metal and rougness**
- Red channel: How metallic an object is
- Green channel: How rough an object is

![gpass-metal-rougness](/vulkan-renderer/gpass-metal-rougness.png)

### **final render** 
After the tone mapping we blit the final image onto the current swapchain.
![final-render](/vulkan-renderer/vulkan-final.png)

# Extra features

After I was done with the exams, I wanted to add some more things to my vulkan project.
- Move the window around without freezing
- Tracy
- Double buffering
- Resize the window
- Imgui

## Moving the window
I started with adding multi-threading. The main thread handle all the poll events from glfw.
A separate thread is started for my render loop. 
One of the issues is that the render thread and main thread need to sync input calls.
The main thread writes the input changes into a buffer and makes it thread-safe with a mutex. 
The render thread will lock the mutex when it wants to read the input.
This change made me rethink a lot of my code base and a bunch of stuff had to be rewritten. 

I learned why people don't like multithreading :D.

## Tracy

Then I got distracted by the performance train and I started adding instrumental profiling code in my project and some of my suspicions got confirmed.

The timeline goes from left to right.
The pink is the render thread and you can see that half of the frame I am WAITING!!!!. This is because I didn't have double buffering in my renderer so hopefully I can stop waiting once I have double buffering.
![travy frame](/vulkan-renderer/tracy-frame.png)

## Double buffering
The problem with double buffering is that you need some things twice and some things once. In my old design all images where from the same class. Also the textures!!!
With double buffering I need to duplicate the render images. The textures I don't need to duplicate.
The camera buffer and light buffer also need to be duplicated.

Lights do not get updated every frame. But when they do, they need to be updated in the frame that's currently not active and in the future frame thats currently being rendered. My solution for this was a queue where every render buffer has their own queue and when its time to update the values it clears out the queue and updates all the values. When lights change both queues get the value. That way I can make sure both buffers get all the updates. This does mean I am doing double the work. 

![victory!](/vulkan-renderer/image.png)
Tracy shows that we are not waiting anymore!

## Window resizing

Whenever you resize your window, I need to recreate all rendering images. Because all the images get recreated, all the views also need to be recreated. Which means that the descriptors need to be reassigned. This really feels like a chain of dependencies. I could have made a frame graph to get a graph of all the dependencies. But I went for an different solution. All the rendering images subscribe to the swapchain and the swapchain tells all images if there is a change. If there is a change, we recreate all images of all buffers. Also we wait with the change until the gpu is idle. 

![moving window](/vulkan-renderer/clion64_Oa9YtrakJS.gif)

## ImGUI

You would think adding imgui would be easy? right?
No, try it with multi threading. Because imgui doesn't expect multi threading, you have to make sure imgui doesn't call any of the glfw functions.
So you have to handle the imgui input yourself. Luckily, imgui documentation is great and easy to read. :)
There are functions in imgui so you can add input to the queue. But figuring this out and getting it to work was not easy :P.

![alt text](/vulkan-renderer/image-1.png)
