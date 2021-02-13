import { useState } from "react";

const Form = () => {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <div className="injury-form-container">
            <button className="button-primary" id="add-new-injury-button" style={{display: isEditMode ? 'none' : ''}} onClick={() => setIsEditMode(true)}>Add new injury</button>
            <form className="injury-form" style={{display: isEditMode ? '' : 'none'}}>
                <input className="u-full-width" type="hidden" id="name" name="name" ></input>
                <p style={{fontStyle: 'italic'}}>Choose a location on the diagram, add a description, then press Save.</p>
                <label htmlFor="content">Injury description</label>
                <textarea className="u-full-width" name="content" id="content" cols="30" rows="10" required></textarea>
                <button className="button-primary" type="submit" onClick={() => setIsEditMode(false)}>Save 💪</button>
                <button className="" type="button" id="form-cancel-button" onClick={() => setIsEditMode(false)}>Cancel</button>
            </form>
        </div>
    );
  };
  
  export default Form;