import React, { useEffect, useState } from "react";
import { readDeck } from "../../../utils/api";
import { useParams, useHistory, Link } from "react-router-dom";
import { createCard } from "../../../utils/api";
import CardForm from "../CardForm";

function AddCard() {
  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const history = useHistory();
  const initialState = {
    front: "",
    back: "",
    deckId,
  };
  const [card, setCard] = useState(initialState);

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

  const submitHandler = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    createCard(deckId, card, abortController.signal).catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });
    setCard(initialState);
    return () => {
      abortController.abort();
    };
  };

  return (
    <>
      <div className="border bg-light row align-items-center p-1">
        <Link to="/">
          <i className="bi bi-house-fill"></i> Home
        </Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <p className="text-secondary my-auto">Add Card</p>
      </div>
      <h3 className="my-3">{`${deck.name}: Add Card`}</h3>
      <CardForm setCard={setCard} card={card} />
      <div className="row">
        <button
          onClick={() => history.push(`/decks/${deckId}`)}
          className="btn btn-secondary"
        >
          Done
        </button>
        <button onClick={submitHandler} className="btn btn-primary ml-2">
          Save
        </button>
      </div>
    </>
  );
}

export default AddCard;
