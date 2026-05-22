import { useEffect, useState } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    personService.getAll().then(setPersons);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    // Client-side check for instant red feedback
    if (newName.trim().length < 3) {
      showNotification(
        `Name "${newName}" is too short. Minimum length is 3 characters.`,
        "error",
      );
      return;
    }

    const existing = persons.find((p) => p.name === newName);

    if (existing) {
      if (
        window.confirm(`${newName} is already added. Replace the old number?`)
      ) {
        personService
          .update(existing.id, { name: newName, number: newNumber })
          .then((updated) => {
            setPersons(
              persons.map((p) => (p.id === existing.id ? updated : p)),
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${updated.name}`);
          })
          .catch((error) => {
            const msg = error.response?.data?.error || "Update failed";
            showNotification(msg, "error");
          });
      }
      return;
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((created) => {
        setPersons(persons.concat(created));
        setNewName("");
        setNewNumber("");
        showNotification(`Added ${created.name}`);
      })
      .catch((error) => {
        const msg = error.response?.data?.error || "Add failed";
        showNotification(msg, "error");
      });
  };

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        showNotification(`Deleted ${person.name}`);
      })
      .catch(() => {
        showNotification(
          `${person.name} was already removed from the server`,
          "error",
        );
        setPersons(persons.filter((p) => p.id !== person.id));
      });
  };

  const visible = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <div>
        filter shown with:{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h3>Numbers</h3>
      <ul>
        {visible.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => deletePerson(person)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
