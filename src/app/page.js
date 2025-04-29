export default function Home() {
  return (
    <div>
      <header>
        <h1>Bildgalleri</h1>
      </header>
      <nav>
        <a>Sök</a>
        <a>Mitt galleri</a>
      </nav>
      <main>
        <h2>Sök efter bilder här</h2>
        <p>Ange en tagg för att söka efter matchande bilder</p>
        <div>
          <label htmlFor="search-field">Sökfält:</label>
          <input type="text" id="search-field" placeholder="Tagg..."></input>
        </div>
        <div>
          <ul id="image-list"></ul>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
