import bcrypt from "bcryptjs";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //CHECK EXISTING USER
    const user = await User.findOne({
      where: { email: req.body.email, username: req.body.username },
    });
    if (user) {
      return res.status(409).json("User already exists!");
    }

    //Hash the password and create a user
    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPw,
    });
    return res.status(200).json("User has being created.");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    //CHECK IF USER EXIST
    const user = await User.findOne({
      where: { username: req.body.username },
    });
    if (!user) {
      return res.status(409).json("User does not exist!");
    }

    //UNHASH PASSWORD
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json("Wrong username or password.");
    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    const { password, ...others } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.log(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User logged out");
};
