import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeDeckView from "./HomeDeckView";
import { listDecks } from "../../utils/api";

function Home() {
  const [decks, setDecks] = useState([]);
  //loaded all decks in database to state variable decks
  useEffect(() => {
    const abortController = new AbortController();
    listDecks(abortController.signal)
      .then(setDecks)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <>
      {/*create deck link*/}
      <Link to="/decks/new">
        <button className="btn btn-secondary">
          <i className="bi bi-plus-lg"></i> Create Deck
        </button>
      </Link>

      {/* mapping each deck and passing it as prop to component HomeDeckView*/}
      {decks.map((deck) => {
        return (
          <HomeDeckView
            key={deck.id}
            deck={deck}
            setDecks={setDecks}
            listDecks={listDecks}
          />
        );
      })}
    </>
  );
}

export default Home;
