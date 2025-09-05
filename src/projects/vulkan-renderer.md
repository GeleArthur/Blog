---
layout: doc
---

# Vulkan deferred renderer

After rendering a triangle we had create a deferred renderer.
This means that instead of rendering the lit object directly we instead render in between images.
First I do a depth pre pass. This way 
![depth buffer](/vulkan-renderer/depth-buffer.png)
![gpass-albedo](/vulkan-renderer/gpass-albedo.png)
![gpass-normal](/vulkan-renderer/gpass-normal.png)
![gpass-metal-rougness](/vulkan-renderer/gpass-metal-rougness.png)
![final-render](/vulkan-renderer/vulkan-final.png)

# After school

After I was done with the exams I wanted to add some more things to my vulkan project.
- Move the window around and it shouldn't freeze
- Resize the window
- Double buffering

First I started with threading the readering and polling the window as seperate processes.
I did it by starting a thread for my render loop. And let the main thread call the pollevents from gtfw.
Now I do still call some gtfw functions in the render thread which is not allowed. But I didn't see extreemly weird things yet. So I left it. (This is a dum idea).

Then I got distracted by tracy a instrumental profiler. I started adding instrumental code in my project and some of my supisions where realized.

The timeline goes from left to right.
The pink is the rendering thread and you can see that half of the frame I am WAITING!!!!. This is because I didn't have double buffering in my renderer so hopefully I can stop waiting so much once I have double buffering.
![travy frame](vulkan-renderer/tracy-frame.png)

One more thing I see is that I have allocations every frame. Thats pretty bad as it makes a call to the OS then. So I would like to see if I could remove these allocation or making my own allocator to avoid it.


# NEEDS A REVIEW BEFORE POSTING