import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import { AppConfig } from "../../config";
import { selectForm } from './selectors';

function requestForm(name, id) {
  return {
    type: types.FORM_REQUEST,
    name,
    id
  };
}

function receiveForm(name, form) {
  return {
    type: types.FORM_SUCCESS,
    form,
    name
  };
}

function failForm(name, err) {
  return {
    type: types.FORM_FAILURE,
    error: err,
    name
  };
}

function resetForm(name) {
  return {
    type: types.FORM_RESET,
    name
  };
}

function sendForm(name, form) {
  return {
    type: types.FORM_SAVE,
    form,
    name
  }
}

export const getForm = (name, id = '') => {
  return (dispatch, getState) => {
    // Check to see if the form is already loaded.
    const form = selectForm(name, getState());
    if (form.components && Array.isArray(form.components) && form.components.length && form._id === id) {
      return;
    }

    dispatch(requestForm(name, id));

    const formPath = id ? `${AppConfig.projectUrl}/form/${id}` : `${AppConfig.projectUrl}/${name}`;

    const formio = new Formiojs(AppConfig.projectUrl + '/' + formPath);

    return formio.loadForm()
      .then((result) => {
        dispatch(receiveForm(name, result));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

export const saveForm = (name, form) => {
  return (dispatch) => {
    dispatch(sendForm(name, form));

    const id = form._id;

    const formio = new Formiojs(AppConfig.projectUrl + '/form' + (id ? '/' + id : ''));

    formio.saveForm(form)
      .then((result) => {
        dispatch(receiveForm(name, result));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

export const deleteForm = (name, id) => {
  return (dispatch, getState) => {

    const formio = new Formiojs(AppConfig.projectUrl + '/form/' + id);

    return formio.deleteForm()
      .then(() => {
        dispatch(resetForm(name));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

