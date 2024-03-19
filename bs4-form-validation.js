/* https://github.com/colmeye */
import $ from "./jquery-3.7.1.min"; // FIXME : Remove when minified. Used to make IDE happy.

/**
 * Represents a form validator that manipulates form elements based on validation rules.
 */
class Validation {

    /**
     * Creates an instance of the Validation class.
     * @param {string} form_id - The ID of the form to be validated.
     */
    constructor(form_id) {

        this.form = $("#" + form_id);

        this.submitButton = $(this.form).find('input[type="submit"]');

        this.submitButtonText = this.submitButton.val();

        this.inputLog = [];

        this.validC = "is-valid";

        this.invalidC = "is-invalid";

        this.checkAll();

    }

    /**
     * Requires a text input to meet specific length and character limits.
     * @param {string} target_element_id - The ID of the target input element.
     * @param {number} exclusive_min_length - The minimum length of the input value, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the input value, exclusive.
     * @param {Array<string>} array_of_illegal_characters - An array of characters or strings considered illegal.
     * @param {Array<string>} array_of_required_characters - An array of required characters or strings.
     * @returns {string} - A message indicating the validation result.
     */
    requireText(target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters) {
        let target_element = $("#" + target_element_id),
            response_text = "";
        return this.createAsterisk(target_element),
            this.inputLog.push(["requireText", target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters]),
            $(target_element).on("input focus", target_element, () => {
                response_text = "",
                response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length),
                    response_text += this.illegalCharCheck(target_element, array_of_illegal_characters),
                    this.showWarning(target_element, target_element_id, response_text)
            }),
            $(target_element).on("input", target_element, () => {
                this.submitDisabled(!1, this.submitButtonText)
            }),
            $(target_element).on("focusout", target_element, () => {
                response_text += this.necessaryCharCheck(target_element, array_of_required_characters), this.showWarning(target_element, target_element_id, response_text), this.removeValid(target_element)
            }),
            response_text
    }

    /**
     * Requires an email input to meet specific length and character limits.
     * @param {string} target_element_id - The ID of the target email input element.
     * @param {number} exclusive_min_length - The minimum length of the email input value, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the email input value, exclusive.
     * @param {Array<string>} array_of_illegal_characters - An array of characters or strings considered illegal.
     * @param {Array<string>} array_of_required_characters - An array of required characters or strings.
     * @returns {string} - A message indicating the validation result.
     */
    requireEmail(target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters) {
        let target_element = $("#" + target_element_id),
            response_text = "";
        return this.createAsterisk(target_element), this.inputLog.push(["requireEmail", target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters]), $(target_element).on("input focus", target_element, () => {
            response_text = "", response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length), response_text += this.illegalCharCheck(target_element, array_of_illegal_characters), this.showWarning(target_element, target_element_id, response_text)
        }), $(target_element).on("input", target_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        }), $(target_element).on("focusout", target_element, () => {
            response_text += this.necessaryCharCheck(target_element, array_of_required_characters), response_text += this.emailCheck(target_element), this.showWarning(target_element, target_element_id, response_text), this.removeValid(target_element)
        }), response_text
    }

    /**
     * Requires a password input to meet specific length and character limits while also checking if the confirmation field matches.
     * @param {string} password_element_id - The ID of the password input element.
     * @param {number} exclusive_min_length - The minimum length of the password, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the password, exclusive.
     * @param {Array<string>} array_of_illegal_characters - An array of characters considered illegal in the password.
     * @param {Array<string>} array_of_required_characters - An array of required characters in the password.
     * @param {string} confirm_password_element_id - The ID of the confirmation password input element.
     * @returns {string} - A message indicating the validation result for the password.
     */
    registerPassword(password_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters, confirm_password_element_id) {
        let password_element = $("#" + password_element_id),
            confirm_password_element = $("#" + confirm_password_element_id),
            l = "",
            c = "";
        return this.createAsterisk(password_element), this.createAsterisk(confirm_password_element), this.inputLog.push(["registerPassword", password_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters, confirm_password_element_id]), $(password_element).on("input focus", password_element, () => {
            l = "", l += this.lengthCheck(password_element, exclusive_min_length, exclusive_max_length), l += this.illegalCharCheck(password_element, array_of_illegal_characters), this.showWarning(password_element, password_element_id, l), c = "", c += this.passwordMatchCheck(password_element, confirm_password_element), this.showWarning(confirm_password_element, confirm_password_element_id, c)
        }), $(password_element).on("input", password_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        }), $(password_element).on("focusout", password_element, () => {
            l += this.necessaryCharCheck(password_element, array_of_required_characters), l += this.capitalCheck(password_element), l += this.numberCheck(password_element), l += this.specialCharCheck(password_element), this.showWarning(password_element, password_element_id, l), this.removeValid(password_element), this.removeValid(confirm_password_element)
        }), $(confirm_password_element).on("input focus", confirm_password_element, () => {
            c = "", c += this.passwordMatchCheck(password_element, confirm_password_element), this.showWarning(confirm_password_element, confirm_password_element_id, c)
        }), $(confirm_password_element).on("input", password_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        }), $(confirm_password_element).on("focusout", confirm_password_element, () => {
            this.removeValid(confirm_password_element)
        }), l
    }

    /**
     * Checks the length of the input value against set minimum (exclusive) and maximum (exclusive) lengths.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {number} exclusive_min_length - The minimum length of the input value, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the input value, exclusive.
     * @returns {string} - A message indicating if the input value does not meet the length requirements.
     */
    lengthCheck(target_element, exclusive_min_length, exclusive_max_length) {
        return target_element.val().length <= exclusive_min_length ? "Must be longer than " + exclusive_min_length + " characters. " : target_element.val().length >= exclusive_max_length ? "Must be shorter than " + exclusive_max_length + " characters. " : ""
    }

    /**
     * Checks for illegal characters in the input value based on a provided array of such characters.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {Array<string>} array_of_illegal_characters - An array of characters or strings considered illegal.
     * @returns {string} - A message listing illegal characters found in the input value, if any.
     */
    illegalCharCheck(target_element, array_of_illegal_characters) {
        let i = "";
        return $(array_of_illegal_characters).each(function() {
            console.log({target_element, val: target_element.val(), ths: this, index: target_element.val().indexOf(this)});
            target_element.val().indexOf(this) >= 0 && (0 == !this.trim().length ? i += " " + this : i += " spaces")
        }), "" === i ? "" : "Cannot use:" + i + ". "
    }

    /**
     * Ensures the input value contains all necessary characters based on a provided array of such characters.0
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {Array<string>} array_of_required_characters - An array of required characters or strings.
     * @returns {string} - A message indicating which required characters are missing from the input value, if any.
     */
    necessaryCharCheck(target_element, array_of_required_characters) {
        let i = "";
        return $(array_of_required_characters).each(function() {
            target_element.val().indexOf(this) >= 0 || (i += " " + this)
        }), "" === i ? "" : "Must contain:" + i + ". "
    }

    /**
     * Validates that the input value contains at least one number.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating the absence of numbers in the input value, if applicable.
     */
    numberCheck(target_element) {
        return target_element.val().match(/\d/) ? "" : "Must contain a number. "
    }

    /**
     * Validates that the input value contains at least one special character.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating the absence of special characters in the input value, if applicable.
     */
    specialCharCheck(target_element) {
        return target_element.val().match(/\W|_/g) ? "" : "Must contain a special character. "
    }

    /**
     * Validates that the input value contains at least one uppercase letter.
     * @param target_element
     * @returns {string}
     */
    capitalCheck(target_element) {
        return target_element.val().match(/[A-Z]+/) ? "" : "Must contain capital letter. "
    }

    /**
     * Checks if the password and its confirmation match.
     * @param password_element
     * @param confirm_password_element
     * @returns {string}
     */
    passwordMatchCheck(password_element, confirm_password_element) {
        return password_element.val() === confirm_password_element.val() ? "" : "Passwords do not match. "
    }

    /**
     * Validates that the input value is a properly formatted email address.
     * @param target_element
     * @returns {string}
     */
    emailCheck(target_element) {
        return target_element.val().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "" : "Is not a proper email"
    }

    /**
     * Enables or disables the submit button and optionally changes its text.
     * @param disabled
     * @param text
     */
    submitDisabled(disabled, text) {
        $(this.submitButton).prop("disabled", disabled), $(this.submitButton).val(text)
    }

    /**
     * Checks all registered inputs for validation and prevents form submission if any validation fails.
     */
    checkAll() {
        $(this.form).submit(t => {
            $(this.inputLog).each(s => {
                let i = "",
                    e = "",
                    a = this.inputLog[s],
                    h = a[1],
                    r = $("#" + h),
                    n = a[2],
                    l = a[3],
                    c = a[4],
                    o = a[5];
                if ("registerPassword" === a[0]) var u = a[6],
                    C = $("#" + u);
                i = "", i += this.lengthCheck(r, n, l), i += this.illegalCharCheck(r, c), i += this.necessaryCharCheck(r, o), "requireEmail" === a[0] && (i += this.emailCheck(r)), "registerPassword" === a[0] && (i += this.capitalCheck(r), i += this.numberCheck(r), i += this.specialCharCheck(r), e += this.passwordMatchCheck(r, C)), i && (this.showWarning(r, h, i), this.submitDisabled(!0, "Error, please check your form"), t.preventDefault()), e && (this.showWarning(C, u, e), this.submitDisabled(!0, "Error, please check your form"), t.preventDefault())
            })
        })
    }

    /**
     * Displays a warning message for a target element and updates its validation state.
     * @param target_element
     * @param element_id
     * @param warning_message
     */
    showWarning(target_element, element_id, warning_message) {
        warning_message ? (this.generateFeedback(target_element, element_id, "invalid-feedback", warning_message), this.makeInvalid(target_element)) : (this.generateFeedback(target_element, element_id, "", ""), this.makeValid(target_element))
    }

    /**
     * Marks an input element as valid by adding the appropriate class.
     * @param target_element
     */
    makeValid(target_element) {
        target_element.hasClass(this.validC) || target_element.addClass(this.validC), target_element.hasClass(this.invalidC) && target_element.removeClass(this.invalidC)
    }

    /**
     * Removes the validation state from an input element.
     * @param target_element
     */
    removeValid(target_element) {
        target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }

    /**
     * Marks an input element as invalid by adding the appropriate class.
     * @param target_element
     */
    makeInvalid(target_element) {
        target_element.hasClass(this.invalidC) || target_element.addClass(this.invalidC), target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }

    /**
     * Adds an asterisk (*) symbol before a target element to indicate it is required.
     * @param target_element
     */
    createAsterisk(target_element) {
        $("<span class='text-danger'>*</span>").insertBefore(target_element)
    }

    /**
     * Generates and displays a feedback message for an input element.
     * @param target_element
     * @param element_id
     * @param class_value
     * @param inner_text
     */
    generateFeedback(target_element, element_id, class_value, inner_text) {
        $("#" + element_id + "-feedback").remove(), $('<div id="' + element_id + '-feedback" class="' + class_value + '">' + inner_text + "</div>").insertAfter(target_element)
    }
}

/*
Common Values:
- t : element_id || target_element
- s : exclusive_min_length || element_id
- i : exclusive_max_length || class_value
- e : array_of_SOMETHING || inner_text/error_message
- a : another_array_of_SOMETHING
- h : target_element
 */
