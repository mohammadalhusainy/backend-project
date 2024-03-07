import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interface/user";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
    verifyToken: {
      type: Boolean,
      default: false,
    },
    access_token: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

// userSchema.set("toJSON", {
//     transform: function (doc, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//     }
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
