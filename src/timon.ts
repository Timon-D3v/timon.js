/*!
 * timon.js
 * Copyright(c) 2024 Timon Fiedler
 * MIT Licensed
 */
/*
  _______                            __         
 /_  __(_)___ ___  ____  ____   ____/ /__ _   __
  / / / / __ `__ \/ __ \/ __ \ / __  / _ \ | / /
 / / / / / / / / / /_/ / / / // /_/ /  __/ |/ / 
/_/ /_/_/ /_/ /_/\____/_/ /_(_)__,_/\___/|___/  

Visit https://www.timondev.com
*/










// NOTE:

// This is not done yet.
// But typescript is supported in version 2.1.0





















"use strict";

// Essentials

let TIMONJS_DEBUG = false;

function timonjs_setDebugMode(value: boolean): void {
    TIMONJS_DEBUG = value;
}

function timonjs_message(): void {
    const message = (color: string, size: number, padding: string) => `color: ${color}; font-size: ${size}em; background-color: #000; font-family: Consolas, monospace; padding: 0.75em ${padding}; display: block;`;
    console.log("%cCustom Coded by @timon.dev", message("#0f0", 2, "25%"));
    console.log("%cVisit https://www.timondev.com", message("#fff", 1, "35%"));
}

// Types and Interfaces

interface TimonJSElement extends HTMLElement {
    click(): TimonJSElement;
}

// Functions

/**
 * Converts a file to a Base64-encoded string.
 * @param {File} file - The file to be converted to Base64.
 * @returns {Promise<string>} - A promise that resolves with the Base64-encoded string of the file.
 */
function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a file to a Base64-encoded string and resizes the image if its size exceeds the maximum bytes count.
 * @param {File} file - The file to be converted to Base64.
 * @param {number} bytes - The maximum bytes allowed.
 * @param {number} [scale=0.8] - The quality scale of the returned image.
 * @returns {Promise<string>} - Promise that resolves with the Base64-encoded string of the file.
 */
function toBase64Max(file: File, bytes: number, scale: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const scaleFactor = Math.min(1, bytes / file.size);
                const width = img.width * scaleFactor;
                const height = img.height * scaleFactor;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                const resizedImage = canvas.toDataURL("image/jpeg", scale);
                resolve(resizedImage);
            };
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a JavaScript `Date` object to a readable date string in a specific format.
 * @param {Date} date - The date object to be converted to a readable date string.
 * @returns {string} - A string representing the date in the format "DD. Month YYYY um HH:MM:SS".
 */
function toDateString(date: Date): string {
    const monthNames = [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString();
  
    return `${day}. ${month} ${year} um ${time}`;
}

/**
 * Sends a POST request to the specified URL with the given body and returns the response in the specified format.
 *
 * @param {string} url - The URL to send the POST request to.
 * @param {object} body - The body of the POST request.
 * @param {string} [origin=window.location.origin.toString()] - The origin to use for the request. Defaults to the current window location origin.
 * @param {"json" | "text" | "blob" | "arrayBuffer"} [responseType] - The type of response expected. Can be "json", "text", "blob", or "arrayBuffer". Defaults to "json".
 * @returns {Promise<string | object | Blob | ArrayBuffer>} - A promise that resolves to the response in the specified format.
 * @throws {Error} - Throws an error if the request fails.
 */
async function post(url: string, body: object, origin: string = window.location.origin.toString(), responseType?: "json" | "text" | "blob" | "arrayBuffer"): Promise<string | object | Blob | ArrayBuffer> {
    try {
        const response = await fetch(origin + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            cache: "default",
            redirect: "follow",
            credentials: "same-origin",
            referrerPolicy: "no-referrer-when-downgrade",
            body: JSON.stringify(body),
        });

        switch (responseType) {
            case "json":
                return await response.json();
            case "text":
                return await response.text();
            case "blob":
                return await response.blob();
            case "arrayBuffer":
                return await response.arrayBuffer();
            default:
                return await response.json();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Sends a GET request to the specified URL and returns the response in the specified format.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {string} [origin=window.location.origin.toString()] - The origin to use for the request. Defaults to the current window location origin.
 * @param {"json" | "text" | "blob" | "arrayBuffer"} [responseType] - The type of response expected. Can be "json", "text", "blob", or "arrayBuffer". Defaults to "json".
 * @returns {Promise<string | object | Blob | ArrayBuffer>} - A promise that resolves to the response in the specified format.
 * @throws {Error} - Throws an error if the request fails.
 */
async function get(url: string, origin: string = window.location.origin.toString(), responseType?: "json" | "text" | "blob" | "arrayBuffer"): Promise<string | object | Blob | ArrayBuffer> {
    try {
        const response = await fetch(origin + url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            cache: "default",
            redirect: "follow",
            credentials: "same-origin",
            referrerPolicy: "no-referrer-when-downgrade"
        });

        switch (responseType) {
            case "json":
                return await response.json();
            case "text":
                return await response.text();
            case "blob":
                return await response.blob();
            case "arrayBuffer":
                return await response.arrayBuffer();
            default:
                return await response.json();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Generates a random string of a specified length using a combination of uppercase letters, lowercase letters, and numbers.
 * @param {number} length - The desired length of the random string.
 * @returns {string} - A random string of the specified length.
 */
function randomString(length: number, characters?: string): string {
    let result = "";
    const char = characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * char.length);
        result += char[randomIndex];
    }
    
    return result;
}

/**
 * Scrolls the page to the element matching the given query.
 * @param {string} query - The query used to select the element(s) to scroll to.
 * @returns {Element | null} - The element that was scrolled to, or `null` if no element was found.
 */
function scrollToQuery(query: string): Element | null {
    const element = document.querySelector(query);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        return element;
    }
    return null;
}

/**
 * Sets CSS styles on a specified DOM element.
 * @param {HTMLElement} element - The DOM element to apply the CSS styles to.
 * @param {Object} styles - An object containing the CSS styles to be set.
 * @returns {HTMLElement} - The DOM element with the applied CSS styles.
 */
function setCss(element: HTMLElement, styles: object): HTMLElement {
    const cssString = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
    element.style.cssText = cssString;
    return element;
}

/**
 * Determines the type of device (desktop, tablet, or mobile) based on the user agent string.
 * @returns {"desktop" | "tablet" | "mobile"} - The type of device.
 */
function getDevice(): "desktop" | "tablet" | "mobile" {
    const agent = navigator.userAgent;
    
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(agent)) {
        return "tablet";
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(agent)) {
        return "mobile";
    } else {
        return "desktop";
    }
}

/**
 * Downloads a file from a specified URL.
 * If a custom filename is not provided, the URL is used as the default filename.
 * @param {string} url - The URL of the file to be downloaded.
 * @param {string} [filename=url] - The custom filename to be used for the downloaded file.
 * @throws {Error} If there is an error downloading the file.
 */
async function download(url: string, filename: string = url): Promise<void> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Error downloading file:", error);
        throw new Error("Error downloading file");
    }
}

