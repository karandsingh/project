import { useState } from "react";
import axios from "axios";

function App() {

  const [database, setDatabase] = useState("mysql");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const submitData = async () => {

    if (!name.trim()) {
      setMessage("Name required");
      return;
    }

    try {

      let response;

      /*
      |--------------------------------------------------------------------------
      | MYSQL SELECTED
      |--------------------------------------------------------------------------
      */

      if (database === "mysql") {

        response = await axios.post(
          "http://localhost/project/php-api/insert_mysql.php",
          {
            name
          }
        );

      }

      /*
      |--------------------------------------------------------------------------
      | MONGODB SELECTED
      |--------------------------------------------------------------------------
      */

      else {

        response = await axios.post(
          "http://localhost:5000/insert-mongo",
          {
            name
          }
        );
      }

      setMessage(response.data.message);

      setName("");

    } catch (err) {

      setMessage("Something went wrong");
    }
  };

  return (

    <div
      style={{
        width: "400px",
        margin: "100px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px"
      }}
    >

      <h2>Database Sync Form</h2>

      <div style={{ marginBottom: "20px" }}>

        <label>Select Database</label>

        <br /><br />

        <select
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
          style={{
            width: "100%",
            padding: "10px"
          }}
        >

          <option value="mysql">
            MySQL
          </option>

          <option value="mongo">
            MongoDB
          </option>

        </select>

      </div>

      <div style={{ marginBottom: "20px" }}>

        <label>Name</label>

        <br /><br />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          style={{
            width: "100%",
            padding: "10px"
          }}
        />

      </div>

      <button
        onClick={submitData}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Submit
      </button>

      <p style={{ marginTop: "20px" }}>
        {message}
      </p>

    </div>
  );
}

export default App;