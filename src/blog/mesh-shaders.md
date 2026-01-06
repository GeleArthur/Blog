---
~
---

# Mesh shaders

#Graphics

# Intro

Mesh shaders is a new pipeline to render meshes. Instead of using the vertex -> tesselation -> geometry  -> fragment shaders. 
We now have task -> mesh -> fragment shaders. With this we can do everything that the previous shaders could do and more.
With this we can do everything the other shaders can plus culling parts of the mesh. If your model has a lot of vertices this is a great way to reduce them.


## Meshlets

![meshlets](/mesh-shader/meshlets.png)


What is a meshlet?
A meshlet is a section on the mesh. These sections get backed by meshoptimizer 

Looking at the picture a meshlet is each different colored patched. To create these different patches I use meshoptimizer.
Meshoptimizer will run over each model and outputs buffers.

> **meshlets**
>
> This is a struct which holds the offset and count for both the vertex and triangle.
>
> ![alt text](/mesh-shader/image-1.png)

> **meshlet_triangles**
>
> These are `uint8_t` which are 3 index together that from a triangle
>
> ![alt text](/mesh-shader/Screenshot.png)

> **meshlet_vertices**
> 
> These are `uint32_t` that hold index to the real vertex buffer. 
>
> ![alt text](/mesh-shader/image-2.png)


Why use meshlets?

Mesh shaders create triangles for the rasterizer  




## Mesh shaders

Mesh shaders are compute shaders that have a spesific output the gpu consumes.
- SetMeshOutputsEXT(number, number); 
The amount of vertex and triangles this mesh shader outputs.
- gl_PrimitiveTriangleIndicesEXT
A array of uvec3 that holds the index of the vertex
- gl_MeshVerticesEXT 
an array of vertex positions.

Because mesh shaders are just a compute shader with special output you need to set some extra things.
The amount of threads the compute shader needs to spawn.
layout (local_size_x = 128, local_size_y = 1, local_size_z = 1) in;
And what the maximum vertices and maximum triangles could be.
layout (max_vertices = 64, max_primitives = 126) out;
And what type of output you want.
layout (triangles) out;

- How can you use it glsl?
- Wat is en waarom meshlets?
- Hoe index je van de meshlets
- Culling frustom
- Back-face
- Disuse occulusion culling
- How does the task shader work? EmitMeshTasksEXT
- Indirect 



# References

- https://gpuopen.com/download/GDC2024_Mesh_Shaders_in_AMD_RDNA_3_Architecture.pdf
- 
