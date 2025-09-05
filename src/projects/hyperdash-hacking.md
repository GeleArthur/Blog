---
layout: doc
---

# HyperBash

This is a mod I started to make in 2020 which I am currently (2025) still giving support for not developing activly




## On Dead Switch

I created a mod (modification) for a Unity based game called Hyperdash. This mod switches the spectator view to another player if the current player dies.

In the video on the left you see at 0:15 the mod in action.  The person who we are watching gets killed. My mod switch the view to the person who killed him/her. This happens multiple times in the video.

The goal of this mod is to give a better spectator experience.




## Code injection

[code image]()


I wrote this code to intercept the method OnEvent of the PlayerCallbacks class. This method gets called when a Player gets killed.

You see class member functions named BABBBBBCBCBDDDCBADABBDA. This is caused by obfuscation of the game code. Goal of obfuscation is to make the code less readable. However, by close examination, you can understand how the code works.

Triangle Factory (The makers) created there own OnDeadSwitch ;).



