import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  cleanDetail,
  getProductsById,
  getProductStockById,
} from "../../redux/products/productsAction";
import Rating from "@mui/material/Rating";
import "./Product.css";
import { Link } from "react-router-dom";
import {
  addToCart,
  fusionCart,
  loadCart,
} from "../../redux/cart/cartAction";
import jwt_decode from "jwt-decode";
import { getToken, userPostWish } from "../../redux/users/userActions";
import swal from "sweetalert";

export default function Product({
  name,
  id,
  price,
  image,
  status,
  Sizes,
  onSale,
  discounts,
}) {
  
  var intFrameWidth = window.innerWidth;

  const { items } = useSelector((store) => store.cartReducers);
  const dispatch = useDispatch();
  let x;
  if (localStorage.getItem("token")) {
    x = getToken();
  }
  const gId = localStorage.getItem('gId')
  const decoded = x ? jwt_decode(x) : null;
  const { ratings } = useSelector((state) => state.ratingReducer);
  const data = ratings.filter((e) => e.id === id);

  useEffect(() => {
    dispatch(getProductsById(id));
    dispatch(getProductStockById(id));
    return () => dispatch(cleanDetail(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    let product = items?.find((e) => e.id === id);
    let user = decoded ? decoded.user.id : null;
    if(status ==="disponible"){
    if (user) {
      await fusionCart(id);
      await dispatch(
        addToCart(
          id,
          product?.quantity ? product.quantity + 1 : 1,
          onSale === true ? (price - (parseInt(discounts) / 100) * price).toPrecision(4)
          : price,
          // price,
          name,
          image,
          Sizes
        )
      );
      await dispatch(loadCart());
    }
    await dispatch(
      addToCart(
        id,
        product?.quantity ? product.quantity + 1 : 1,
        onSale === true ? (price - (parseInt(discounts) / 100) * price).toPrecision(4)
          : price,
        // price,
        name,
        image,
        Sizes
      )
    );
  }else{
    swal("Oops...", "Este producto todavía no esta disponible", "error");
  }
  };

  const handleAddWishList = async (userId,productId)=> {
    if(userId){
    const x = await userPostWish(userId,productId)
    swal("Produto agregado a tu wishList!", "success")
  }else{swal("Por favor inicia sesión para poder agregar a la wishList!", "error")}
}

  return (
    <div className="ProductContainer">
      <div className="IconShoppingContainer">
        <Link to={`/catalogue`}>
          <div className="IconShopping hvr-pulse-grow">
            <ShoppingCartIcon 
              sx={{
                width: 30,
                fontSize: 20,
                marginTop: 0.7,
                color: " rgb(197, 197, 197)",
                "&:hover": {
                  color: "#9E0000",
                },
                "@media (min-width: 1200px) and (max-width: 1399px)": {
                  fontSize: 16,
                  marginTop: -0.5,
                  position: "relative",
                  left: -3
                },
                "@media (min-width: 0px) and (max-width: 1199px)": {
                  fontSize: 14,
                  marginTop: -1,
                  position: "relative",
                  left: -3
                },
              }}
              onClick={() => handleAddToCart(id)}
            />
          </div>
          <div className="IconShopping hvr-pulse-grow">
            <FavoriteIcon 
              sx={{ 
                fontSize: 20, 
                marginTop: 0.7, 
                color: " rgb(197, 197, 197)", 
                "&:hover": {
                  color: "#9E0000",
                },
                "@media (min-width: 1200px) and (max-width: 1399px)": {
                  fontSize: 16,
                  marginTop: -0.5,
                },
                "@media (min-width: 0px) and (max-width: 1199px)": {
                  fontSize: 14,
                  marginTop: -1,
                  position: "relative",
                  
                },
              }}
              onClick={()=>handleAddWishList(decoded ? decoded.user.id : gId,id)}  />
          </div>
        </Link>
      </div>
      <div className="Zapatilla">
        <img src={image} alt="imagen no encontrada" />
      </div>
      <div className="Name">
        <h3>{name}</h3>
      </div>
      <div className="PriceProduct">
        <h5>
          $
          {onSale === true
            ? (price - (parseInt(discounts) / 100) * price).toPrecision(4)
            : price}
        </h5>
        <h4 className={onSale === true ? "OldPrice" : "OldPriceNO"}>${price}</h4>
      </div>
      {onSale === true ? (
        <div className="Discount">
          <h5>{discounts}%</h5>
        </div>
      ) : null}

      {data[0] && data[0].rating ? (
        <div className="Rate">
          <Rating name="read-only" value={data[0].rating} readOnly size={intFrameWidth > 1600 ? "large" : intFrameWidth > 575 ? "medium" : "small"} />
        </div>
      ) : (
        <div className="NoRating">
          <i>Sin calificación, sé el primero</i>
        </div>
      )}
    </div>
  );
}
