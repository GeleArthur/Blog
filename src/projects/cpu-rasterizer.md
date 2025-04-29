---
layout: doc
---

# Cpu rasterizar
- Github: [https://github.com/GeleArthur/GP1-Rasterizer](https://github.com/GeleArthur/GP1-Rasterizer)

Where we going we don't need a gpu just your cpu and MATH! 

![image broke](/cpu-rasterizer/img1_cpu.png)
cpu render

![image broke](/cpu-rasterizer/img1_gpu.png)
gpu render

I made a cpu renderer to make sure I was 100% correct I also added the gpu version. You can switch between them at runtime.

Rendering triangles on the gpu is "easy" put in your vertex buffer tell how the shader file how it should look like and the gpu does all the hard math. 
All the dark magic is hidden from you so I explored how it really works.

## Render a single triangle
Before we get started we need to find how we are going to render. The idea is that you loop over all your pixels and find the color you want that pixel to be draw in.

### 1. Is a pixel inside the triangle?

On the gpu pipeline this is thee rasterizer stage and there are multiple technics on solving this problem. I am using a simple algotirm using the cross product

To check if a pixel is inside a triangle we can break down the problem into smaller problems.
One thing we know how to solve is to check on which side a point is from a line.

$
(v_1 - v_0) \times (p - v_0) > 0
$

![triangle](/cpu-rasterizer/triangle_in_triangle.png)

```cpp
const float distV2 = Vector2::Cross(v1 - v0, pixelLocation - v0);
const float distV0 = Vector2::Cross(v2 - v1, pixelLocation - v1);
const float distV1 = Vector2::Cross(v0 - v2, pixelLocation - v2);

if(distV2 > 0 && distV0 > 0 && distV1 > 0)
{
    // render pixel
}
```



### 2. Rendering a pixel

Now that we know if a pixel is inside a triangle we are done now we can render lovely triangles. But they don't have any color yet.
To map a texture on a model we are going to need uv coordinates.

In `gpu land` every vertex gets uv coordinates and when going over each pixel they will be interpolated for you. 
In `cpu land` we need to do this interpolated our self. 

To do this I am using [barycentric coordinates](https://en.wikipedia.org/wiki/Barycentric_coordinate_system).
The idea is that if know the percentage of how close a pixel is too a vertex you can interpolate any data on the vertex.

If you look at our previous calculation $(v_1 - v_0) \times (p - v_0)$ we are also calculating the area of the image below.

![barycentric](/cpu-rasterizer/bary.png)

If you would do this for the other lines like I did up top. You could see that we create 3 parallelograms.

![baryfull](/cpu-rasterizer/full_paralol.png)

The **area** of these of parallelograms can all be counted up with each other and then be divided to get a percentage.
This allows you to interpolate the uv coords :D.

Then you can sample the image pixel to see what color you need to use to draw.

![texture!](/cpu-rasterizer/GP1_Rasterizer_2JuYYVvHUJ.png)

There are more steps but I will leave it here. Thanks for reading.


# Gallery
Images and videos made during development

![texture!](/cpu-rasterizer/render_full.png)
full render

![texture!](/cpu-rasterizer/render_albedo.png)
albedo

![texture!](/cpu-rasterizer/render_observable_area.png)
observable area (optimization where to check for pixels)

![texture!](/cpu-rasterizer/render_depthbuffer.png)
Depth buffer

![texture!](/cpu-rasterizer/render_specular.png)
Specular


![texture!](/cpu-rasterizer/img_errors2.gif)
Triangles are benign draw too much

![texture!](/cpu-rasterizer/img_errors.gif)
Not clearing the old render



# links

- https://lisyarus.github.io/blog/posts/implementing-a-tiny-cpu-rasterizer.html