/**
 * Logs a message(s) to the console.
 * 
 * @param {...any} message - The message(s) to be logged.
 */
function log(...message: any[]): void {
    console.log(...message);
}

/**
 * Logs a info message(s) to the console.
 * 
 * @param {...any} message - The info message(s) to be logged.
 */
function infoLog(...message: any[]): void {
    console.info(...message);
}

/**
 * Logs a warning message(s) to the console.
 * 
 * @param {...any} message - The warning message(s) to be logged.
 */
function warnLog(...message: any[]): void {
    console.warn(...message);
}

/**
 * Logs an error message(s) to the console.
 * @param {...any} message - The error message(s) to be logged.
 */
function errorLog(...message: any[]): void {
    console.error(...message);
}

/**
 * Attaches an event listener to a specified HTML element.
 *
 * @param {HTMLElement} element - The HTML element to which the event listener will be attached.
 * @param {string} event - The name of the event to listen for (e.g., 'click', 'mouseover').
 * @param {EventListenerOrEventListenerObject} callback - The function or object that receives a notification when an event of the specified type occurs.
 * @param {...any[]} args - Additional arguments to pass to the `addEventListener` method.
 * @returns {HTMLElement} The HTML element to which the event listener was attached.
 */
function on(element: HTMLElement, event: string, callback: EventListenerOrEventListenerObject, ...args: any[]): HTMLElement {
    element.addEventListener(event, callback, ...args);
    return element;
}

/**
 * Attaches an event listener to a specified HTML element.
 *
 * @param {HTMLElement} element - The HTML element to which the event listener will be attached.
 * @param {EventListenerOrEventListenerObject} callback - The function or object that receives a notification when an event of the specified type occurs.
 * @param {...any[]} args - Additional arguments to pass to the `addEventListener` method.
 * @returns {HTMLElement} The HTML element to which the event listener was attached.
 */
function onClick(element: HTMLElement, callback: EventListenerOrEventListenerObject, ...args: any[]): HTMLElement {
    element.addEventListener("click", callback, ...args);
    return element;
}

/**
 * Creates one or more HTML elements of the specified type, assigns them unique IDs,
 * and returns them. The elements are temporarily added to the document head to
 * generate the IDs and then removed.
 *
 * @param {string} type - The type of HTML element to create (e.g., 'div', 'span').
 * @param {number} [amount=1] - The number of elements to create. Defaults to 1.
 * @returns {HTMLElement|HTMLElement[]} - The created element(s). If only one element
 * is created, it returns the element itself. If multiple elements are created, it
 * returns an array of elements.
 */
function createElm(type: string, amount = 1): HTMLElement | HTMLElement[] {
    const elements = [];
    for (let i = 0; i < amount; i++) {
        elements.push(getElm(document.createElement(type)));
    };
    return elements.length === 1 ? elements[0] : elements;
}

