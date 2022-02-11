import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../../../utils/api";
import CardForm from "../CardForm";

/*didnt understand instruction to use readDeck
to then use readDeck when both object
ID's are available through params*/
function EditCard() {
  const [deck, setDeck] = useState({});
  const [card, setCard] = useState({});
  const { deckId, cardId } = useParams();
  const history = useHistory();
  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then(setDeck)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    readCard(cardId, abortController.signal)
      .then(setCard)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [cardId]);

  const submitHandler = (e) => {
    e.preventDefault();
    async function formSubmission() {
      await updateCard(card).then(setCard);
      history.push(`/decks/${deckId}`);
    }
    formSubmission();
  };
  //prevents error, accessing values of an empty object
  if (!card) return null;
  return (
    <>
      <div className="border bg-light row align-items-center p-1">
        <a href="/">
          <i className="bi bi-house-fill"></i> Home
        </a>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <a href={`/decks/${deckId}`}>{deck.name}</a>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <p className="text-secondary my-auto">Edit Card {cardId}</p>
      </div>
      <h3 className="my-3">Edit Card</h3>
      <CardForm card={card} setCard={setCard} />
      <div className="row">
        <button
          onClick={() => history.push(`/decks/${deckId}`)}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button onClick={submitHandler} className="btn btn-primary ml-2">
          Submit
        </button>
      </div>
    </>
  );
}

export default EditCard;
