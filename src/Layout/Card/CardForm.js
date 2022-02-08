import React from "react";

//reusable form for both EditCard and AddCard components
function CardForm({ card, setCard }) {
  const changeHandler = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };
  return (
    <form>
      <div className="container">
        <h5 className="row">Front</h5>
        <div className="row">
          <textarea
            className="col mb-3"
            placeholder="Front side of card"
            name="front"
            value={card.front}
            onChange={changeHandler}
          ></textarea>
        </div>

        <h5 className="row ">Back</h5>
        <div className="row">
          <textarea
            className="col mb-3"
            placeholder="Back side of card"
            name="back"
            value={card.back}
            onChange={changeHandler}
          ></textarea>
        </div>
      </div>
    </form>
  );
}
export default CardForm;
