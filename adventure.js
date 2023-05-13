class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
    }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create() {
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor('#444');
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
        this.add.text(this.w * 0.75 + this.s, this.s)
            .setText(this.name)
            .setStyle({ fontSize: `${3 * this.s}px` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        
        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33)
            .setStyle({ fontSize: `${2 * this.s}px`, color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66)
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setText("Inventory")
            .setAlpha(0);

        this.inventoryTexts = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });

        this.onEnter();

    }

    showMessage(message) {
        this.messageBox.setText(message);
        this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 4 * this.transitionDuration
        });
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: this.transitionDuration
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: this.transitionDuration
            });
        }
        if (this.inventoryTexts) {
            this.inventoryTexts.forEach((t) => t.destroy());
        }
        this.inventoryTexts = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e, i) => {
            let text = this.add.text(this.w * 0.75 + 2 * this.s, h, e)
                .setStyle({ fontSize: `${1.5 * this.s}px` })
                .setWordWrapWidth(this.w * 0.75 + 4 * this.s);
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    gainItem(item) {
        if (this.inventory.includes(item)) {
            console.warn('gaining item already held:', item);
            return;
        }
        this.inventory.push(item);
        this.updateInventory();
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x - 20, to: text.x },
                    alpha: { from: 0, to: 1 },
                    ease: 'Cubic.out',
                    duration: this.transitionDuration
                });
            }
        }
    }

    loseItem(item) {
        if (!this.inventory.includes(item)) {
            console.warn('losing item not held:', item);
            return;
        }
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x, to: text.x + 20 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Cubic.in',
                    duration: this.transitionDuration
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != item);
            this.updateInventory();
        });
    }

    gotoScene(key) {
        this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
        this.time.delayedCall(this.transitionDuration, () => {
            this.scene.start(key, { inventory: this.inventory });
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }

    //custom functions

    //Doorlogic
    //
    //Door object cinematic that opens if you have the right key
    //doorname = door png, keyname = name of key, scene = next scene
    //requires door to be preloaded in scene
    doorlogic(doorname, keyname, scene) {
        //create door, background, exit button
        let background = this.add.rectangle(0,0, this.w * .75, this.h, 0x000000).setOrigin(0);
        let door = this.add.image(this.w *.35,this.h*.45, `${doorname}`);
        door.scale = .3;
        let button = this.add.text(50,50, "Leave").setFontSize(50);

        door.setDepth(1);
        background.setDepth(1);
        button.setDepth(1);

        //button logic
        button.setInteractive()
        .on('pointerdown',()=> {
            this.tweens.add({
                targets: [door, background],
                y: `-=${2 * this.s}`,
                alpha: { from: 1, to: 0 },
                duration: 500,
                onComplete: () => background.destroy(),
                onComplete: () => door.destroy(),
                onComplete: () => button.destroy()
            });
        })


        //door logic
        door.setInteractive()
            .on('pointerover',()=>{
                this.showMessage("Open door?")
            })
            .on('pointerdown',()=> {
                if (this.hasItem(`${keyname}`)) {
                    this.showMessage("You opened the door.");
                    this.tweens.add({
                        targets: [door, background],
                        //y: `-=${2 * this.s}`,
                        scale: 5,
                        alpha: { from: 1, to: 0 },
                        duration: 1500,
                        onComplete: () => background.destroy(),
                        onComplete: () => background.destroy(),
                        onComplete: () => button.destroy()
                    });
                    
                    //goes to next scene
                    this.gotoScene(`${scene}`);
                    return;

                } else {
                    this.showMessage("You don't have the right key.");
                }
            })
    }

    //Arrows
    //
    //shows arrows that lead to doors
    //
    //directions = X
    //X: booleans to make arrows
    //Xdoor: assign door to direction
    //Xdoorkey: assign key to door
    //Xlocation: assign location to door
    //
    //if door doesnt need key, leave key as null
    //requires arrows and doors to be preloaded in scene
    arrows(down,left,right,downdoor,leftdoor,rightdoor, downdoorkey, leftdoorkey, rightdoorkey, downlocation, leftlocation, rightlocation) {
        console.log('in arrows');
        if (down == true) {
            let arrow = this.add.image(this.w *.375,this.h*.95, 'arrow');
            arrow.angle = 180;
            arrow.scale = .1;

            arrow.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage(`A ${downdoor}.`)
                    arrow.scale +=.1;
                })
                .on('pointerout',()=> {
                    arrow.scale -=.1;
                })
                .on('pointerdown',()=> {
                    //if don't need key, just go to room
                    if (downdoorkey == null) {
                        this.gotoScene(`${downlocation}`);
                        return;
                    }
                    //else, call doorlogic
                    else {
                    this.doorlogic(`${downdoor}`,`${downdoorkey}`, `${downlocation}`);
                    }
                })
        }
        if (left == true) {
            let arrow = this.add.image(this.w *.05,this.h*.5, 'arrow');
            arrow.angle = -90;
            arrow.scale = .1;

            arrow.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage(`A ${leftdoor}.`)
                    arrow.scale +=.1;
                })
                .on('pointerout',()=> {
                    arrow.scale -=.1;
                })
                .on('pointerdown',()=> {
                    //if don't need key, just go to room
                    if (leftdoorkey == null) {
                        this.gotoScene(`${leftlocation}`);
                        return;
                    }
                    //else, call doorlogic
                    else {
                    this.doorlogic(`${leftdoor}`,`${leftdoorkey}`, `${leftlocation}`);
                    }
                })
            
        }
        if (right == true) {
            let arrow = this.add.image(this.w *.7,this.h*.5, 'arrow');
            arrow.angle = 90;
            arrow.scale = .1;

            arrow.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage(`A ${rightdoor}.`)
                    arrow.scale +=.1;
                })
                .on('pointerout',()=> {
                    arrow.scale -=.1;
                })
                .on('pointerdown',()=> {
                    //if don't need key, just go to room
                    if (rightdoorkey == null) {
                        this.gotoScene(`${rightlocation}`);
                        return;
                    }
                    //else, call doorlogic
                    else {
                    this.doorlogic(`${rightdoor}`,`${rightdoorkey}`, `${rightlocation}`);
                    }
                })
        }
    }
}