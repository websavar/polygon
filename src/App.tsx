import React from 'react';
import Navbar from 'components/Navbar/navbar';
import Footer from 'components/Footer/footer';
import Canvas from 'components/Canvas/canvas';
import 'assets/sass/styles.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>

      <main>
        <Canvas />
      </main>

      <Footer />
    </div>
  );
}

export default App;
