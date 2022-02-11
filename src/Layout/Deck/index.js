import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../../utils/api";
//this is the Deck View Component
function Deck() {
  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const history = useHistory();
  //made two seperate functions for deleting cards and deck
  function deleteCardMsg(cardId) {
    if (
      window.confirm(
        `Delete this card? \n\nYou will not be able to recover it.`
      )
    ) {
      async function deletingCard() {
        await deleteCard(cardId);
        readDeck(deckId).then(setDeck);
      }
      deletingCard();
    }
  }

  function deleteDeckMsg() {
    if (
      window.confirm(
        `Delete this card? \n\nYou will not be able to recover it.`
      )
    ) {
      async function deletingDeck() {
        await deleteDeck(deckId);
        history.push("/");
      }
      deletingDeck();
    }
  }
  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then(setDeck)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [deckId]);
  /*checks to see if deck.cards has been rendered
  before using cards array for react elements*/
  if (!deck.cards) return null;

  return (
    <>
      <div className="container">
        <div className="border mt-2 bg-light p-2 row">
          <Link to="/">
            <i className="bi bi-house-fill"></i> Home
          </Link>
          <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
          <p className="text-secondary my-auto">{deck.name}</p>
        </div>
      </div>
      <div>
        <h5 className="mt-2">{deck.name}</h5>

        <p className="">{deck.description}</p>
        <div className="d-flex mb-2">
          <button
            onClick={() => history.push(`/decks/${deckId}/edit`)}
            className="btn btn-secondary p2"
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button
            onClick={() => history.push(`/decks/${deck.id}/study`)}
            className="btn btn-primary p2 ml-2"
          >
            <i className="bi bi-book"></i> Study
          </button>
          <button
            onClick={() => history.push(`/decks/${deck.id}/cards/new`)}
            className="btn btn-primary p2 ml-2"
          >
            <i className="bi bi-plus-lg"></i> Add Cards
          </button>
          <button
            onClick={() => {
              deleteDeckMsg();
            }}
            className="btn btn-danger ml-auto p2 mr-3 "
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <h4 className="mt-3">Cards</h4>

      {deck.cards.map((card) => (
        <div className="container border" key={card.id}>
          <div className="row">
            <div className="col mt-2 ml-3">{card.front}</div>
            <div className="col mt-2">
              {card.back}
              <div className="mt-4 mb-2">
                <button
                  onClick={() =>
                    history.push(`/decks/${deck.id}/cards/${card.id}/edit`)
                  }
                  className="btn btn-secondary"
                  style={{ marginLeft: "90px" }}
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>

                <button
                  className="btn btn-danger ml-2 "
                  onClick={() => {
                    deleteCardMsg(card.id);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Deck;
