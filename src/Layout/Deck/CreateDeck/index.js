import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createDeck } from "../../../utils/api";
import "bootstrap-icons/font/bootstrap-icons.css";

function CreateDeck() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    const newDeck = { name, description };
    createDeck(newDeck, abortController.signal)
      .then((response) => {
        history.push(`/decks/${response.id}`);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    return () => {
      abortController.abort();
    };
  };

  return (
    <>
      <div className="container">
        <div className="border mt-2 bg-light p-2 row">
          <a href="/">
            <i className="bi bi-house-fill"></i> Home
          </a>
          <p className="text-secondary my-auto">&nbsp;/&nbsp;</p>
          <p className="text-secondary my-auto">Create Deck</p>
        </div>
      </div>
      <h3 className="my-3">Create Deck</h3>
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
                  placeholder="Deck Name"
                ></input>
              </div>
            </li>
            <li>
              <label className="row">Description</label>
              <div className="row">
                <textarea
                  className="col-lg border bg-light pb-5"
                  name="description"
                  placeholder="Brief description of the deck"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </li>
          </ul>
        </div>

        <button onClick={() => history.push("/")} className="btn btn-secondary">
          Cancel
        </button>

        <button className="btn btn-primary ml-2" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default CreateDeck;
