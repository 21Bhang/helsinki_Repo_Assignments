const Filter = ({ filter, setFilter }) => {
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const style = {
    marginBottom: 20,
    marginTop: 10,
  };

  return (
    <div style={style}>
      <label
        htmlFor="search-input"
        style={{ fontWeight: "bold", marginRight: 5 }}
      >
        Filter:
      </label>
      <input
        id="search-input"
        value={filter}
        onChange={handleChange}
        placeholder="Type to filter..."
        style={{ padding: "5px", width: "250px" }}
      />
    </div>
  );
};

export default Filter;
