import { Sprite, SpriteType} from "@jaymar921/2dgraphic-utils";

export class Player extends Sprite{
    constructor({objID, posX, posY, width, height, imageSource, animations, frames = 1, frameBuffer = 3, loop = true, autoPlay = true, scale=1, imageSmoothingEnabled = false, type = SpriteType.OBJECT, velocity = 1}) {
        super({objID, posX, posY, width, height, imageSource, animations, frames, frameBuffer, loop, autoPlay, scale, imageSmoothingEnabled, type});
        this.velocity = velocity;
    }
}