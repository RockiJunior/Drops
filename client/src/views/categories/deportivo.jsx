import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../redux/products/productsAction";
import Product from "../../components/Product/Product";
import Paginado from '../../components/Catalogue/Paginado';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import VanillaTilt from 'vanilla-tilt';

const Deportivo = () => {

    const element = document.querySelectorAll(".Shoes");
    VanillaTilt.init(element);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
        
    }, [dispatch]);

    const { products } = useSelector((state) => state.productReducer);
    
    const data = products.filter(e => Object.values(e.Category).includes('Deportivo'))

    const [currPage, setCurrPage] = useState(1);
    const [cardsxPage, ] = useState(8);
    
    const lastProduct = currPage * cardsxPage
    const firstProduct =  lastProduct - cardsxPage;

    const currProducts = data.slice(firstProduct, lastProduct);
    
    const paginado = (pagNumber) => {
        setCurrPage(pagNumber)
    }

    return(
        <div className="BrandContainer">
            <NavBar />
            <div className="CategoryImageSport">
                <h3>Deportivo</h3>
            </div>
            <div className="BrandProducts">
                {
                    currProducts && currProducts.map((e,index) => 
                        <Link to={`/catalogue/${e.id}`} key={index}>
                            <div className="Shoes" data-tilt >
                                {
                                    <Product 
                                    id={e.id}
                                    image={e.image}
                                    name={e.name}
                                    price={e.price}
                                    status={e.status}
                                    description={e.description}
                                    Sizes = {e.Sizes}  
                                    onSale={e.onSale}
                                    discounts={e.Discounts}
                                    />
                                }
                            </div>
                        </Link>
                    )
                }
            </div>
            <div className="Paginado">
                    <Paginado 
                    cardsxPage={cardsxPage} 
                    products={data.length}
                    paginado={paginado} 
                    />
            </div>
            <Footer />
        </div>
    )
}

export default Deportivo