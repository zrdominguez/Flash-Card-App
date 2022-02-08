import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { deleteDeck } from "../../utils/api";

/*component that returns the format for the card that shows the deck name, 
description and amount of cards*/
function HomeDeckView({ deck, setDecks, listDecks }) {
  //custom function that shows confirm window before a delete request
  function deleteMessage(deckId) {
    if (
      window.confirm("Delete this deck?\n\nYou will not be able to recover.")
    ) {
      //deletes deck from database and lists the remaining decks to state variable decks
      async function deleteHomeDeck() {
        const abortController = new AbortController();
        await deleteDeck(deckId, abortController.signal);
        listDecks(abortController.signal)
          .then(setDecks)
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error(error);
            } else {
              throw error;
            }
          });
      }
      deleteHomeDeck();
    }
  }

  return (
    <div className="border mt-2">
      <div className="d-flex justify-content-between">
        <h3 className="ml-3">{deck.name}</h3>
        <p className="mr-3">{deck.cards.length} cards</p>
      </div>

      <p className="ml-3">{deck.description}</p>
      <div className="d-flex mb-2">
        <Link to={`/decks/${deck.id}`}>
          <button className="btn btn-secondary p2 ml-3">
            <i className="bi bi-eye-fill"></i> View
          </button>
        </Link>
        <Link to={`/decks/${deck.id}/study`}>
          <button className="btn btn-primary p2 ml-2">
            <i className="bi bi-book"></i> Study
          </button>
        </Link>
        <button
          onClick={() => {
            deleteMessage(deck.id);
          }}
          className="btn btn-danger ml-auto p2 mr-3 "
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default HomeDeckView;
