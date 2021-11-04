import axios from 'axios'

export const GET_INITIAL_RATINGS = "GET_INITIAL_RATINGS";

let aux = 0
let aux2 = 0

 const getInitialRatings = () => {
    return async (dispatch) => {
        try {
            let { data } = await axios.get(`http://localhost:3001/api/products`)

            data = data.map(e => {
                return {
                    //{id: 1, votes: 1, ratings: [5,2,3]}
                    productId: e.id,
                    votes: e.Reviews.length,
                    ratings:  e.Reviews.map(rev =>  rev.rating)
                    }
            })

            // console.log(data)

            return await dispatch({
                type: GET_INITIAL_RATINGS,
                payload: data
            })    
        } catch (error) {
            console.log(error)
        }
    }
}

export { getInitialRatings}
