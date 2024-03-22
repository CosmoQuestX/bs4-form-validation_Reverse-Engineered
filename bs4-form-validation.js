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
        this.createAsterisk(target_element);
        this.inputLog.push(["requireText", target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters]);
        $(target_element).on("input focus", target_element, () => {
            response_text = "";
            response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length);
            response_text += this.illegalCharCheck(target_element, array_of_illegal_characters);
            this.showWarning(target_element, target_element_id, response_text);
        });
        $(target_element).on("input", target_element, () => {
            this.submitDisabled(!1, this.submitButtonText);
        });
        $(target_element).on("focusout", target_element, () => {
            response_text += this.necessaryCharCheck(target_element, array_of_required_characters);
            this.showWarning(target_element, target_element_id, response_text);
            this.removeValid(target_element);
        });
        return response_text;
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
        this.createAsterisk(target_element);
        this.inputLog.push(["requireEmail", target_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters]);
        $(target_element).on("input focus", target_element, () => {
            response_text = "", response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length), response_text += this.illegalCharCheck(target_element, array_of_illegal_characters), this.showWarning(target_element, target_element_id, response_text)
        });
        $(target_element).on("input", target_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        });
        $(target_element).on("focusout", target_element, () => {
            response_text += this.necessaryCharCheck(target_element, array_of_required_characters);
            response_text += this.emailCheck(target_element);
            this.showWarning(target_element, target_element_id, response_text);
            this.removeValid(target_element);
        });
        return response_text;
    }

    /**
     * Requires a password input to meet specific length and character limits while also checking if the confirmation field matches.
     * @param {string} password_element_id - The ID of the password input element.
     * @param {number} exclusive_min_length - The minimum length of the password, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the password, exclusive.
     * @param {Array<string>} array_of_illegal_characters - An array of characters considered illegal in the password.
     * @param {Array<string>} array_of_required_characters - An array of required characters in the password.
     * @param {string} confirm_password_element_id - The ID of the confirmation password input element.
     * @param {boolean} [required=true] - Are the fields required?
     * @returns {string} - A message indicating the validation result for the password.
     */
    registerPassword(password_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters, confirm_password_element_id, required = true) {
        let password_element = $("#" + password_element_id),
            confirm_password_element = $("#" + confirm_password_element_id);

        if (required) {
            this.createAsterisk(password_element);
            this.createAsterisk(confirm_password_element);
        }

        this.inputLog.push(["registerPassword", password_element_id, exclusive_min_length, exclusive_max_length, array_of_illegal_characters, array_of_required_characters, confirm_password_element_id, required]);

        const validate = () => {
            let l = "", c = "";
            if (required || password_element.val().length > 0 || confirm_password_element.val().length > 0) {
                l += this.lengthCheck(password_element, exclusive_min_length, exclusive_max_length);
                l += this.illegalCharCheck(password_element, array_of_illegal_characters);
                l += this.necessaryCharCheck(password_element, array_of_required_characters);
                l += this.capitalCheck(password_element);
                l += this.numberCheck(password_element);
                l += this.specialCharCheck(password_element);
                c += this.passwordMatchCheck(password_element, confirm_password_element);
            }

            this.showWarning(password_element, password_element_id, l);
            this.showWarning(confirm_password_element, confirm_password_element_id, c);

            // Determine if there are validation errors and disable/enable the submit button accordingly
            const hasErrors = l !== "" || c !== "";
            this.submitDisabled(hasErrors, this.submitButtonText);
        };

        password_element.on("input focus focusout", validate);
        confirm_password_element.on("input focus focusout", validate);

        return ""; // Since the validation messages are handled through showWarning, returning a value might not be necessary.
    }



    /**
     * Checks the length of the input value against set minimum (exclusive) and maximum (exclusive) lengths.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {number} exclusive_min_length - The minimum length of the input value, exclusive.
     * @param {number} exclusive_max_length - The maximum length of the input value, exclusive.
     * @returns {string} - A message indicating if the input value does not meet the length requirements.
     */
    lengthCheck(target_element, exclusive_min_length, exclusive_max_length) {
        return target_element.val().length <= exclusive_min_length ? "Must be longer than " + exclusive_min_length + " characters. " : target_element.val().length >= exclusive_max_length ? "Must be shorter than " + exclusive_max_length + " characters. " : "";
    }

    /**
     * Checks for illegal characters in the input value based on a provided array of such characters.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {Array<string>} array_of_illegal_characters - An array of characters or strings considered illegal.
     * @returns {string} - A message listing illegal characters found in the input value, if any.
     */
    illegalCharCheck(target_element, array_of_illegal_characters) {
        let i = "";
        $(array_of_illegal_characters).each(function() {
            console.debug({target_element, val: target_element.val(), ths: this, index: target_element.val().indexOf(this)}); // FIXME : Debug
            target_element.val().indexOf(this) >= 0 && (0 == !this.trim().length ? i += " " + this : i += " spaces")
        });
        return "" === i ? "" : "Cannot use:" + i + ". ";
    }

    /**
     * Ensures the input value contains all necessary characters based on a provided array of such characters.0
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {Array<string>} array_of_required_characters - An array of required characters or strings.
     * @returns {string} - A message indicating which required characters are missing from the input value, if any.
     */
    necessaryCharCheck(target_element, array_of_required_characters) {
        let i = "";
        $(array_of_required_characters).each(function() {
            target_element.val().indexOf(this) >= 0 || (i += " " + this);
        });
        return "" === i ? "" : "Must contain:" + i + ". ";
    }

    /**
     * Validates that the input value contains at least one number.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating the absence of numbers in the input value, if applicable.
     */
    numberCheck(target_element) {
        return target_element.val().match(/\d/) ? "" : "Must contain a number. ";
    }

    /**
     * Validates that the input value contains at least one special character.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating the absence of special characters in the input value, if applicable.
     */
    specialCharCheck(target_element) {
        return target_element.val().match(/\W|_/g) ? "" : "Must contain a special character. ";
    }

    /**
     * Validates that the input value contains at least one uppercase letter.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating the absence of uppercase letters in the input value, if applicable.
     */
    capitalCheck(target_element) {
        return target_element.val().match(/[A-Z]+/) ? "" : "Must contain capital letter. ";
    }

    /**
     * Checks if the password and its confirmation match.
     * @param {jQuery} password_element - The jQuery object of the password input element.
     * @param {jQuery} confirm_password_element - The jQuery object of the confirmation password input element.
     * @returns {string} - A message indicating whether the passwords do not match.
     */
    passwordMatchCheck(password_element, confirm_password_element) {
        return password_element.val() === confirm_password_element.val() ? "" : "Passwords do not match. ";
    }

    /**
     * Validates that the input value is a properly formatted email address.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @returns {string} - A message indicating whether the input value is not a valid email address.
     */
    emailCheck(target_element) {
        return target_element.val().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "" : "Is not a proper email.";
    }

    /**
     * Enables or disables the submit button and optionally changes its text.
     * @param {boolean} disabled - True to disable the submit button, false to enable it.
     * @param {string} text - The text to display on the submit button.
     * @returns {void}
     */
    submitDisabled(disabled, text) {
        $(this.submitButton).prop("disabled", disabled), $(this.submitButton).val(text);
    }

    /**
     * Checks all registered inputs for validation and prevents form submission if any validation fails.
     * This method is bound to the form's submit event.
     * @returns {void}
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
                    o = a[5],
                    p = a[6],
                    q = a[7];
                if (q === false && r.val().length === 0 && $("#" + p).val().length === 0) return;
                if ("registerPassword" === a[0]) {
                    var u = a[6],
                        C = $("#" + u);
                }
                i = "",
                    i += this.lengthCheck(r, n, l),
                    i += this.illegalCharCheck(r, c),
                    i += this.necessaryCharCheck(r, o),
                "requireEmail" === a[0] && (i += this.emailCheck(r)),
                "registerPassword" === a[0] && (
                    i += this.capitalCheck(r),
                        i += this.numberCheck(r),
                        i += this.specialCharCheck(r),
                        e += this.passwordMatchCheck(r, C)
                ),
                i && (
                    this.showWarning(r, h, i),
                        this.submitDisabled(!0, "Error, please check your form"),
                        t.preventDefault()
                ),
                e && (
                    this.showWarning(C, u, e),
                        this.submitDisabled(!0, "Error, please check your form"),
                        t.preventDefault()
                )
            })
        })
    }

    /**
     * Displays a warning message for a target element and updates its validation state.
     * @param {jQuery} target_element - The jQuery object of the input element to validate.
     * @param {string} element_id - The ID of the input element, used for generating feedback element IDs.
     * @param {string} warning_message - The warning message to display.
     */
    showWarning(target_element, element_id, warning_message) {
        warning_message ? (this.generateFeedback(target_element, element_id, "invalid-feedback", warning_message), this.makeInvalid(target_element)) : (this.generateFeedback(target_element, element_id, "", ""), this.makeValid(target_element))
    }

    /**
     * Marks an input element as valid by adding the appropriate class.
     * @param {jQuery} target_element - The jQuery object of the input element to mark as valid.
     */
    makeValid(target_element) {
        target_element.hasClass(this.validC) || target_element.addClass(this.validC), target_element.hasClass(this.invalidC) && target_element.removeClass(this.invalidC)
    }

    /**
     * Removes the validation state from an input element.
     * @param {jQuery} target_element - The jQuery object of the input element to clear validation state.
     */
    removeValid(target_element) {
        target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }

    /**
     * Marks an input element as invalid by adding the appropriate class.
     * @param {jQuery} target_element - The jQuery object of the input element to mark as invalid.
     */
    makeInvalid(target_element) {
        target_element.hasClass(this.invalidC) || target_element.addClass(this.invalidC), target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }

    /**
     * Adds an asterisk (*) symbol before a target element to indicate it is required.
     * @param {jQuery} target_element - The jQuery object of the input element to mark as required.
     */
    createAsterisk(target_element) {
        $("<span class='text-danger'>*</span>").insertBefore(target_element)
    }

    /**
     * Generates and displays a feedback message for an input element.
     * @param {jQuery} target_element - The jQuery object of the input element to provide feedback for.
     * @param {string} element_id - The ID of the input element, used for generating feedback element IDs.
     * @param {string} class_value - The class to apply to the feedback element, indicating validation state.
     * @param {string} inner_text - The feedback message to display.
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
