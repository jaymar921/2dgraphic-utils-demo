import { useEffect, useState } from "react";
import "./App.css";
import AnimImage from "./assets/idle.png";
import BootsImage from "./assets/boots.png";
import GoldCoinImage from "./assets/coin.png";
import QMark from "./assets/qmark-icon.png";
import ItemPlopSFX from "./assets/item_plop.mp3";
import BarrelImage from "./assets/barrel.png";
import CodeImage from "./assets/code.png";
import { CanvasScreen, Sprite, SpriteType } from "@jaymar921/2dgraphic-utils";
import { Player } from "./objects/Player";
import { IsCollide } from "./objects/HitboxUtil";
import Modal from "./components/Modal";

function App() {
  const [canvasScreen, setCanvasScreen] = useState(null);
  const [globalScale, setGlobalScale] = useState(1);
  const [showPickupItemModal, setShowPickupItemModal] = useState({
    show: false,
    display: "",
    objID: null,
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleZoom(e) {
    setGlobalScale(e.globalScale);
  }

  useEffect(() => {
    if (canvasScreen) return;
    // bind the CanvasScreen to the canvas element
    const w = window.innerWidth;
    const h = window.innerHeight;
    const screen = new CanvasScreen("my-canvas", w, h, "rgba(0,0,0,0)");
    screen.enableScreenDrag(true);
    screen.enableScreenZoom(true);

    screen.handleScreenZoomEvent(handleZoom);

    const direction = {
      x: w / 2 - (156 / 2) * 0.5,
      y: h / 2 - (116 / 2) * 0.5,
    };

    const player = new Player({
      objID: "player-1",
      posX: direction.x - (156 / 2) * 0.5,
      posY: direction.y - (116 / 2) * 0.5,
      imageSource: AnimImage,
      frames: 11,
      frameBuffer: 4,
      scale: 0.5,
      type: SpriteType.PLAYER,
      velocity: 1,
    });

    const bootsItem = new Sprite({
      objID: "bootsItem1",
      name: "Boots of speed",
      posX: direction.x + 150,
      posY: direction.y + 200,
      imageSource: BootsImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const bootsItem1 = new Sprite({
      objID: "bootsItem2",
      name: "Boots of speed",
      posX: direction.x - 100,
      posY: direction.y - 100,
      imageSource: BootsImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const bootsItem2 = new Sprite({
      objID: "bootsItem3",
      name: "Boots of speed",
      posX: direction.x + 30,
      posY: direction.y + 60,
      imageSource: BootsImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const coin1 = new Sprite({
      objID: "gc-1",
      name: "Gold Coins",
      posX: direction.x + 170,
      posY: direction.y + 300,
      imageSource: GoldCoinImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const coin2 = new Sprite({
      objID: "gc-2",
      name: "Gold Coins",
      posX: direction.x - 90,
      posY: direction.y + 240,
      imageSource: GoldCoinImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const coin3 = new Sprite({
      objID: "gc-3",
      name: "Gold Coins",
      posX: direction.x + 120,
      posY: direction.y - 240,
      imageSource: GoldCoinImage,
      scale: 1,
      type: SpriteType.ITEM,
    });

    const qmark = new Sprite({
      objID: "qm-1",
      name: "JayMar's portfolio",
      posX: direction.x + 50,
      posY: window.innerHeight - 78,
      imageSource: QMark,
      scale: 0.06,
      type: SpriteType.STATIC,
    });

    const code = new Sprite({
      objID: "c-1",
      name: "Documentation",
      posX: direction.x - 20,
      posY: window.innerHeight - 80,
      imageSource: CodeImage,
      scale: 0.07,
      type: SpriteType.STATIC,
    });

    const barrel = new Sprite({
      objID: "b-1",
      name: "Barrel",
      posX: direction.x + 220,
      posY: direction.y - 120,
      imageSource: BarrelImage,
      scale: 0.05,
      type: SpriteType.OBJECT,
    });

    screen.registerObject(bootsItem);
    screen.registerObject(bootsItem1);
    screen.registerObject(bootsItem2);
    screen.registerObject(coin1);
    screen.registerObject(coin2);
    screen.registerObject(coin3);
    screen.registerObject(qmark);
    screen.registerObject(code);
    screen.registerObject(barrel);
    screen.registerObject(player);

    screen.handleScreenClickedEvent((e) => {
      direction.x =
        (e.mousePosition.x -
          (player.width / 2) * player.scale * screen.globalScale) /
        screen.globalScale;
      direction.y =
        (e.mousePosition.y -
          (player.height / 2) * player.scale * screen.globalScale) /
        screen.globalScale;
    });

    setCanvasScreen(screen);

    async function alterMovement() {
      while (true) {
        await sleep(20);

        if (CanvasScreen.screenMoving) {
          direction.x = player.posX;
          direction.y = player.posY;
          continue;
        }

        let velocityX = player.velocity;
        let velocityY = player.velocity;

        let nearItem = null;
        let collided = false;
        for (const obj of screen.getAllRegisteredObjects()) {
          if (
            obj.type !== SpriteType.ITEM &&
            obj.type !== SpriteType.STATIC &&
            obj.type !== SpriteType.OBJECT
          )
            continue;

          const cameraOffset = screen.getCameraOffset();
          const collision = IsCollide(player, obj, cameraOffset);

          let collisionX = collision[1];
          let collisionY = collision[2];

          if (collision[0]) {
            // show pop up
            nearItem = obj;
            if (obj.type === SpriteType.OBJECT) {
              if (collisionX) {
                velocityX = -player.velocity;
                collided = true;
              }
              if (collisionY) {
                velocityY = -player.velocity;
                collided = true;
              }
            }
            break;
          }
        }

        // move player based on updated direction
        if (player.posX < direction.x) {
          player.posX += velocityX;
        }
        if (player.posX > direction.x) {
          player.posX -= velocityX;
        }
        if (player.posY > direction.y) {
          player.posY -= velocityY;
        }
        if (player.posY < direction.y) {
          player.posY += velocityY;
        }

        if (collided) {
          direction.x = player.posX;
          direction.y = player.posY;
          nearItem = null;
        }

        if (nearItem) {
          setShowPickupItemModal({
            show: true,
            display: nearItem.name,
            objID: nearItem.objID,
          });
        } else {
          setShowPickupItemModal({ show: false, display: "", objID: null });
        }
      }
    }

    setTimeout(alterMovement, 100);
  }, [canvasScreen]);

  function pickupItem() {
    if (showPickupItemModal.objID) {
      if (showPickupItemModal.display === "Boots of speed") {
        const player = canvasScreen.getRegisteredObject("player-1");
        player.velocity += 1;
        player.frameBuffer -= 1;
      }

      if (showPickupItemModal.display === "Documentation") {
        window.location.href = "https://github.com/jaymar921/2dgraphic-utils";
        return;
      }

      if (showPickupItemModal.display === "JayMar's portfolio") {
        window.location.href = "https://jayharronabejar.vercel.app";
        return;
      }

      let audio = new Audio(ItemPlopSFX);
      audio.currentTime = 2;
      audio.play();

      setShowPickupItemModal({ show: false, display: "" });
      canvasScreen.unregisterObject(showPickupItemModal.objID);
    }
  }

  return (
    <>
      {showPickupItemModal.show && (
        <Modal
          handleCallback={pickupItem}
          display={showPickupItemModal.display}
        />
      )}
      <h1 className="z-[-99999] text-center font-bold text-white text-2xl pt-2 select-none">
        Basic 2D Canvas Screen
      </h1>
      <p className="z-[-99999] text-sm text-center text-yellow-400 select-none">
        Tap anywhere on screen to move the character
      </p>
      <p className="z-[-99999] text-sm text-center text-yellow-400 select-none">
        Hold and drag to move the canvas camera
      </p>
      <canvas
        id="my-canvas"
        className="z-[1] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      ></canvas>

      <footer className="z-[-99999] absolute bottom-1 text-center w-screen text-slate-400 text-md font-semibold">
        Created by{" "}
        <a href="https://jayharronabejar.vercel.app" target="_blank">
          JayMar921
        </a>
      </footer>
    </>
  );
}

export default App;
