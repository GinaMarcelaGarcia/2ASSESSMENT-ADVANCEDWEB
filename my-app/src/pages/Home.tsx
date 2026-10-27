
import './HomeTrack.css';
import RandomAlbums from "./RandomAlbums.tsx";

function Home() {
  return (
    <>
      <section className="home-banner">
        <div className="home-banner-content">
          <div className="home-banner-label">
            Listen, rate and share
          </div>

          <p>
            Explore albums, discover new sounds
            and share your reviews
          </p>

          <button className="home-banner-button">
            Join Now
          </button>
        </div>
      </section>

      <RandomAlbums />
    
<section className="filter-albums">
  
<h2 className="filter-title">
  <i className="bi bi-sliders2"></i>
  Filter Albums
</h2>


  <div className="filter-options">
    <label>
      Genre
      <select>
        <option value="">All Genres</option>
        <option>Pop</option>
        <option>Rock</option>
        <option>R&B</option>
        <option>Hip-Hop</option>
      </select>
    </label>

    <label>
      Artist
      <select>
        <option value="">All Artists</option>
      </select>
    </label>

    <label>
      Release Year
      <select>
        <option value="">All Years</option>
      </select>
    </label>
  </div>
</section>




    </>
  );
}

export default Home;
