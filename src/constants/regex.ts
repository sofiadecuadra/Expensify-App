/*
 * name validation
 * accepted: letters & spaces, minimum 3 chars, maximum 15 chars
 */
export const name: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9 ]{4,20}$/;

/*
 * email validation
 */
export const email: RegExp = /^[^ ]+@[^ ]+\.[^ ]+$/;

/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * [0-9a-zA-Z]{6,}: at least 6 from the mentioned characters
 */
export const password: RegExp = /^[^ ]{4,64}$/;
