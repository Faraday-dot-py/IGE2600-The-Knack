
import { useGameStore } from './store/gameStore';
import { HomeScreen, LevelSelectScreen, LevelScreen } from './screens';
import './App.css';

function App() {
  const currentScreen = useGameStore(state => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'levelSelect':
        return <LevelSelectScreen />;
      case 'level':
        return <LevelScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
