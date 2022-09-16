const mongoose = require("mongoose");

const MappingSchema = new mongoose.Schema({
  cisco: {
    type: String,
    required: true,
  },
  juniper: {
    type: String,
    required: true,
  },
  params: {
    type: Array,
  }
});

const Mapping = mongoose.model("Mapping", MappingSchema,'mappings');

module.exports = {Mapping};