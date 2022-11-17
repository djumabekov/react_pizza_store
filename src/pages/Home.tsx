import React, { useEffect, useState } from 'react';
import qs from 'qs';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import {list} from '../components/Sort';
import PizzaBlock from '../components/pizzaBlock';
import Skeleton from '../components/pizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { setCategiryId, setCurrentPage } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isSearch= React.useRef(false);
    const isMounted = React.useRef(false);
    const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter);
    const {items, status} = useSelector(selectPizzaData);

      const onChangeCategory = React.useCallback((id: number) =>{
        dispatch(setCategiryId(id));
      }, []);

      const onChangePage = (page: number) => {
        dispatch(setCurrentPage(page));
      }

      const getPizzas = async () => {

        const sortBy = sort.sortProperty.replace('-', '');
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';
  
        // fetch(`https://635b6dd46f97ae73a6438cab.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
        //   )
        //   .then((res) => {
        //     return res.json();
        //   })
        //   .then((json) => {
        //     setItems(json);
        //     setIsLoading(false);
        //   });
  
          //  axios.get(`https://635b6dd46f97ae73a6438cab.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
          // .then((res)=>{
          //   setItems(res.data);
          //   setIsLoading(false);
          // }).catch(err => {
          //   setIsLoading(false);
          // })

          
          dispatch(
            fetchPizzas({
            sortBy,
            order,
            category,
            search,
            currentPage: String(currentPage),
          }))

          window.scrollTo(0,0);
        }

        // useEffect(()=>{
        //   if(isMounted.current){
        //     const queryString = qs.stringify({
        //       sortProperty: sort.sortProperty,
        //       categoryId,
        //       currentPage,
        //     })
        //     navigate(`?${queryString}`);
        //   }
        //   if(!window.location.search){
        //     dispatch(fetchPizzas({} as SearchPizzaParams ));
        //   }
        //   isMounted.current = true;
        // }, [categoryId, sort.sortProperty, searchValue, currentPage])
        
    //   useEffect(()=>{
    //     if(window.location.search) {
    //       const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
    //       const sort = list.find(obj => obj.sortProperty === params.sortBy);
    //       dispatch(setFilters({
    //         searchValue : params.search,
    //         categoryId : Number(params.category), 
    //         currentPage: Number(params.currentPage),
    //         sort: sort || list[0],
    //       }));
    //     }          
    //     isSearch.current = true;
    //   }, [])

    useEffect(() => {
        getPizzas();
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);
    

    const pizzas = items.filter((obj:any)=>{
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())){
        return true;
      } else {
        return false;
      }
    }).map((item:any) => <PizzaBlock key={item.id}  {...item}/>);
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
    
    // const handlePageClick = (event) => {
    //   const newOffset = (event.selected * itemsPerPage) % items.length;
    //   console.log(
    //     `User requested page number ${event.selected}, which is offset ${newOffset}`
    //   );
    //   setItemOffset(newOffset);
    // };

    return (
      <div className="container">
        <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
        <Sort value={sort}/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {
        status === 'error' ? (
          <div className='content__error-info'>
            <h2>Произошла ошибка</h2>
            <p>К сожалению, не удалось получить пиццы. Попробуйте повоторить попытку позднее...</p>
          </div>
        ):(<div className="content__items">
        {status === 'loading'
          ? skeletons : pizzas}
      </div>)}
          <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
      </div>
    )
}

export default Home;