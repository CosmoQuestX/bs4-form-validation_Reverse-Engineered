/* https://github.com/colmeye */
function $ (t) {return document.body}

/**
 * Represents a form validator that manipulates form elements based on validation rules.
 */
class Validation {

    /**
     * Creates an instance of the Validation class.
     * @param {string} form_id The ID of the form to be validated.
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
     * @param target_element_id
     * @param exclusive_min_length
     * @param exclusive_max_length
     * @param array_of_SOMETHING
     * @param another_array_of_SOMETHING
     * @returns {*}
     */
    requireText(target_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING) {
        let target_element = $("#" + target_element_id),
            response_text = "";
        return this.createAsterisk(target_element),
            this.inputLog.push(["requireText", target_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING]),
            $(target_element).on("input focus", target_element, () => {
                response_text = "",
                response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length),
                    response_text += this.illegalCharCheck(target_element, array_of_SOMETHING),
                    this.showWarning(target_element, target_element_id, response_text)
            }),
            $(target_element).on("input", target_element, () => {
                this.submitDisabled(!1, this.submitButtonText)
            }),
            $(target_element).on("focusout", target_element, () => {
                response_text += this.necessaryCharCheck(target_element, another_array_of_SOMETHING), this.showWarning(target_element, target_element_id, response_text), this.removeValid(target_element)
            }),
            response_text
    }

    /**
     * Requires an email input to meet specific length and character limits.
     * @param target_element_id
     * @param exclusive_min_length
     * @param exclusive_max_length
     * @param array_of_SOMETHING
     * @param another_array_of_SOMETHING
     * @returns {*}
     */
    requireEmail(target_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING) {
        let target_element = $("#" + target_element_id),
            response_text = "";
        return this.createAsterisk(target_element), this.inputLog.push(["requireEmail", target_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING]), $(target_element).on("input focus", target_element, () => {
            response_text = "", response_text += this.lengthCheck(target_element, exclusive_min_length, exclusive_max_length), response_text += this.illegalCharCheck(target_element, array_of_SOMETHING), this.showWarning(target_element, target_element_id, response_text)
        }), $(target_element).on("input", target_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        }), $(target_element).on("focusout", target_element, () => {
            response_text += this.necessaryCharCheck(target_element, another_array_of_SOMETHING), response_text += this.emailCheck(target_element), this.showWarning(target_element, target_element_id, response_text), this.removeValid(target_element)
        }), response_text
    }

    /**
     * Requires a password input to meet specific length and character limits while also checking if the confirmation field matches.
     * @param password_element_id
     * @param exclusive_min_length
     * @param exclusive_max_length
     * @param array_of_SOMETHING
     * @param another_array_of_SOMETHING
     * @param confirm_password_element_id
     * @returns {*}
     */
    registerPassword(password_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING, confirm_password_element_id) {
        let password_element = $("#" + password_element_id),
            confirm_password_element = $("#" + confirm_password_element_id),
            l = "",
            c = "";
        return this.createAsterisk(password_element), this.createAsterisk(confirm_password_element), this.inputLog.push(["registerPassword", password_element_id, exclusive_min_length, exclusive_max_length, array_of_SOMETHING, another_array_of_SOMETHING, confirm_password_element_id]), $(password_element).on("input focus", password_element, () => {
            l = "", l += this.lengthCheck(password_element, exclusive_min_length, exclusive_max_length), l += this.illegalCharCheck(password_element, array_of_SOMETHING), this.showWarning(password_element, password_element_id, l), c = "", c += this.passwordMatchCheck(password_element, confirm_password_element), this.showWarning(confirm_password_element, confirm_password_element_id, c)
        }), $(password_element).on("input", password_element, () => {
            this.submitDisabled(!1, this.submitButtonText)
        }), $(password_element).on("focusout", password_element, () => {
            l += this.necessaryCharCheck(password_element, another_array_of_SOMETHING), l += this.capitalCheck(password_element), l += this.numberCheck(password_element), l += this.specialCharCheck(password_element), this.showWarning(password_element, password_element_id, l), this.removeValid(password_element), this.removeValid(confirm_password_element)
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
     * @param target_element
     * @param exclusive_min_length
     * @param exclusive_max_length
     * @returns {string|string}
     */
    lengthCheck(target_element, exclusive_min_length, exclusive_max_length) {
        return target_element.val().length <= exclusive_min_length ? "Must be longer than " + exclusive_min_length + " characters. " : target_element.val().length >= exclusive_max_length ? "Must be shorter than " + exclusive_max_length + " characters. " : ""
    }

    /**
     * Checks for illegal characters in the input value based on a provided array of such characters.
     * @param target_element
     * @param array_of_SOMETHING
     * @returns {*}
     */
    illegalCharCheck(target_element, array_of_SOMETHING) {
        let i = "";
        return $(array_of_SOMETHING).each(function() {
            target_element.val().indexOf(this) >= 0 && (0 == !this.trim().length ? i += " " + this : i += " spaces")
        }), "" === i ? "" : "Cannot use:" + i + ". "
    }
    necessaryCharCheck(target_element, array_of_SOMETHING) {
        let i = "";
        return $(array_of_SOMETHING).each(function() {
            target_element.val().indexOf(this) >= 0 || (i += " " + this)
        }), "" === i ? "" : "Must contain:" + i + ". "
    }
    numberCheck(target_element) {
        return target_element.val().match(/\d/) ? "" : "Must contain a number. "
    }
    specialCharCheck(target_element) {
        return target_element.val().match(/\W|_/g) ? "" : "Must contain a special character. "
    }
    capitalCheck(target_element) {
        return target_element.val().match(/[A-Z]+/) ? "" : "Must contain capital letter. "
    }
    passwordMatchCheck(password_element, confirm_password_element) {
        return password_element.val() === confirm_password_element.val() ? "" : "Passwords do not match. "
    }
    emailCheck(target_element) {
        return target_element.val().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "" : "Is not a proper email"
    }
    submitDisabled(t, s) {
        $(this.submitButton).prop("disabled", t), $(this.submitButton).val(s)
    }
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
    showWarning(target_element, element_id, warning_message) {
        warning_message ? (this.generateFeedback(target_element, element_id, "invalid-feedback", warning_message), this.makeInvalid(target_element)) : (this.generateFeedback(target_element, element_id, "", ""), this.makeValid(target_element))
    }
    makeValid(target_element) {
        target_element.hasClass(this.validC) || target_element.addClass(this.validC), target_element.hasClass(this.invalidC) && target_element.removeClass(this.invalidC)
    }
    removeValid(target_element) {
        target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }
    makeInvalid(target_element) {
        target_element.hasClass(this.invalidC) || target_element.addClass(this.invalidC), target_element.hasClass(this.validC) && target_element.removeClass(this.validC)
    }
    createAsterisk(target_element) {
        $("<span class='text-danger'>*</span>").insertBefore(target_element)
    }
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
