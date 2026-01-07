---
~
---

# Mesh shaders

Voor de afgelopen 8 weken heb ik mesh shaders gebruikt. Dit is een nieuwe techniek voor de gpu die de normalen pipeline vervangt. De goal van mesh shaders is om meer geomatry te renderer. Dit kan vanwegen de nieuwe arcatucte van gpu's. Deze implentatie is in vulkan.

![meshlets](/mesh-shader/meshlets.png)

## Creating meshlets

To use mesh shader you need to generate meshlets they are small sections of the mesh. Generating these meshlets can be tricky luckly there are [other people](https://mastodon.gamedev.place/@zeux) who have already figured this out. 

[meshoptimizer](https://github.com/zeux/meshoptimizer) is a great library that can generate meshlets for you.

Here is an example on how to generate meshlets using mesh optimizer.

```cpp
// These values come from [^2]
constexpr size_t max_vertices = 64;
constexpr size_t max_triangles = 126;
constexpr float  cone_weight = 0.25f; // if not cone culling set to 0

// Ask meshopt how many meshlets are going to be generated
size_t max_mesh_lets = meshopt_buildMeshletsBound(model.indices.size(), max_vertices, max_triangles);

std::vector<meshopt_Meshlet> meshlets(max_mesh_lets);
std::vector<uint32_t>        meshlet_vertices(max_mesh_lets * max_vertices);
std::vector<uint8_t>         meshlet_triangles(max_mesh_lets * max_triangles * 3);

size_t const meshlet_count = meshopt_buildMeshlets(
    meshlets.data(),
    meshlet_vertices.data(),
    meshlet_triangles.data(),
    model.indices.data(),
    model.indices.size(),
    model.vertices.data(),
    model.vertices.size(),
    sizeof(float) * 3,
    max_vertices,
    max_triangles,
    cone_weight);

// Crop the buffers because they are not fully filled
const meshopt_Meshlet& last = model.meshlets[meshlet_count - 1];
meshlet_vertices.resize(last.vertex_offset + last.vertex_count);
meshlet_triangles.resize(last.triangle_offset + last.triangle_count * 3);
meshlets.resize(meshlet_count);
```

Mesh optimizer outputs 3 new buffers for your model. 

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

Now using the new created meshlets I will show how to use them in the mesh shader.

# Mesh shaders

When using the mesh shader pipeline some stages are remove. No more vertex, geometry or tesselation shaders. Instead they are replaced by the task/amplification shader (task for vulkan, amplification for dx12). 
Mesh shaders are like a combined vertex/geometry shader the output data goes into the rasterizer and goes through the fragment shader like normal.

![alt text](/mesh-shader/image-3.png)

Mesh shader act like they are compute shaders. Here is a minimal example to output 1 triangle without any input.

```glsl
#version 460
#pragma shader_stage(mesh)
#extension GL_EXT_mesh_shader: enable

// Compute shader set thread group count
layout (local_size_x = 3) in;

// set the count for gl_MeshVerticesEXT[] and gl_PrimitiveTriangleIndicesEXT[] arrays
layout (max_vertices = 3, max_primitives = 1) out;
layout (triangles) out;

void main()
{
    vec4 positions[3] = vec4[](
    vec4(0.0, -0.5, 0.0, 1.0),
    vec4(0.5, 0.5, 0.0, 1.0),
    vec4(-0.5, 0.5, 0.0, 1.0)
    );

    if (gl_LocalInvocationIndex == 0)
    {
        // At runtime we can say how many vertices we are really outputting
        SetMeshOutputsEXT(3, 1);
    }

    if (gl_LocalInvocationID.x < 1)
    {
        // Set index for 
        gl_PrimitiveTriangleIndicesEXT[gl_LocalInvocationID.x] = uvec3(0, 1, 2);
    }

    if (gl_LocalInvocationID.x < 3)
    {
        gl_MeshVerticesEXT[gl_LocalInvocationID.x].gl_Position = positions[gl_LocalInvocationID.x];
    }
}
```

There are a couple new variables here. 

**gl_PrimitiveTriangleIndicesEXT**
This is a array of `uvec3` that holds the indices of the triangles your going to output.

**gl_MeshVerticesEXT**
An array with the gl_MeshPerVertexEXT struct only gl_Position is relevant for this example.
```glsl
struct gl_MeshPerVertexEXT {
    vec4 gl_Position;
    float gl_PointSize;
    float gl_ClipDistance[];
    float gl_CullDistance[];
}
```

**layout (max_vertices = number, max_primitives = number) out;**
This sets the size of the gl_PrimitiveTriangleIndicesEXT and gl_MeshVerticesEXT arrays. 

**SetMeshOutputsEXT(vertex_count, triangle_count)**
This is a function that will tell the rasterizer how many triangles and vertices there are in the arrays *gl_PrimitiveTriangleIndicesEXT* and *gl_MeshVerticesEXT*.

## Rendering models with meshlets

We need to decided how many vertices and triangles the mesh shader is going to output online I have found these numbers.
- Nvidia recommends [^2] max_vertices 64, max_triangles 126. 
- Amd recommends [^1] max_vertices 64, max_triangles 128.
- Zeux (Creator of mesh-optimizer) recommends: [^3] max_vertices 64, max_triangles 96.

I am going to stick with Nvidia's recommendation.





# Intro

Mesh shaders is a new pipeline to render meshes. Instead of using the vertex -> tesselation -> geometry  -> fragment shaders. 
We now have task -> mesh -> fragment shaders. With this we can do everything that the previous shaders could do and more.
With this we can do everything the other shaders can plus culling parts of the mesh. If your model has a lot of vertices this is a great way to reduce them.


## Meshlets




What is a meshlet?
A meshlet is a section on the mesh. These sections get backed by meshoptimizer 

Looking at the picture a meshlet is each different colored patched. To create these different patches I use meshoptimizer.
Meshoptimizer will run over each model and outputs buffers.




Why use meshlets?

Mesh shaders create triangles for the rasterizer. It does this like a compute shaders with special outputs plus any other data you want to send. When launching a mesh shader you use the same interface as a compute shader. You need set the thread group at compile time. And a dispatch size. 
In the mesh shader you need to set the max triangle and vertex output count. Then in the shader you get access to 2 arrays one with the that output the vertex position and one that outputs the triangles these arrays are the size of the max triangle and vertex output. All threads of the mesh shader have access to the same output array. 

Now to get more performed mesh shader output we should output 64 vertices and 126 triangles. This is because nvidia allocates the arrays every 128 bytes. Because the triangles need an extra 4 bytes we remove 2 triangles to fit in the extra 4 bytes.

Now with these limitations in mind we can see why the meshlets look like selections on top of the mesh. Because we can only output 





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


## Culling

Using the task shader we [^1] can deiced to cull meshlets. There are multiple stragices for culling 


# References


[^1]: https://gpuopen.com/download/GDC2024_Mesh_Shaders_in_AMD_RDNA_3_Architecture.pdf
[^2]: https://developer.nvidia.com/blog/introduction-turing-mesh-shaders/#:~:text=code%2E-,We,triangles,-%2E
[^3]: https://github.com/zeux/meshoptimizer#:~:text=max%5Fvertices%2064%2C%20max%5Ftriangles%2096


