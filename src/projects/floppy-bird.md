---
layout: doc

---

# Floppy bird

- Github: [https://github.com/GeleArthur/Nes_Flappingbird](https://github.com/GeleArthur/Nes_Flappingbird)

# Floppy bird on real NES

<!-- <video controls src="./../src/assets/av1-floppy-bird.webm" /> -->

---

<video controls src="/floppy-bird/floppy-bird-final.mp4" />


## Assembly one the NES
In the project I programmed 6502 assembly for the nintendo enternamtantd system. 
I worked in a team with 3 other programmers. We started with reading a book (starting with nes). Its bad at explaining how the NES works but had some great examples on how to 6502 works.

Because we had access to a four score we wanted to make a 4 player game. We came up with floppy bird.
![forscore]()

## Collision detection

### Check X
On the NES numbers only go up to 256 so we can do some clever tricks to do easy collision detection.
1. We need to find out if the bird is colliding on the X axis.
2. The pipes are 32 pixel a part.
3. If we look at how numbers are repersend 0010'0000 we can see that if we set the 6 bit and the rest to 0 its 32.
4. This means that every 32 pixels the 6 bit will be flipped.
5. So we do `and` with 0010'0000 and check if its zero to see if the x is valid.

![](/floppy-bird/floppy-bird-collision.png)


```asm
lda scroll_pos ; Load into the scroll position
clc ; clear the carry
adc which_player+PlayerStruct::xpos ; Add the player position
adc #16 ; Add the player offset 
and #%00100000 ; Do a and check with 32 bit to be true 
bne checkY ; if its not equal to zero aka 1 we are going into the next stage for y check
jmp end ; if its zero we stop checking we are not in a pipe
```

### Check Y
To check the Y I just checked between 2 numbers. `y > pipe1.bottom || y < pipe1.top`
The inseting part is how do I get the pipe data?

Pipes data are structed like this.

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

We didn't randomly generate pipes instead we have levels that are active and get randomly chosen. This way we can have more fun pipes levels and draw in little details.

The start of the memory hold the collision data 4(pipes) * 2 (up and own) amount of pipes.
To find which part I need to check if we are in the active or previous pipes map. 
I do this by adding the player pos and the scroll pos and see if the carry got flagged. 
Because if they overflow it means that I am in a different nametable.

```asm
lda scroll_pos
clc
adc which_player+PlayerStruct::xpos
bcs UseActiveCollision
```

Then the correct nametable gets set

```asm
ldy ptrActiveDrawnNameTable
sty temp1
ldy ptrActiveDrawnNameTable+1
sty temp1+1
```

We know which nametable we are in but we still don't know in which pipe the player is.
The calulation of scroll_pos + player.x is still in the register so no need for loading it again.
I then divide by 64 to get the correct pipe index. This can be done easly with left shift right
Multiply by 2 as the pipes are 2 bytes top and bottom.

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

Then I start comparing the values with the player y see if it has collided.

Writing collision code is way different then in normal higher level langages but because of these limited assembly lanague you try to find tricks to get around. There is no easy bigger then or sin or cos. Only you and your instructions.


# Gallary 
Pictures during developement

![](/floppy-bird/Screenshot155528.png)

![](/floppy-bird/Screenshot094546.png)

![](/floppy-bird/floppy-bird-working-tile-generation.gif)

