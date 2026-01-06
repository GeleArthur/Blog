---
layout: doc
---

# HyperBash

This is a mod I started to make in 2020 which I am currently (2025) still giving support for not developing activly


## On Dead Switch 

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/AAtRBdRTK8I?si=E7B9Bk6wLUTWrH_6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I created a mod (modification) for a Unity based game called Hyperdash. This mod switches the spectator view to another player if the current player dies.

In the video on the left you see at 0:15 the mod in action.  The person who we are watching gets killed. My mod switch the view to the person who killed him/her. This happens multiple times in the video.

The goal of this mod is to give a better spectator experience.


## Code injection
- 2020
![AAAAABBBBBB](/hyperbash-modding/Untitled1.png)

I wrote this code to intercept the method OnEvent of the PlayerCallbacks class. This method gets called when a Player gets killed.

You see class member functions named **BABBBBBCBCBDDDCBADABBDA**. This is caused by obfuscation of the game code. Goal of obfuscation is to make the code less readable. However, by close examination, you can understand how the code works.

Triangle Factory (The makers) created there own OnDeadSwitch ;).


## Changing textures 

**Before**
![before my profile picture](/hyperbash-modding/Screenshot-2021-04-20-202107-1536x729.png)

**After**
![My profile picture](/hyperbash-modding/unknown-1536x765.png)

This is another mod (modification) that changes all map textures. This is not a simple file replacement. Right now, I have replaced all of the textures with a texture of a angry cat. These textures are replaced at runtime. This mod can be extended to make texture packs possible. 

![Blender UV](/hyperbash-modding/Screenshot-2021-04-20-203623.png)

When you export the mesh from Hyperdash you get this **Left**: model, **Right**: UV Map. The UV Map doesn’t look right. If you try to apply the correct texture it looks like a mess. 

So to try to understand why its this happening. I examined the obfuscated code, with **Ghidra**, I was able to find out that on startup it creates a **textureArray**. To create that texture array it first needs the original textures. So I was thinking: what if I replace these textures with my own using code injection? Below you can see the result.

## IMGUI

![alt text](/hyperbash-modding/Screenshot-2021-09-29-150751.png)

For all my mods I had to create a GUI. In this picture (left side) there are 27 mods.
I used Unity IMGUI because it was simple to implement. I wanted to focus on the mods, not on the gui.
All of these mods have settings that can change the behaviour.

There where multiple ways of adding mods to the GUI list. I chose for C# reflection. Because if I want to change something, I don’t need to edit all of my 27 mods. If a class inherits from BaseMod you will get added to the mods list. I do this by getting all class types that inherit BaseMod. Finally I instance them.



```csharp
Type[] modTypesUnclean = Assembly.
    GetAssembly(typeof(BaseMod))
        .GetTypes();

var modTypesClean = modTypes.
    Where(myType => 
    myType.IsClass && 
    !myType.IsAbstract && 
    myType.IsSubclassOf(typeof(BaseMod)))
```

## Health Shader 

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/V5YoSW05zo8?si=ULZIH8tlHV2JBtnJ&amp;start=16" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This will create a visual red tint to the players to indicate how much health they have.

For this I had to create a shader and import the shader at runtime. Importing assets in unity at runtime is hard but luckily unity has a solution: Assets bundles.
With assets bundles I can compile the shader before unity uses it.

```csharp
// Will convert a number thats between 
// start1 and stop1 to a number thats between start2 and stop2
float map(float n, float start1, float stop1, float start2, float stop2)
{
    return  (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = _Color;

    // Will change the alpha of the whole shader
    const float blink_amount = sin(_Time*_BlinkSpeed)/4.0+0.75;
    
    // Convert y height between 0 and 1
    const float mapped = map(i.worldPos.y, _YFeet, _YHead, 0, 1);
    
    // Using the mapped height we render it solid or transparent
    col.a = step(mapped, _Health) * blink_amount;

    return col;
}
```

This is the fragment part of my shader.
I am using variables like _YFeet and _YHead instead of the bounding box because the bounding box gives incorrect values.
First I calculate the blink_amount. This is just a sine wave that goes up and down between 0.5 and 1.
Then I map that pixels worldPos.y to a number between 0 and 1. Because this number is between _YFeet and _YHead I can use the map function.
Finally I use step() to check if that pixel is under the _Health. If it is, color it, otherwise don’t color it. Then I add the blink_amount to the color for a blink effect.

# Dash League 

Dash league is a competitive hyperdash tournament. They stream these matches on there youtube channel. Every official dash league stream uses my mod.

My mod proves improvements over the normal hyperdash spectator. Like **OnDeadSwitch** (Which the creators copied into the game), **Minimap**, **health visible** and **socket streamer**.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/vs7xQ2JLW14?si=pdsjQLfMuzm7LSgz&amp;start=2227" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Socket Streamer 

What is even better then creating your own visuals then having other people creating them.
Socket streamer is a mod that connects to another application. This application can get information about the game like scoreboard state, player position, player health, kills and more!
The socket streamer is being used by other developers from the dash league to create streamer overlays.
The data is send over a tcp connection as a json string

![alt text](/hyperbash-modding/Screenshot-2021-10-05-182533.png)
[DashLeague casting tool](https://github.com/AP3XGarbageMan/DashLeagueCastingTool)

# links
- [https://github.com/GeleArthur/DashCam](https://github.com/GeleArthur/DashCam)


![hyperbashlogo](/hyperbash-modding/HyperBashLogo.png)