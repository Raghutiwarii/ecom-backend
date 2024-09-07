import { Customer, Admin, DeliveryPartner } from "../../models/user.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const generateJwtToken = async (user) => {
  const accessToken = jwt.sign(
    {
      userID: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      userID: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await new Customer({
        phone,
        role: "Customer",
      });
    }
    await customer.save();

    if (!customer.isActivated) {
      return res.status(500).send({
        message: "user is not active",
      });
    }

    const { accessToken, refreshToken } = await generateJwtToken(customer);

    return res.status(201).send({
      message: "successfully created",
      accessToken: accessToken,
      refreshToken: refreshToken,
      customer,
    });
  } catch (err) {
    return res.status(500).send({
      message: "error while login",
    });
  }
};

export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    let deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return res.status(500).send({
        message: "Delivery partner is not registered with us",
      });
    }

    const isPassMatched = password === deliveryPartner.password;

    if (!isPassMatched) {
      return res.status(500).send({
        message: "Wrong Password",
      });
    }

    const { accessToken, refreshToken } = await generateJwtToken(
      deliveryPartner
    );

    return res.status(201).send({
      message: "successfully created",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (err) {
    return res.status(500).send({
      message: "error while login",
    });
  }
};

export const doRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(500).send({
      message: "refresh token required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userID);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userID);
    } else {
      return res.status(403).send({
        message: "Invalid role",
      });
    }
    if (!user) {
      return res.status(403).send({
        message: "Invalid user",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      generateJwtToken(user);

    return res.status(200).send({
      message: "successfully refresh the token",
      refreshToken: newRefreshToken,
      accessToken,
    });
  } catch (err) {
    return res.status(500).send({
      message: "invalid refresh token",
    });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { userID, role } = req.user;
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userID);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userID);
    } else {
      console.error("Invalid role:", role);
      return res.status(403).send({
        message: "Invalid role",
      });
    }

    if (!user) {
      console.error("Invalid user ID:", userID);
      return res.status(403).send({
        message: "Invalid user",
      });
    }

    return res.status(200).send({
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;
    const updateData = req.body;
    const user =
      (await Customer.findById(userID)) ||
      (await DeliveryPartner.findById(userID));

    if (!user) {
      console.error("Invalid user ID:", userID);
      return res.status(403).send({
        message: "Invalid user",
      });
    }

    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      console.error("Invalid role:", role);
      return res.status(403).send({
        message: "Invalid role",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userID,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(403).send({
        message: "Error while updating the user",
      });
    }

    return res.status(200).send({
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).send({
      message: "Something went wrong while update details",
    });
  }
};