/**
 * Converts an HTML element and its children into a JSON object representation.
 *
 * @param {HTMLElement} element - The HTML element to convert.
 * @returns {Object} A JSON object representing the HTML element, including its tag name, attributes, and children.
 *
 * The returned object has the following structure:
 * {
 *   tagName: string,
 *   attributes: { [key: string]: string },
 *   children: Array<{ tagName: string, attributes?: { [key: string]: string }, children?: any[], content?: string }>
 * }
 *
 * - `tagName`: The tag name of the HTML element.
 * - `attributes`: An object containing the element's attributes as key-value pairs.
 * - `children`: An array of child elements, each represented as a similar JSON object. Text nodes are represented with a special tag name "___text___" and a `content` property.
 */
function elementToJson(element: HTMLElement): Object {
    const options: { tagName: string, attributes: { [key: string]: string }, children: any[] } = {
        tagName: element.tagName,
        attributes: {},
        children: []
    }

    for (let attr of element.attributes) {
        options.attributes[attr.name] = attr.value
    }

    for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const content = child.textContent?.trim();

            if (content === "") continue;

            options.children.push({
                tagName: "___text___",
                content
            });

            continue;
        }

        if (child instanceof HTMLElement) {
            options.children.push(elementToJson(child));
        }
    }

    return options
}

/**
 * Converts a JSON representation of an HTML element into an actual HTMLElement.
 *
 * @param options - An object containing the tagName, attributes, and children of the element.
 * @param options.tagName - The tag name of the HTML element to be created.
 * @param options.attributes - An object representing the attributes to be set on the element.
 * @param options.children - An array of child elements or text nodes to be appended to the created element.
 * 
 * @returns The created HTMLElement.
 */
function jsonToElement(options: { tagName: string, attributes: { [key: string]: string }, children: any[] } ): HTMLElement {
    const element = document.createElement(options.tagName)

    for (let attr in options.attributes) {
        element.setAttribute(attr, options.attributes[attr])
    }

    for (let child of options.children) {
        if (child.tagName === "___text___") {
            element.appendChild(document.createTextNode(child.content));
            continue;
        }

        element.appendChild(jsonToElement(child));
    }

    return element
}
  
/**
 * Converts a markdown-formatted string to HTML.
 *
 * The function supports the following markdown syntax:
 * - Bold text: `***text***` will be converted to `<b>text</b>`
 * - Italic text: `___text___` will be converted to `<i>text</i>`
 * - Underlined text: `+++text+++` will be converted to `<u>text</u>`
 * - Hyperlinks: `{[link text](url)}` will be converted to `<a href='url' target='_blank'>link text</a>`
 *
 * @param text - The markdown-formatted string to be converted.
 * @returns The HTML-formatted string.
 */
function markdownToHtml(text: string): string {
    return text
        .replace(/\*\*\*([^\*]{1,})\*\*\*/gm, "<b>$1</b>")
        .replace(/\_\_\_([^\_]{1,})\_\_\_/gm, "<i>$1</i>")
        .replace(/\+\+\+([^\+]{1,})\+\+\+/gm, "<u>$1</u>")
        .replace(/\{\[([^\]]+)\]\(([^)]+)\)\}/gm, "<a href='$2' target='_blank'>$1</a>");
}

/**
 * Converts HTML formatted text to Markdown formatted text.
 *
 * @param text - The HTML string to be converted.
 * @returns The converted Markdown string.
 *
 * The function performs the following conversions:
 * - `<b>...</b>` to `***...***`
 * - `<i>...</i>` to `___...___`
 * - `<u>...</u>` to `+++...+++`
 * - `<a href='...' target='_blank'>...</a>` to `{[...]('...')}`
 */
function HTMLToMarkdown(text: string): string {
    return text
        .replace(/<b>((?:(?!<\/b>).)+)<\/b>/gm, "***$1***")
        .replace(/<i>((?:(?!<\/b>).)+)<\/i>/gm, "___$1___")
        .replace(/<u>((?:(?!<\/b>).)+)<\/u>/gm, "+++$1+++")
        .replace(/<a href='([^']*)' target='_blank'>(.*?)<\/a>/gm, "{[$2]($1)}");
}

/**
 * Registers an event listener for the `DOMContentLoaded` event, which is fired when the initial HTML document has been completely loaded and parsed.
 *
 * @param callback - The function to be executed when the `DOMContentLoaded` event is fired.
 * @param options - Additional options that specify characteristics about the event listener.
 */
function ready(callback: EventListenerOrEventListenerObject, ...options: any[]): void {
    window.addEventListener("DOMContentLoaded", callback, ...options);
}

function getElm(param: string | HTMLElement): TimonJSElement {
    let element = param;

    if (typeof param === "string") {
        element = document.getElementById(param) as HTMLElement;
    }

    

}

// Variables

const ORIGIN = typeof window !== "undefined" ? window.location.origin : undefined;
const BREAKPOINTS = {
    MOBILE: {
        SMALL: 260,
        BIG: 575
    },
    TABLET: {
        SMALL: 750,
        BIG: 1000
    },
    DESKTOP: {
        SMALL: 1200,
        BIG: 1700
    }
};