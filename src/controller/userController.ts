import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { Response, Request } from "express";
import Jwt, { Secret } from "jsonwebtoken";
import { sendEmail } from "./sendEmail";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../interface/user";

// get all users

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.status(201).json({message:"user succesfull created",user:user})
  } catch (error: any) {
    res.json(error)
  }
});

const userRegister = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(401).json("User already registered");
    return;
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Passwords do not match");
  }
  try {
    await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const verifyToken = Jwt.sign(
      { firstName, lastName, email },
      process.env.REFRESH_TOKEN as Secret,
      { expiresIn: "1m" }
    );

    res.cookie("verifyToken", verifyToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
      secure: false,
    });

    await sendEmail(email, firstName, verifyToken);

    res.status(201).json({
      message: "You are successfully registered",
      verifyToken,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to create user", error: e });
  }
};

//User Login

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  const userExist = await User.findOne({ email });
  if (userExist && (await userExist.isPasswordMatched(password))) {
    if (userExist.verifyToken) {
      const { _id: userId, firstName, lastName, email, isAdmin } = userExist;
      const accessToken = Jwt.sign(
        {
          userId,
          firstName,
          lastName,
          email,
          isAdmin,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      const refreshToken = Jwt.sign(
        {
          userId,
          firstName,
          lastName,
          email,
          isAdmin,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "40s" }
      );

      await User.findByIdAndUpdate(userId, { access_token: accessToken });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        
      });
      const userInfo = jwtDecode(accessToken);
      res.status(201).json({ message: "login success", userInfo });
    } else {
      const verifyToken = Jwt.sign(
        { email },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "1m" }
      );
      res.cookie("verifyToken", verifyToken, {
        httpOnly: true,
        maxAge: 60 * 1000,
        secure: false,
      });

      await sendEmail(email, userExist.firstName, verifyToken);

      throw new Error(
        "wir haben für dich ein link geschickt verify your account"
      );
    }
  } else {
    throw new Error("userName or password ist falsh ");
  }
});

const verifyAccount = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.verifyToken;
  const { rightToken } = req.params;
  console.log("rightToken", typeof rightToken);
  console.log("Token:", typeof token);
  console.log("Cookies:", req.cookies);
  try {
    if (!token || rightToken !== token) {
      throw new Error("You don't have access");
    }

    const decodedToken = jwtDecode<IUser>(token);
    const email = decodedToken.email;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    user.verifyToken = true;
    await user.save();
    res.json({ message: "Verification successful" });
  } catch (e) {
    res.json(e.message);
  }
});

const userLogout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.status(201).json({ message: "user logout successfull" });
});

export { userRegister, verifyAccount, userLogin, userLogout,getAllUsers };
