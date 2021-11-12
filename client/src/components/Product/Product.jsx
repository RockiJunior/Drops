import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { cleanDetail, getProductsById, getProductStockById } from '../../redux/products/productsAction';
import Rating from '@mui/material/Rating';
import './Product.css';
import { Link } from 'react-router-dom';
import { addToCartTomi, fusionCartTomi, loadCartTomi } from "../../redux/cartTomi/cartActionTomi";
import jwt_decode from "jwt-decode";
import { getToken } from '../../redux/users/userActions';

export default function Product({ name, id, price, image, Sizes, onSale, discounts }) {
    const {items} = useSelector(store => store.cartReducersTomi);
const dispatch = useDispatch();
let x
if(localStorage.getItem('token')){
     x = getToken();}
const decoded = x?jwt_decode(x): null;
const { ratings } = useSelector((state) => state.ratingReducer);
    const data = ratings.filter(e => e.id === id)

    console.log("DAATA", data[0]);
   
    useEffect(() => {
        dispatch(getProductsById(id))
        dispatch(getProductStockById(id))
        return () => dispatch(cleanDetail(id))
    }, [dispatch, id]);

    const {productId} = useSelector((state) => state.productReducer);
    const {stockById} = useSelector((state) => state.productReducer);

    const handleAddToCart = async () => {
    
    let product = items?.find( e => e.id === id)
    let user = decoded?decoded.user.id: null
        if(user) {
               console.log("entrouser",user)
           await  (fusionCartTomi(id))
            await  dispatch(loadCartTomi())
            await dispatch(addToCartTomi(id, product?.quantity ? product.quantity + 1 : 1, price,
                 name, image, Sizes))
        }
   
          await dispatch(addToCartTomi(id, product?.quantity ? product.quantity + 1 : 1,
             price, name, image, Sizes));
      
      };

    return (
        <div className="ProductContainer"  >
            <div className="IconShoppingContainer">
                <Link to={`/catalogue`}>
                    <div className="IconShopping hvr-pulse-grow">
                        <ShoppingCartIcon 
                            sx={{
                                    width:30,
                                    fontSize:20, 
                                    marginTop:0.7, 
                                    color:' rgb(197, 197, 197)',
                                    '&:hover':{
                                        color:'#9E0000'
                                    }}}
                            onClick={() => handleAddToCart(id)}/>
                    </div>
                </Link>
                <div className="IconShopping hvr-pulse-grow">
                <FavoriteIcon sx={{fontSize:20, marginTop:0.7}}/>
            </div>
            </div>
            <div className="Zapatilla">
                <img src={image} alt="imagen no encontrada"/>
            </div>
            <div className="Name">
                <h3>{name}</h3>
            </div> 
            <div className="PriceProduct">
                <h5>${onSale === true ? (price - ((parseInt(discounts)/100) * price)).toPrecision(4) : price }</h5>
                <h5 className="OldPrice">${price}</h5>
            </div>

            { 
                onSale === true ? 
                    <div className="Discount">  
                         <h5>{discounts}</h5> 
                    </div>
                : 
                null  
            }

            {
               
              data[0] && data[0].rating? 
                <div className="Rate">
                    {console.log("rating",data[0])}
                    <Rating name="read-only" value={data[0].rating} readOnly />
                </div>
                : 
                <div className="NoRating"><i>Sin calificación, sé el primero</i></div>
            }
           
            {/* <div className="TallesProduct">
                {
                    productId.name ? 
                        <div>
                            {
                                productId.Sizes.map((size, index) => {
                                    return (   
                                        <div className="TalleCard" >#{size.number}</div>
                                    )}
                            )}
                        </div> 
                        : 
                        <div>No name</div>
                }

            </div> */}
        </div>
    )
}