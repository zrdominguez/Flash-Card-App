import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck } from "../../../utils/api";

function StudyDeck() {
  const [deck, setDeck] = useState({});
  //used a counter to keep track of card order and iterate
  const [counter, setCounter] = useState(0);
  const [flip, setFlip] = useState(false);
  const history = useHistory();
  const { deckId } = useParams();

  /*function for the restart prompt and changes state variables to their 
  initial values or takes user back to home screen*/
  function restartMessage() {
    if (
      window.confirm(
        "Restart cards? \n\n Click 'cancel' to return to the home page"
      )
    ) {
      setCounter(0);
      setFlip(false);
    } else {
      history.push("/");
    }
  }

  const flipHandler = () => {
    if (!flip) return setFlip(!flip);
  };

  const nextHandler = () => {
    if (counter + 1 < deck.cards.length) {
      setCounter((counter) => counter + 1);
      return setFlip(!flip);
    }
    //calls restart message when when counter === deck.cards.length
    restartMessage();
  };
  /*function that checks to see if enough
cards are in cards array to study*/
  function checkCardAmount() {
    return deck.cards.length < 3
      ? `You need atleast 3 cards to study. There are ${deck.cards.length} cards in this deck`
      : flip === false
      ? deck.cards[counter].front
      : deck.cards[counter].back;
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
      <div className="border bg-light row align-items-center p-1">
        <Link to="/">
          <i className="bi bi-house-fill"></i> Home
        </Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <p className="text-secondary my-auto">Study</p>
      </div>
      
      <h3 className="my-3">{`Study: ${deck.name}`}</h3>

      {/*if there is not enought cards to study, display not enough cards*/}
      {deck.cards.length < 3 ? <h5>Not Enough Cards</h5> : null}
      
      <div className="border mt-2 py-3">
        <h5 className="ml-3">{`Card ${counter + 1} of ${
          deck.cards?.length
        }`}</h5>
        <p className="ml-3">{`${checkCardAmount()}`}</p>
        <div className="ml-3">
          {/*flip button on shows when deck.cards is atleast 3
          elements long and only changes state variable 'flip' to true*/}
          <button
            className={`btn btn-secondary ${
              deck.cards.length >= 3 ? "d-inline-block" : "d-none"
            }`}
            onClick={flipHandler}
          >
            Flip
          </button>
          {/*next button only appears when card is flipped, iterates counter 
          by 1 and sets flip state variable back to false*/}
          {flip ? (
            <button className="btn btn-primary ml-2 " onClick={nextHandler}>
              Next
            </button>
          ) : null}
          {/*add cards button is invisible until deck.cards.length is less
          than 3 */}
          <button
            onClick={() => history.push(`/decks/${deckId}/cards/new`)}
            className={`btn btn-primary ml-2 ${
              deck.cards.length < 3 ? "d-inline-block" : "d-none"
            }`}
          >
            <i className="bi bi-plus-lg"></i> Add Cards
          </button>
        </div>
      </div>
    </>
  );
}

export default StudyDeck;
