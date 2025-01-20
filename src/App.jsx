import { useEffect, useState } from "react";
import "./App.css";
import AnimImage from "./assets/idle.png";
import BootsImage from "./assets/boots.png";
import GoldCoinImage from "./assets/coin.png";
import QMarkImage from "./assets/qmark-icon.png";
import ItemPlopSFX from "./assets/item_plop.mp3";
import { CanvasScreen, Sprite } from "./@jaymar921/2dgraphic-utils";
import { SpriteType } from "./@jaymar921/2dgraphic-utils/utility/SpriteType";
import { Player } from "./objects/Player";
import { IsColide } from "./objects/HitboxUtil";
import Modal from "./components/Modal";

function App() {
  const [canvasScreen, setCanvasScreen] = useState(null);
  const [showPickupItemModal, setShowPickupItemModal] = useState({
    show: false,
    display: "",
    objID: null,
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (canvasScreen) return;
    // bind the CanvasScreen to the canvas element
    const w = window.innerWidth;
    const h = window.innerHeight;
    const screen = new CanvasScreen("my-canvas", w, h, "rgba(0,0,0,0)");
    screen.enableScreenDrag(true);

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

    const qmark = new Sprite({
      objID: "qm-1",
      name: "Source Code",
      posX: direction.x + 110,
      posY: direction.y - 180,
      imageSource: QMarkImage,
      scale: 0.05,
      type: SpriteType.ITEM,
    });

    screen.registerObject(bootsItem);
    screen.registerObject(bootsItem1);
    screen.registerObject(coin1);
    screen.registerObject(coin2);
    screen.registerObject(qmark);
    screen.registerObject(player);

    screen.handleScreenClickedEvent((e) => {
      direction.x = e.mousePosition.x - (player.width / 2) * player.scale;
      direction.y = e.mousePosition.y - (player.height / 2) * player.scale;
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

        // move player based on updated direction
        if (player.posX < direction.x) {
          player.posX += player.velocity;
        }
        if (player.posX > direction.x) {
          player.posX -= player.velocity;
        }
        if (player.posY > direction.y) {
          player.posY -= player.velocity;
        }
        if (player.posY < direction.y) {
          player.posY += player.velocity;
        }

        let nearItem = null;
        for (const obj of screen.canvasObjects) {
          if (obj.type !== SpriteType.ITEM) continue;

          if (IsColide(player, obj)) {
            // show pop up
            nearItem = obj;
            break;
          }
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
  }, []);

  function pickupItem() {
    if (showPickupItemModal.objID) {
      if (showPickupItemModal.display === "Boots of speed") {
        const player = canvasScreen.getRegisteredObject("player-1");
        player.velocity += 1;
        player.frameBuffer -= 1;
      }

      if (showPickupItemModal.display === "Source Code") {
        window.location.href = "https://github.com/jaymar921/2dgraphic-utils";
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
      <h1 className="text-center font-bold text-white text-2xl pt-2">
        Basic 2D Canvas Screen
      </h1>
      <p className="text-sm text-center text-yellow-400">
        Tap anywhere on screen to move the character
      </p>
      <canvas
        id="my-canvas"
        className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      ></canvas>

      <footer className="absolute bottom-1 text-center w-screen text-slate-400 text-md font-semibold">
        Created by{" "}
        <a href="https://jayharronabejar.vercel.app" target="_blank">
          JayMar921
        </a>
      </footer>
    </>
  );
}

export default App;
