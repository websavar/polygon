import React from 'react';
import Navbar from 'components/Navbar/navbar';
import Footer from 'components/Footer/footer';
import Polygon from 'components/Polygon/polygon';
import 'assets/sass/styles.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>

      <main>
        <Polygon />
      </main>

      <Footer />
    </div>
  );
}

export default App;
