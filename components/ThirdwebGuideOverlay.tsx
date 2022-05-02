import React from "react";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function ThirdwebGuideOverlay({ show, setShow }: Props) {
  return (
    <div
      style={{
        // Overlay
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 100,
        display: show ? "flex" : "none",
      }}
    >
      <div
        style={{
          // Guide
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxWidth: "90%",
          backgroundColor: "#262936",
          borderRadius: 12,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          boxShadow:
            "1px 1px 3px 1px rgb(20 0 50 / 19%), 0 0 15px 0 rgb(238 50 255 / 57%), 0 5px 53px 0 rgb(75 29 255 / 73%)",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 24,
            left: 24,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <a
            href={"https://thirdweb.com/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`/logo.png`} alt="Thirdweb Logo" width={135} />
          </a>
        </div>

        {/* Fixed position close modal button */}
        <div
          onClick={() => setShow(false)}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            border: "1px solid #fff",
            borderRadius: "50%",
            height: 30,
            width: 30,
            textAlign: "center",
          }}
        >
          <span>&times;</span>
        </div>

        <h1
          style={{
            marginTop: 64,
            marginBottom: 0,
          }}
        >
          Thirdweb Marketplace with Next.JS
        </h1>
        <p>
          Thirdweb&apos;s Marketplace allows you to List NFTs for direct sale or
          auction. On both, you can accept offers or sell your NFT for a set
          price!
        </p>

        <h3 style={{ marginBottom: 0 }}>More Resources:</h3>
        <ul style={{ textAlign: "start" }}>
          <li>
            <a
              href="https://portal.thirdweb.com/contracts/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>How the thirdweb Marketplace works</b>
            </a>
          </li>

          <li>
            <a
              href="https://docs.thirdweb.com/typescript/sdk.marketplace"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>Marketplace Technical Documentation</b>
            </a>
          </li>

          <li>
            <a
              href="https://portal.thirdweb.com/guides/auction-button-react"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>
                Build an auction button in React for your dApp with TypeScript
              </b>
            </a>
          </li>

          <li>
            <a
              href="https://portal.thirdweb.com/guides/create-your-own-auction-with-thirdweb-typescript-sdk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>Create your own auction with TypeScript</b>
            </a>
          </li>

          <li>
            <a
              href="https://portal.thirdweb.com/guides/create-your-own-marketplace-with-thirdweb-typescript-sdk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>Create your own NFT marketplace with TypeScript</b>
            </a>
          </li>

          <li>
            <a
              href="https://portal.thirdweb.com/guides/create-a-marketplace-with-python-sdk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>Create your own NFT marketplace with Python</b>
            </a>
          </li>
        </ul>

        <p>
          Have more questions?{" "}
          <a
            href="https://discord.gg/thirdweb"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9f2c9d",
              textDecoration: "none",
            }}
          >
            <b>Join our Discord!</b>
          </a>
        </p>
      </div>
    </div>
  );
}
