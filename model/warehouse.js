class Warehouse {
    constructor(obj) {
        this.obj = obj;
        this.requiredKeys = [
            'warehouse_name',
            'address',
            'city',
            'country',
            'contact_name',
            'contact_position',
            'contact_phone',
            'contact_email'
        ];
    }

    //check phone number formatting function (returns null if it doesn't match)
    validPhoneNo(phoneNo) {
        //use regex to ensure phone number is flexible on formatting
        return phoneNo.match(/^\+?\d*\s?\(?\d{3}\)?\s?\d{3}[\s-]?\d{4}$/);
    }

    //check email formatting function (returns null if it doesn't match)
    validEmail(email) {
        //use regex to ensure proper email formatting is used by user
        return email.match(/^[\w.-]+@[\w.-]+\.\w+$/);
    }

    validWarehouse() {
        //instantiated array that gives all keys requested by user
        const requestedKeys = Object.keys(this.obj);
        
        //filter through all required keys. Assign any missing to an array, to be returned as an error message
        const missingKeys = this.requiredKeys.filter(key => !requestedKeys.includes(key));
        //if any keys are missing, return object displaying input not valid, with all missing keys
        if(missingKeys.length) {
            return {
                validKeys: false,
                invalidKeys: missingKeys,
                errorMessage: `Keys missing from requested warehouse: ${missingKeys.map(e => ` '${e}'`)}`
            };
        }

        //create an array of 'emptyValues' if any values are empty
        const emptyValues = Object.entries(this.obj).filter(
            value => value[1] === null ||
            value[1] === undefined || 
            (typeof value[1] === 'string' && value[1].trim() === "")
        );
        //if any values are missing, return object displaying input not valid, with all missing values
        if(emptyValues.length) {
            return {
                validKeys: true,
                validValues: false,
                invalidValues: emptyValues,
                errorMessage: `Values missing from requested warehouse: '${emptyValues.map(e => `{ ${e[0]}: '${e[1]}' }`)}`
            };
        }
        //if user entered 'contact_phone' doesn't match desired format, return an error
        if(!this.validPhoneNo(this.obj.contact_phone)){
            return {
                validKeys: true,
                validValues: true,
                phoneFormat: false,
                errorMessage: `${this.obj.contact_phone} is not a valid phone number format.`
            }
        }
        //if user entered 'contact_email' doesn't match desired format, return an error
        if(!this.validEmail(this.obj.contact_email)){
            return {
                validKeys: true,
                validValues: true,
                phoneFormat: true,
                emailFormat: false,
                errorMessage: `${this.obj.contact_email} is not a valid email format.`
            }
        }

        //passed all validation, return all true
        return { 
            validKeys: true,
            validValues: true,
            phoneFormat: true,
            emailFormat: true
        };
    }
}

export default Warehouse;