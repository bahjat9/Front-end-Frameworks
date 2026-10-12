import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ApiConfigModal from "./components/ApiConfigModal";
import HeaderComp from "./components/HeaderComp";
import { AppProvider } from "./context/AppContext";
import { getConfiguredApiKey, saveApiKey } from "./data/movieService";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKey, setApiKey] = useState(getConfiguredApiKey);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);

  const handleSaveApiKey = (value: string) => {
    saveApiKey(value);
    setApiKey(getConfiguredApiKey());
    setIsApiConfigOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <HeaderComp
          searchQuery={searchQuery}
          onChange={setSearchQuery}
          onOpenApiConfig={() => setIsApiConfigOpen(true)}
          showWatchlist={showWatchlist}
          onToggleWatchlist={setShowWatchlist}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                apiKey={apiKey}
                showWatchlist={showWatchlist}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {isApiConfigOpen && (
          <ApiConfigModal
            apiKey={apiKey}
            onClose={() => setIsApiConfigOpen(false)}
            onSave={handleSaveApiKey}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;