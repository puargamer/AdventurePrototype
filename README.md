A simple adventure game by Ivan Kwok based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: Entrance, LivingRoom, Kitchen, and Bedroom
- **2+ scenes *not* based on `AdventureScene`**: Beginning and Ending
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: arrows(). Allows for a set of 3 interactive arrows to be used in an AdventureScene, each leading to a different door and runs doorlogic().
    - Enhancement 2: doorlogic(). A method that contains a door cinematic. The door 'opens' and leads to another location if the player has the right item in their inventory.

Experience requirements:
- **4+ locations in the game world**: Entrance, LivingRoom, Kitchen, and Bedroom
- **2+ interactive objects in most scenes**: There is at least a key and an arrow leading to a door in all scenes. 
- **Many objects have `pointerover` messages**: Keys and doors describe themselves on mouse hover.
- **Many objects have `pointerdown` effects**: Keys and chests disappear on equip/use.
- **Some objects are themselves animated**: The 2 final keys spin around.

Asset sources:
- (For each image/audio/video asset used, describe how it was created. What tool did you use to create it? Was it based on another work? If so, how did you change it, and where can we learn more about the original work for comparison? 
- **Background images and box image taken by self**

- **Below assets were run through a pixel filter at pinetools.com/pixelate-effect-image and artifacts were fixed in Photoshop**
- **Key**: https://commons.wikimedia.org/wiki/File:Standard-lock-key.jpg 
- **Lock**: https://creazilla.com/nodes/3164707-lock-clipart 
- **Chicken**: https://pngtree.com/free-png-vectors/chicken-png
- **Duck**: https://static.vecteezy.com/system/resources/previews/013/453/393/original/yellow-rubber-duck-isolated-png.png 


Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.