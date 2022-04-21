import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
   const { onLoadIngredients } = props;
   const [enteredFilter, setEnteredFilter] = useState('');
   const inputRef = useRef();
   const {loading, data, error, sendRequest, clear} = useHttp();

   useEffect(() => {
      const timer = setTimeout(() => {
         if (enteredFilter === inputRef.current.value) {
            const query = enteredFilter.length === 0 ?
               '' :
               `?orderBy="title"&equalTo="${enteredFilter}"`;
            sendRequest('https://react-hooks-update-2469f-default-rtdb.firebaseio.com/ingredients.json' + query, 'GET');
            // fetch('https://react-hooks-update-2469f-default-rtdb.firebaseio.com/ingredients.json' + query)
            //    .then(response => response.json())
            //    .then(responseData => {
            //       const loadedIngredients = [];
            //       for (const key in responseData) {
            //          loadedIngredients.push({
            //             id: key,
            //             title: responseData[key].title,
            //             amount: responseData[key].amount
            //          });
            //       }
            //       onLoadIngredients(loadedIngredients);
            //    });
         }
      }, 500);
      return () => {
         clearTimeout(timer);
      };
   }, [enteredFilter, inputRef, sendRequest]);

   useEffect(() => {
      if (!loading && !error && data) {
         const loadedIngredients = [];
         for (const key in data) {
            loadedIngredients.push({
               id: key,
               title: data[key].title,
               amount: data[key].amount
            });
         }
         onLoadIngredients(loadedIngredients);
      }
   }, [data, loading, error, onLoadIngredients]);

   return (
      <section className="search">
         {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
         <Card>
            <div className="search-input">
               <label>Filter by Title</label>
               {loading && <span>Loading...</span>}
               <input
                  ref={inputRef}
                  type="text"
                  value={enteredFilter}
                  onChange={event => setEnteredFilter(event.target.value)}
               />
            </div>
         </Card>
      </section>
   );
});

export default Search;
