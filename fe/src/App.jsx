import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ImageConverter from "./components/ImageConverter";
import PdfConverter from "./components/PdfConverter";
import DocumentConverter from "./components/DocumentConverter";
import AudioConverter from "./components/AudioConverter";
import VideoConverter from "./components/VideoConverter";
import VideoToAudio from "./components/VideoToAudio";
import UnitConverter from "./components/UnitConverter";
import ColorConverter from "./components/ColorConverter";
import Footer from "./components/Footer";
import TermsOfService from "./components/TermsOfService";
import HelpCenter from "./components/HelpCenter";
import PrivacyPolicy from "./components/PrivacyPolicy";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import About from "./components/About";
import { useLanguage } from "./LanguageContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "image":
        return <ImageConverter />;
      case "pdf":
        return <PdfConverter />;
      case "document":
        return <DocumentConverter />;
      case "audio":
        return <AudioConverter />;
      case "video":
        return <VideoConverter />;
      case "video-to-audio":
        return <VideoToAudio />;
      case "unit":
        return <UnitConverter />;
      case "color":
        return <ColorConverter />;
      case "terms":
        return <TermsOfService />;
      case "help":
        return <HelpCenter />;
      case "privacy":
        return <PrivacyPolicy />;
      case "faq":
        return <FAQ />;
      case "contact":
        return <Contact />;
      case "about":
        return <About />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FAFAFA",
      }}
    >
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1 }}>
        {activeTab === "home" ? (
          renderContent()
        ) : (
          <div
            style={{
              paddingTop: "6.5rem",
              paddingBottom: "4rem",
              paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
              paddingRight: "clamp(1.5rem, 5vw, 5rem)",
              maxWidth: "80rem",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* Back to home */}
            <div style={{ maxWidth: "52rem", margin: "0 auto 1.75rem auto" }}>
              <button
                onClick={() => setActiveTab("home")}
                style={{
                  background: "white",
                  border: "1.5px solid #F3F4F6",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#6B7280",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem 0.5rem 0.75rem",
                  borderRadius: "9999px",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#F97316";
                  e.currentTarget.style.color = "#F97316";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(249,115,22,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#F3F4F6";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 4px rgba(0,0,0,0.06)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                {t("backToHome")}
              </button>
            </div>
            <div className="animate-fade-in-up">{renderContent()}</div>
          </div>
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
