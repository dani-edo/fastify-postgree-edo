const noteSchema = {
  type: "object",
  required: ["id", "title", "body"],
  properties: {
    id: { type: "number", description: "Unique identifier for a spesific" },
    title: { type: "string" },
    body: { type: "string", description: "Main content of the note" },
  },
};

module.exports = {
  noteSchema,
};
