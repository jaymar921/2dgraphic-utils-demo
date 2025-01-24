import { Sprite, SpriteType } from "@jaymar921/2dgraphic-utils";

/**
 * Checks if sprite1 collides at the middle of sprite2.
 * 
 * @param {Sprite} sprite1 - The first sprite (collider).
 * @param {Sprite} sprite2 - The second sprite (to check the middle position).
 * @returns {boolean} True if sprite1 collides with the middle of sprite2.
 */
export const IsCollide = (sprite1, sprite2, cameraOffset) => {
    // sprite1 position (x, y) and boundaries
    const s1minX = sprite1.posX;
    const s1maxX = s1minX + (sprite1.width * sprite1.scale);
    const s1minY = sprite1.posY;
    const s1maxY = s1minY + (sprite1.height * sprite1.scale);

    let offsetx = 0;
    let offsety = 0;
    if(sprite2.type === SpriteType.STATIC){
        offsetx = cameraOffset.x;
        offsety = cameraOffset.y;
    }

    // sprite2 center position
    const s2centerX = sprite2.posX + offsetx + (sprite2.width * sprite2.scale) / 2;
    const s2centerY = sprite2.posY + offsety + (sprite2.height * sprite2.scale) / 2;

    // Check if the center of sprite2 is within sprite1's boundaries
    return s2centerX > s1minX && s2centerX < s1maxX && s2centerY > s1minY && s2centerY < s1maxY;
};