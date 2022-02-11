import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck, updateDeck } from "../../../utils/api";

function EditDeck() {
  /*have both name and description as use state variables
  for user to modify. Did not want user to modify actual deck
  values before submit handler was called*/
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deck, setDeck] = useState({});
  const { deckId } = useParams();
  const history = useHistory();
  /*submit handler which assignes both the use state variables
description and name to object deck*/
  const submitHandler = (e) => {
    e.preventDefault();
    async function updateForm() {
      const updatedDeck = { ...deck, name, description };
      await updateDeck(updatedDeck).then(setDeck);
      history.push(`/decks/${deckId}`);
    }
    updateForm();
  };

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then((deck) => {
        setDeck(deck);
        setName(deck.name);
        setDescription(deck.description);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  return (
    <>
      <div className="border bg-light row align-items-center p-1">
        <Link to="/">
          <i className="bi bi-house-fill"></i> Home
        </Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
        <p className="text-secondary my-auto">Edit Deck</p>
      </div>
      <h3 className="my-3">{`Edit Deck`}</h3>

      <form onSubmit={submitHandler}>
        <div className="container">
          <ul style={{ listStyle: "none" }} className="p-0">
            <li>
              <label className="row">Name</label>
              <div className="row">
                <input
                  className="col-lg border bg-light"
                  name="deckName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Deck name"
                ></input>
              </div>
            </li>
            <li>
              <label className="row">Description</label>
              <div className="row">
                <textarea
                  className="col-lg border bg-light pb-5"
                  name="description"
                  placeholder="Deck description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </li>
          </ul>
        </div>

        <button
          onClick={() => history.push(`/decks/${deckId}`)}
          className="btn btn-secondary"
        >
          Cancel
        </button>

        <button className="btn btn-primary ml-2" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default EditDeck;
