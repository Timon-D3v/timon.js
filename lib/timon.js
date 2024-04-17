/*!
 * timon.js
 * Copyright(c) 2024 Timon Fiedler
 * MIT Licensed
 */

"use strict";

// Functions

/**
 * Converts a file to a Base64-encoded string.
 * @param {File} file - The file to be converted to Base64.
 * @returns {Promise<string>} - A promise that resolves with the Base64-encoded string of the file.
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a file to a Base64-encoded string with a given maximum bytes count.
 * @param {File} file - The file to be converted to Base64.
 * @param {Number} bytes - The maximum bytes allowed.
 * @param {Number} [scale=0.8] - The quality scale of the returned image.
 * @returns {Promise<string>} - A promise that resolves with the Base64-encoded string of the file.
 */
function toBase64Max(file, bytes, scale) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let width = img.width;
        let height = img.height;
        if (file.size > bytes) {
          const scaleFactor = Math.min(1, bytes / file.size);
          width *= scaleFactor;
          height *= scaleFactor;
        };
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const resizedImage = canvas.toDataURL('image/jpeg', scale || 0.8);
        resolve(resizedImage);
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a date to a readable date string.
 * @param {Date} date - The date to be converted to the readable date string.
 * @returns {string} - The readable date string.
 */
function toDateSting (date) {
	date = date.toString();
	let month = date.slice(4, 7).replace("Jan", "Januar");
  month = month.replace("Feb", "Februar").replace("Mar", "März");
  month = month.replace("Apr", "April").replace("May", "Mai");
  month = month.replace("Jun", "Juni").replace("Jul", "Juli");
	month = month.replace("Aug", "August").replace("Sep", "September");
  month = month.replace("Oct", "Oktober").replace("Nov", "November");
	return `${date.slice(8, 10)}. ${month.replace("Dec", "Dezember")} ${
    date.slice(11, 15)} um ${date.slice(15, 24)}`;
}

function getElm (id) {
  return document.getElementsById(id);
}

function getQry (query) {
  return document.querySelectorAll(query);
}

function post (url, body) {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(window.location.origin + url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        mode: "cors",
        cache: "default",
        redirect: "follow",
        credentials: "same-origin",
        referrerPolicy: "no-referrer-when-downgrade",
        body
      });
      response = await response.json();
    } catch (error) {
      console.error(error);
      reject;
    }
    resolve(response);
  });
}

// Variables