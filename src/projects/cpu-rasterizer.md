---
layout: doc
---

# Cpu rasterizer
- Github: [https://github.com/GeleArthur/GP1-Rasterizer](https://github.com/GeleArthur/GP1-Rasterizer)

Where we going we don't need a GPU, just your CPU and MATH!

![image broke](/cpu-rasterizer/img1_cpu.png)
cpu render

![image broke](/cpu-rasterizer/img1_gpu.png)
gpu render

I made a CPU renderer. To make sure I was 100% correct, I also added a GPU version. You can switch between them at runtime.

Rendering triangles on the GPU is “easy". Put them in your vertex buffer, tell with the shader file how it should look like, and the GPU does all the hard math.
All the dark magic is hidden from you so I explored how it really works.

## Render a single triangle
Before we get started, we need to find how we are going to render. The idea is that you loop over all your pixels and try to find if its in a triangle and the determine the color. 

### 1. Is a pixel inside the triangle?

On the GPU pipeline this is the rasterizer stage. There are multiple technics on solve this problem. I use a simple algorithm using the cross product.

To check if a pixel is inside a triangle we can break down the problem into smaller problems.
One thing we know how to solve is to check on which side a point is from a line.

$
(v_1 - v_0) \times (p - v_0) > 0
$

Now that we know on which side the point is of the line we can repeat it 3 more times. Until the pixel is encapsulated. If the pixel is outside the 3 lines we know its out of the triangle. 

![triangle](/cpu-rasterizer/triangle_in_triangle.png)

```cpp
const float distV2 = Vector2::Cross(v1 - v0, pixelLocation - v0);
const float distV0 = Vector2::Cross(v2 - v1, pixelLocation - v1);
const float distV1 = Vector2::Cross(v0 - v2, pixelLocation - v2);

if( (distV2 > 0) && (distV0 > 0) && (distV1 > 0) )
{
    // render pixel
}
```

### 2. Rendering a pixel

Now that we know if a pixel is inside a triangle we are done. Now we can render lovely triangles. But they don't have any color yet.
To map a texture on a model we are going to need UV coordinates.

In `gpu land` every vertex gets UV coordinates and when going over each pixel they will be interpolated for you. 
In `cpu land` we need to do this interpolated our self. 

To do this I use [barycentric coordinates](https://en.wikipedia.org/wiki/Barycentric_coordinate_system).
The idea is that if you know the percentage on how close a pixel is to a vertex, you can interpolate any data on the vertex. Which then make you able to sample from a texture to get a color.

If you look at our previous calculation $(v_1 - v_0) \times (p - v_0)$ we are also calculating the area of the image below.

![barycentric](/cpu-rasterizer/bary.png)

If you would do this for the other lines like I did above, you can see that we create 3 parallelograms.

![baryfull](/cpu-rasterizer/full_paralol.png)

The **area** of these of parallelograms can all be summed up with each other and then be divided to get a percentage.
This allows you to interpolate the UV coordinates :D.

Then you can sample the image pixel to see what color you need to use to draw.

![texture!](/cpu-rasterizer/GP1_Rasterizer_2JuYYVvHUJ.png)

There are more steps, but I will leave you here. Thanks for reading.


# Gallery
Images and videos made during development

![texture!](/cpu-rasterizer/render_full.png)
Full render

![texture!](/cpu-rasterizer/render_albedo.png)
Albedo

![texture!](/cpu-rasterizer/render_observable_area.png)
Observable area 

![texture!](/cpu-rasterizer/render_bounding_box.png)
Render bounding box optimization to see what pixels need to render.

![texture!](/cpu-rasterizer/render_depthbuffer.png)
Depth buffer

![texture!](/cpu-rasterizer/render_specular.png)
Specular

![texture!](/cpu-rasterizer/img_errors2.gif)
When doing multithreading using the vertex buffer something went wrong.

![texture!](/cpu-rasterizer/img_errors.gif)
Multithreading without clearing the back buffer errors.

# links

- https://lisyarus.github.io/blog/posts/implementing-a-tiny-cpu-rasterizer.html
