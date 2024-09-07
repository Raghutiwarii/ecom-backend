import mongoose from "mongoose";

const CounterSceham = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", CounterSceham);
export default Counter;
