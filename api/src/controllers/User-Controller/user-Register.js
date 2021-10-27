const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { users } = require("../../db");
const authConfing = require("../../config/auth");
const register = async (req, res) => {
  try {
    let {
      name,
      surname,
      profileImg,
      mail,
      phone,
      location,
      password,
      userType,
    } = req.body;

    let userData = await users.findOne({
      where: {
        mail: mail,
      },
    });

    if (!userData) {
      if (password.length < 6) {
        return res.json({
          msg: "La contraseña debe tener mas de 6 caracteres",
        });
      } else {
        let passHash = await bcrypt.hash(password, +authConfing.rounds);
        let user = await users.create({
          name,
          surname,
          profileImg,
          mail,
          phone,
          location,
          userType,
          password: passHash,
        });
        if (user) {
          let token = jwt.sign({ user: user }, authConfing.secret, {
            expiresIn: "9999 days",
          });
          res.status(200).json({
            msg: "Usuario registrado correctamente",
            user: user,
            token: token,
          });
        }
      }
    }
    if (!password) {
      return res.json({ msg: "Debe ingresar una contraseña" });
    }
  } catch (err) {
    console.log("rompo en el register controller", err);
  }
};

module.exports = register;
