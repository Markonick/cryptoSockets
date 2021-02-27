import React from 'react'
import client from './Config'

import { handleResponse, handleError } from './Response';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getAll = (resource) => { 
  return client 
    .get(`${BASE_URL}/${resource}`) 
    .then(handleResponse) 
    .catch(handleError)
}; 

const getSingle = (resource, id) => { 
  return client 
    .get(`${BASE_URL}/${resource}/${id}`) 
    .then(handleResponse) 
    .catch(handleError)
}

const apiProvider = { 
  getAll, 
  getSingle, 
}

export default apiProvider