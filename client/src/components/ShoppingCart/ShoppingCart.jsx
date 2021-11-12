import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cartResetTomi,
  fusionCartTomi,
  loadCartTomi,
} from "../../redux/cartTomi/cartActionTomi";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Divider from "@mui/material/Divider";
import CartItem from "./CartItem";
import logo from "../../assets/Logo.png";
import { getToken } from "./../../redux/users/userActions";
import jwt_decode from "jwt-decode";
import "./ShoppingCart.css";

function ShopingCart() {
  const dispatch = useDispatch();
  const history = useHistory();
  let x;
  if (localStorage.getItem("token")) {
    x = getToken();
  }
  const decoded = x ? jwt_decode(x) : null;
  const { total } = useSelector((state) => state.cartReducersTomi);
  const { items } = useSelector((state) => state.cartReducersTomi);
  let user = decoded ? decoded.user.id : null;

  useEffect(() => {
    dispatch(loadCartTomi());
  }, [dispatch, user]);

  const handleReset = () => {
    dispatch(cartResetTomi());
    history.push("/catalogue");
  };

  async function handleSubmit() {
    if (user) {
      await fusionCartTomi(user);
      await dispatch(loadCartTomi(user));
    }
  }

  function handleCatalogue() {
    history.push("/catalogue");
    window.location.replace("");
  }

  return (
    <div className="ShoppingCartContainer">
      <div className="ShoppingCartNav">
        <div className="ShoppingCartLogo">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="ShoppingCartTitle">
          <h1>Shoping Cart</h1>
        </div>
        <div className="BtnShoppingCart">
          <button onClick={handleReset} className="CartItemDelete">
            Vaciar Carrito
          </button>
          <button className="CartItemDelete">Recuperar Carrito</button>
          <button onClick={handleCatalogue} className="CartBack">
            Regresar
          </button>
        </div>
      </div>
      {items?.length ? (
        items.map((product) => {
          return (
            <CartItem
              key={product.id}
              name={product.name}
              image={product.image}
              id={product.id}
              price={product.price}
              quantity={product.quantity}
              Sizes={product.Sizes}
            />
          );
        })
      ) : (
        <p>Carrito Vacio</p>
      )}

      <div>
        <div className="TotalShoppingCart">
          <p>Total ${total}</p>
        </div>
        <div style={{ height: "30px", padding: "10px 0", clear: "both" }}>
          <Divider />
        </div>
        <div style={{ margin: "0 0 20px 0" }}>
          <Link
            to={!user ? "/login" : "/shipment"}
            className="ContinuarBtnShoppingCart"
            onClick={handleSubmit}
          >
            Continuar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShopingCart;
