import { Sprite } from "@jaymar921/2dgraphic-utils/utility/Sprite";

/**
 * 
 * @param {Sprite} sprite1 
 * @param {Sprite} sprite2 
 */
export const IsColide = (sprite1, sprite2) => {
    // sprite 1 position x, y, and max x, y
    const s1minX = sprite1.posX;
    const s1maxX = s1minX + (sprite1.width * sprite1.scale);
    const s1minY = sprite1.posY;
    const s1maxY = s1minY + (sprite1.height * sprite1.scale);

    const s2centerX = sprite2.posX - (sprite2.width/2) * sprite2.scale;
    const s2centerY = sprite2.posY - (sprite2.height/2) * sprite2.scale;
    
    return s2centerX > s1minX && s2centerX < s1maxX && s2centerY > s1minY && s2centerY < s1maxY;
}