---
layout: doc

---

# Floppy bird

- Github: [https://github.com/GeleArthur/Nes_Flappingbird](https://github.com/GeleArthur/Nes_Flappingbird)

# Floppy bird on real NES

<video controls src="/floppy-bird/av1-floppy-bird.webm" />

---

<video controls src="/floppy-bird/floppy-bird-final.mp4" />


## Assembly on the NES
In this project I programmed 6502 assembly for the Nintendo Entertainment System. I worked in a team with 3 other programmers. We started with reading a book (Classic Game Programming on the NES). Its bad at explaining how the NES works, but had some great examples on how the 6502 CPU works.

Because we had access to a FOURSCORE we wanted to make a 4 player game. We came up with floppy bird.
![fourscore](/floppy-bird/forescore.png)

## Collision detection

On the NES numbers only go up to 255. Because of this limitation we can't program collision like it's done in higher level programming languages.
First step is to check the X coordinate of the bird.

### Check X
1. We need to find out if the bird is colliding on the X axis.
2. The pipes are 32 pixels apart.
3. The number 32 in binary is `00100000`. Only 1 bit is flipped.
4. This means that every 32 pixels the 5th bit will be set.
5. To see if the X is valid we do and with `00100000` and check if its zero.
6. We have now divided the the screen up in segments of 32 which wil alternate when you are on top of a pipe or not

![](/floppy-bird/floppy-bird-collision.png)


```asm
lda scroll_pos ; Load scroll position in A
clc ; clear the carry
adc which_player+PlayerStruct::xpos ; Add the player position
adc #16 ; Add the player offset 
and #%00100000 ; Do AND with A and check if 5th bit is set 
bne checkY ; if its not equal to zero aka 32 we are going into the next stage for y check
jmp end ; if its zero we stop checking we are not in a pipe
```

### Check Y
To check the Y coordinate of the bird, I just checked between 2 numbers. `y > pipe1.bottom || y < pipe1.top`
The interesting part is how do I get the pipe data?

Pipes data are structured like this.

```asm
.struct BackgroundLayout
  collision .byte 2*4
  attributeTable .byte 16*4
  nameTable .byte
.endstruct

BottomWide:
BottomWideCollision:
    .byte 10*8 - 4, 22*8 + 4
    .byte 14*8 - 4, 22*8 + 4
    .byte 10*8 - 4, 22*8 + 4
    .byte 6*8 - 4, 22*8 + 4

BottomWideAttributeTable:
	.byte $00,$00,$00,$00,$30,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	.byte $00,$c0,$00,$00,$00,$00,$30,$00,$00,$ff,$33,$00,$00,$00,$0f,$00
	.byte $00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00
	.byte $a0,$a0,$a0,$a0,$a0,$a0,$a2,$a0,$0a,$0a,$0a,$0a,$0a,$0a,$0a,$0a

BottomWideNameTable:
	.byte $00,$00,$00,$00,$0d,$0e,$0f,$10,$00,$00,$00,$00,$0d,$0e,$0f,$10
	.byte $00,$00,$00,$00,$0d,$0e,$0f,$10,$00,$00,$00,$00,$0d,$0e,$0f,$10
	.byte $00,$00,$00,$00,$0d,$0e,$0f,$10,$00,$00,$00,$00,$0d,$0e,$0f,$10
	.byte $00,$00,$00,$00,$0d,$0e,$0f,$10,$00,$00,$00,$00,$0d,$0e,$0f,$10
	.byte $00,$00,$00,$00,$0d,$0e,$0f,$10,$00,$00,$00,$00,$0d,$0e,$0f,$10
    ....
    ....

```

We don't randomly generate pipes. Instead we have levels that are active and get randomly chosen. This way we can have more fun pipes levels and draw more details.
The start of the memory block holds the collision data 4 (pipes) * 2 (up and own) amount of pipes. To find which part, I need to check if we are in the active or previous pipes map. I do this by adding the player pos and the scroll pos and see if the carry got flagged. Because if they overflow it means that I am in a different NAMETABLE.


```asm
lda scroll_pos
clc
adc which_player+PlayerStruct::xpos
bcs UseActiveCollision
```

Then the correct NAMETABLE gets set

```asm
ldy ptrActiveDrawnNameTable
sty temp1
ldy ptrActiveDrawnNameTable+1
sty temp1+1
```

We now know which NAMETABLE we are in, but we still don't know in which pipe the player is.
The calculation of scroll_pos + player.x is still in the register A so no need for loading it again.
I then divide by 64 to get the correct pipe index. This can be done easy with 5 Left Shift Right (lsr) instructions and multiplication by 2 as the pipes are 2 bytes for top and bottom.

```asm
lsr
lsr
lsr
lsr
lsr
lsr ; Divide by 64
asl ; stride * 2
tay ; Put in x
```

Then I start comparing the values with the player’s Y coordinate see if it has collided.

Summary: Writing collision code is way different than in normal higher level languages. Because of these limited assembly language you try to find tricks to get around. There is no easy bigger-then or sin or cos function. Only your creativity and the CPU instructions.
Gallery 

# Gallary 
Pictures during development

![](/floppy-bird/Screenshot155528.png)

![](/floppy-bird/Screenshot094546.png)

![](/floppy-bird/floppy-bird-working-tile-generation.gif)

![](/floppy-bird/Mesen_QBq4nAfZgi.gif)

<video controls src="/floppy-bird/2024-11-26_21-18-19.mp4" />

<video controls src="/floppy-bird/20241126-1742-55.1112126.mp4" />

<video controls src="/floppy-bird/20241126-1903-55.8165859.mp4" />

<video controls src="/floppy-bird/The_Pipes_keep_Comming.mp4" />